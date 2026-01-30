'use server';

import { createAdminSession } from '@/server/clients';
import { Query } from 'node-appwrite';
import { appwritecfg } from '@/config/appwrite.config';

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    productsSold: number;
    activeUsers: number;
    revenueGrowth: number;
    ordersGrowth: number;
}

export interface RecentOrder {
    $id: string;
    totalAmount: string;
    status: string;
    $createdAt: string;
    branchName?: string;
}

export interface LowStockAlert {
    $id: string;
    productName: string;
    branchName: string;
    quantityAvailable: number;
    status: 'CRITICAL' | 'LOW';
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const { tables } = await createAdminSession();

        // Get all paid orders
        const ordersResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            queries: [Query.equal('status', 'PAID')],
        });

        // Calculate total revenue
        const totalRevenue = ordersResponse.rows.reduce((sum, order: any) => {
            return sum + parseFloat(order.totalAmount || '0');
        }, 0);

        // Get total orders count (all statuses)
        const allOrdersResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
        });

        const totalOrders = allOrdersResponse.total;

        // Calculate products sold from order items
        const orderItemsResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orderItems,
        });

        const productsSold = orderItemsResponse.rows.reduce((sum, item: any) => {
            return sum + (item.quantity || 0);
        }, 0);

        // Get active users count
        const usersResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.users,
        });

        const activeUsers = usersResponse.total;

        // Calculate growth (simplified - comparing to previous month would require date filtering)
        // For now, we'll return 0 for growth metrics
        const revenueGrowth = 0;
        const ordersGrowth = 0;

        return {
            totalRevenue,
            totalOrders,
            productsSold,
            activeUsers,
            revenueGrowth,
            ordersGrowth,
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            totalRevenue: 0,
            totalOrders: 0,
            productsSold: 0,
            activeUsers: 0,
            revenueGrowth: 0,
            ordersGrowth: 0,
        };
    }
}

/**
 * Get recent orders for dashboard
 */
export async function getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            queries: [
                Query.orderDesc('$createdAt'),
                Query.limit(limit),
            ],
        });

        // Populate branch names
        const ordersWithBranches = await Promise.all(
            response.rows.map(async (order: any) => {
                try {
                    const branch = await tables.getRow({
                        databaseId: appwritecfg.databaseId,
                        tableId: appwritecfg.tables.branches,
                        rowId: order.branchId,
                    });

                    return {
                        $id: order.$id,
                        totalAmount: order.totalAmount,
                        status: order.status,
                        $createdAt: order.$createdAt,
                        branchName: branch.name,
                    };
                } catch {
                    return {
                        $id: order.$id,
                        totalAmount: order.totalAmount,
                        status: order.status,
                        $createdAt: order.$createdAt,
                        branchName: 'Unknown',
                    };
                }
            })
        );

        return ordersWithBranches;
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        return [];
    }
}

/**
 * Get low stock alerts for dashboard
 */
export async function getLowStockAlerts(limit: number = 5): Promise<LowStockAlert[]> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.inventory,
            queries: [
                Query.lessThan('quantityAvailable', 200),
                Query.orderAsc('quantityAvailable'),
                Query.limit(limit),
            ],
        });

        // Populate product and branch details
        const alertsWithDetails = await Promise.all(
            response.rows.map(async (inv: any) => {
                try {
                    const [branch, product] = await Promise.all([
                        tables.getRow({
                            databaseId: appwritecfg.databaseId,
                            tableId: appwritecfg.tables.branches,
                            rowId: inv.branchId,
                        }),
                        tables.getRow({
                            databaseId: appwritecfg.databaseId,
                            tableId: appwritecfg.tables.products,
                            rowId: inv.productId,
                        }),
                    ]);

                    const status: 'CRITICAL' | 'LOW' = inv.quantityAvailable < 100 ? 'CRITICAL' : 'LOW';

                    return {
                        $id: inv.$id,
                        productName: product.name,
                        branchName: branch.name,
                        quantityAvailable: inv.quantityAvailable,
                        status,
                    };
                } catch {
                    return null;
                }
            })
        );

        return alertsWithDetails.filter((alert): alert is LowStockAlert => alert !== null);
    } catch (error) {
        console.error('Error fetching low stock alerts:', error);
        return [];
    }
}
