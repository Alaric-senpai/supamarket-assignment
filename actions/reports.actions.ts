'use server';

import { appwritecfg } from '@/config/appwrite.config';

import { createAdminSession } from '@/server/clients';
import { Query } from 'node-appwrite';
import type { SalesSummary, ProductSales, BranchSales } from '@/lib/types';


/**
 * Get sales summary with optional date range
 */
export async function getSalesSummary(
    dateFrom?: string,
    dateTo?: string
): Promise<SalesSummary> {
    try {
        const { tables } = await createAdminSession();

        const queries = [Query.equal('status', 'PAID')];

        if (dateFrom) {
            queries.push(Query.greaterThanEqual('$createdAt', dateFrom));
        }

        if (dateTo) {
            queries.push(Query.lessThanEqual('$createdAt', dateTo));
        }

        const ordersResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            queries,
        });

        const orders = ordersResponse.rows;

        // Calculate totals
        let totalRevenue = 0;
        let totalUnits = 0;

        for (const order of orders) {
            totalRevenue += parseFloat(order.totalAmount);

            // Get order items to count units
            const itemsResponse = await tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.orderItems,
                queries: [Query.equal('orderId', order.$id)],
            });

            for (const item of itemsResponse.rows) {
                totalUnits += item.quantity;
            }
        }

        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return {
            totalUnits,
            totalRevenue,
            totalOrders,
            averageOrderValue,
            dateRange: dateFrom && dateTo ? { from: dateFrom, to: dateTo } : undefined,
        };
    } catch (error) {
        console.error('Error fetching sales summary:', error);
        throw new Error('Failed to fetch sales summary');
    }
}

/**
 * Get sales breakdown by product
 */
export async function getSalesByProduct(
    dateFrom?: string,
    dateTo?: string
): Promise<ProductSales[]> {
    try {
        const { tables } = await createAdminSession();

        const queries = [Query.equal('status', 'PAID')];

        if (dateFrom) {
            queries.push(Query.greaterThanEqual('$createdAt', dateFrom));
        }

        if (dateTo) {
            queries.push(Query.lessThanEqual('$createdAt', dateTo));
        }

        const ordersResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            queries,
        });

        const orders = ordersResponse.rows;

        // Aggregate sales by product
        const productSalesMap = new Map<
            string,
            { productId: string; productName: string; unitsSold: number; revenue: number }
        >();

        for (const order of orders) {
            const itemsResponse = await tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.orderItems,
                queries: [Query.equal('orderId', order.$id)],
            });

            for (const item of itemsResponse.rows) {
                const existing = productSalesMap.get(item.productId);

                if (existing) {
                    existing.unitsSold += item.quantity;
                    existing.revenue += parseFloat(item.subtotal);
                } else {
                    // Get product name
                    const product = await tables.getRow({
                        databaseId: appwritecfg.databaseId,
                        tableId: appwritecfg.tables.products,
                        rowId: item.productId,
                    });

                    productSalesMap.set(item.productId, {
                        productId: item.productId,
                        productName: product.name,
                        unitsSold: item.quantity,
                        revenue: parseFloat(item.subtotal),
                    });
                }
            }
        }

        // Calculate total revenue for percentage
        const totalRevenue = Array.from(productSalesMap.values()).reduce(
            (sum, p) => sum + p.revenue,
            0
        );

        // Convert to array with percentages
        const productSales: ProductSales[] = Array.from(productSalesMap.values()).map(
            (p) => ({
                productId: p.productId,
                productName: p.productName,
                unitsSold: p.unitsSold,
                revenue: p.revenue,
                avgPrice: p.revenue / p.unitsSold,
                percentageOfTotal: totalRevenue > 0 ? (p.revenue / totalRevenue) * 100 : 0,
            })
        );

        // Sort by revenue descending
        productSales.sort((a, b) => b.revenue - a.revenue);

        return productSales;
    } catch (error) {
        console.error('Error fetching sales by product:', error);
        throw new Error('Failed to fetch sales by product');
    }
}

/**
 * Get sales breakdown by branch
 */
export async function getSalesByBranch(
    dateFrom?: string,
    dateTo?: string
): Promise<BranchSales[]> {
    try {
        const { tables } = await createAdminSession();

        const queries = [Query.equal('status', 'PAID')];

        if (dateFrom) {
            queries.push(Query.greaterThanEqual('$createdAt', dateFrom));
        }

        if (dateTo) {
            queries.push(Query.lessThanEqual('$createdAt', dateTo));
        }

        const ordersResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            queries,
        });

        const orders = ordersResponse.rows;

        // Aggregate sales by branch
        const branchSalesMap = new Map<
            string,
            {
                branchId: string;
                branchName: string;
                unitsSold: number;
                revenue: number;
                products: Map<string, { productName: string; units: number; revenue: number }>;
            }
        >();

        for (const order of orders) {
            // Get branch details
            if (!branchSalesMap.has(order.branchId)) {
                const branch = await tables.getRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.branches,
                    rowId: order.branchId,
                });

                branchSalesMap.set(order.branchId, {
                    branchId: order.branchId,
                    branchName: branch.name,
                    unitsSold: 0,
                    revenue: 0,
                    products: new Map(),
                });
            }

            const branchData = branchSalesMap.get(order.branchId)!;
            branchData.revenue += parseFloat(order.totalAmount);

            // Get order items
            const itemsResponse = await tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.orderItems,
                queries: [Query.equal('orderId', order.$id)],
            });

            for (const item of itemsResponse.rows) {
                branchData.unitsSold += item.quantity;

                // Get product name
                const product = await tables.getRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.products,
                    rowId: item.productId,
                });

                const existingProduct = branchData.products.get(item.productId);

                if (existingProduct) {
                    existingProduct.units += item.quantity;
                    existingProduct.revenue += parseFloat(item.subtotal);
                } else {
                    branchData.products.set(item.productId, {
                        productName: product.name,
                        units: item.quantity,
                        revenue: parseFloat(item.subtotal),
                    });
                }
            }
        }

        // Convert to array
        const branchSales: BranchSales[] = Array.from(branchSalesMap.values()).map(
            (b) => ({
                branchId: b.branchId,
                branchName: b.branchName,
                unitsSold: b.unitsSold,
                revenue: b.revenue,
                products: Array.from(b.products.values()),
            })
        );

        // Sort by revenue descending
        branchSales.sort((a, b) => b.revenue - a.revenue);

        return branchSales;
    } catch (error) {
        console.error('Error fetching sales by branch:', error);
        throw new Error('Failed to fetch sales by branch');
    }
}
