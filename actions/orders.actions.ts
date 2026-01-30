'use server';

import { appwritecfg } from '@/config/appwrite.config';

import { createAdminSession } from '@/server/clients';
import { Query, ID } from 'node-appwrite';
import type { Orders, OrderItems, OrdersStatus, CreateOrderInput, OrderWithRelations, OrderItemWithRelations } from '@/lib/types';
import { validateStock } from './inventory.actions';
import { getProductPrice } from './products.actions';


/**
 * Create a new order
 * Validates stock and creates order with items
 */
export async function createOrder(
    userId: string,
    input: CreateOrderInput
): Promise<{ success: boolean; orderId?: string; message?: string }> {
    try {
        const { tables } = await createAdminSession();
        const { branchId, items } = input;

        // Validate inputs
        if (!branchId || !items || items.length === 0) {
            return {
                success: false,
                message: 'Invalid order data',
            };
        }

        // Validate stock for all items
        for (const item of items) {
            const stockCheck = await validateStock(
                branchId,
                item.productId,
                item.quantity
            );

            if (!stockCheck.valid) {
                return {
                    success: false,
                    message: stockCheck.message || 'Insufficient stock',
                };
            }
        }

        // Calculate total amount and prepare order items
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const price = await getProductPrice(item.productId);
            const subtotal = price * item.quantity;
            totalAmount += subtotal;

            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: price,
                subtotal,
            });
        }

        // Create order
        const order = await tables.createRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            rowId: ID.unique(),
            data: {
                userId,
                branchId,
                totalAmount: totalAmount.toString(),
                status: 'PENDING',
            },
        });

        // Create order items
        for (const itemData of orderItemsData) {
            await tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.orderItems,
                rowId: ID.unique(),
                data: {
                    orderId: order.$id,
                    ...itemData,
                    unitPrice: itemData.unitPrice.toString(),
                    subtotal: itemData.subtotal.toString(),
                },
            });
        }

        // Create payment record
        await tables.createRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.payments,
            rowId: ID.unique(),
            data: {
                orderId: order.$id,
                phoneNumber: '', // Will be updated when payment is initiated
                amount: totalAmount.toString(),
                status: 'PENDING',
            },
        });

        console.log(`Order created: ${order.$id}, Total: KES ${totalAmount}`);

        return {
            success: true,
            orderId: order.$id,
            message: 'Order created successfully',
        };
    } catch (error) {
        console.error('Error creating order:', error);
        return {
            success: false,
            message: 'Failed to create order',
        };
    }
}

/**
 * Get order by ID with items and payment details
 */
export async function getOrderById(orderId: string): Promise<OrderWithRelations | null> {
    try {
        const { tables } = await createAdminSession();

        const order = await tables.getRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            rowId: orderId,
        });

        // Get order items
        const itemsResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orderItems,
            queries: [Query.equal('orderId', orderId)],
        });

        // Populate product details for each item
        const itemsWithProducts = await Promise.all(
            itemsResponse.rows.map(async (item: any) => {
                const product = await tables.getRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.products,
                    rowId: item.productId,
                });

                return {
                    ...item,
                    product,
                } as unknown as OrderItemWithRelations;
            })
        );

        // Get payment details
        const paymentResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.payments,
            queries: [Query.equal('orderId', orderId)],
        });

        const payment = paymentResponse.rows[0] || null;

        // Get branch details
        const branch = await tables.getRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.branches,
            rowId: order.branchId,
        });

        return {
            ...order,
            branch,
            items: itemsWithProducts,
            payment,
        } as unknown as OrderWithRelations;
    } catch (error) {
        console.error(`Error fetching order ${orderId}:`, error);
        return null;
    }
}

/**
 * Get all orders for a customer
 */
export async function getCustomerOrders(userId: string): Promise<OrderWithRelations[]> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            queries: [
                Query.equal('userId', userId),
                Query.orderDesc('$createdAt'),
                Query.limit(50),
            ],
        });

        // Populate details for each order
        const ordersWithDetails = await Promise.all(
            response.rows.map(async (order: any) => {
                const branch = await tables.getRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.branches,
                    rowId: order.branchId,
                });

                // Get payment status
                const paymentResponse = await tables.listRows({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.payments,
                    queries: [Query.equal('orderId', order.$id)],
                });

                const payment = paymentResponse.rows[0] || null;

                return {
                    ...order,
                    branch,
                    payment,
                } as unknown as OrderWithRelations;
            })
        );

        return ordersWithDetails;
    } catch (error) {
        console.error(`Error fetching orders for user ${userId}:`, error);
        throw new Error('Failed to fetch orders');
    }
}

/**
 * Get all orders (admin only)
 */
export async function getAllOrders(limit: number = 50): Promise<OrderWithRelations[]> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            queries: [Query.orderDesc('$createdAt'), Query.limit(limit)],
        });

        // Populate details for each order
        const ordersWithDetails = await Promise.all(
            response.rows.map(async (order: any) => {
                const branch = await tables.getRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.branches,
                    rowId: order.branchId,
                });

                return {
                    ...order,
                    branch,
                } as unknown as OrderWithRelations;
            })
        );

        return ordersWithDetails;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw new Error('Failed to fetch orders');
    }
}

/**
 * Cancel an order (only if status is PENDING)
 */
export async function cancelOrder(
    orderId: string,
    userId: string
): Promise<{ success: boolean; message?: string }> {
    try {
        const { tables } = await createAdminSession();

        // Get order
        const order = await tables.getRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            rowId: orderId,
        });

        // Check if order belongs to user
        if (order.userId !== userId) {
            return {
                success: false,
                message: 'Unauthorized to cancel this order',
            };
        }

        // Check if order is pending
        if (order.status !== 'PENDING') {
            return {
                success: false,
                message: 'Only pending orders can be cancelled',
            };
        }

        // Update order status
        await tables.updateRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            rowId: orderId,
            data: {
                status: 'CANCELLED',
            },
        });

        // Update payment status
        const paymentResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.payments,
            queries: [Query.equal('orderId', orderId)],
        });

        if (paymentResponse.rows.length > 0) {
            await tables.updateRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.payments,
                rowId: paymentResponse.rows[0].$id,
                data: {
                    status: 'FAILED',
                    errorMessage: 'Order cancelled by customer',
                },
            });
        }

        return {
            success: true,
            message: 'Order cancelled successfully',
        };
    } catch (error) {
        console.error(`Error cancelling order ${orderId}:`, error);
        return {
            success: false,
            message: 'Failed to cancel order',
        };
    }
}

/**
 * Update order status (internal use)
 */
export async function updateOrderStatus(
    orderId: string,
    status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED',
    paidAt?: string
): Promise<void> {
    try {
        const { tables } = await createAdminSession();

        const updateData: any = { status };
        if (paidAt) {
            updateData.paidAt = paidAt;
        }

        await tables.updateRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            rowId: orderId,
            data: updateData,
        });

        console.log(`Order ${orderId} status updated to ${status}`);
    } catch (error) {
        console.error(`Error updating order ${orderId} status:`, error);
        throw error;
    }
}

/**
 * Delete an order and its associated records
 */
export async function deleteOrder(
    orderId: string,
    userId: string
): Promise<{ success: boolean; message?: string }> {
    try {
        const { tables } = await createAdminSession();

        // 1. Fetch the order to verify ownership and status
        const order = await tables.getRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            rowId: orderId,
        });

        if (order.userId !== userId) {
            return {
                success: false,
                message: 'Unauthorized: You do not own this order',
            };
        }

        // 2. Only allow deleting PENDING, FAILED, or CANCELLED orders
        const allowedStatuses = ['PENDING', 'FAILED', 'CANCELLED'];
        if (!allowedStatuses.includes(order.status)) {
            return {
                success: false,
                message: `Cannot delete an order with status: ${order.status}`,
            };
        }

        // 3. Delete related order items
        const itemsResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orderItems,
            queries: [Query.equal('orderId', orderId)],
        });

        for (const item of itemsResponse.rows) {
            await tables.deleteRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.orderItems,
                rowId: item.$id,
            });
        }

        // 4. Delete related payment records
        const paymentResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.payments,
            queries: [Query.equal('orderId', orderId)],
        });

        for (const payment of paymentResponse.rows) {
            await tables.deleteRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.payments,
                rowId: payment.$id,
            });
        }

        // 5. Delete the order itself
        await tables.deleteRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            rowId: orderId,
        });

        console.log(`Order ${orderId} and all related records deleted by user ${userId}`);

        return {
            success: true,
            message: 'Order deleted successfully',
        };
    } catch (error: any) {
        console.error(`Error deleting order ${orderId}:`, error);
        return {
            success: false,
            message: error?.message || 'Failed to delete order',
        };
    }
}
