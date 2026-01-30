'use server';

import { appwritecfg } from '@/config/appwrite.config';

import { createAdminSession } from '@/server/clients';
import { Query } from 'node-appwrite';
import type { Payments, PaymentsStatus, InitiatePaymentInput } from '@/lib/types';
import { initiateSTKPush, formatPhoneNumber } from '@/lib/mpesa';
import { getOrderById } from './orders.actions';


/**
 * Initiate M-Pesa payment for an order
 */
export async function initiatePayment(
    input: InitiatePaymentInput
): Promise<{ success: boolean; checkoutRequestId?: string; message?: string }> {
    try {
        const { tables } = await createAdminSession();
        const { orderId, phoneNumber } = input;

        // Get order details
        const order = await getOrderById(orderId);

        if (!order) {
            return {
                success: false,
                message: 'Order not found',
            };
        }

        // Check if order is pending or failed (to allow retry)
        if (order.status !== 'PENDING' && order.status !== 'FAILED') {
            return {
                success: false,
                message: `Order is not eligible for payment (Current status: ${order.status})`,
            };
        }

        // If it was failed, we'll effectively be retrying it
        if (order.status === 'FAILED') {
            await tables.updateRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.orders,
                rowId: orderId,
                data: { status: 'PENDING' },
            });
        }

        // Format phone number
        const formattedPhone = formatPhoneNumber(phoneNumber);

        // Get payment record
        const paymentResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.payments,
            queries: [Query.equal('orderId', orderId)],
        });

        if (paymentResponse.rows.length === 0) {
            return {
                success: false,
                message: 'Payment record not found',
            };
        }

        const payment = paymentResponse.rows[0];

        // Initiate STK Push
        const stkResponse = await initiateSTKPush({
            phoneNumber: formattedPhone,
            amount: parseFloat(order.totalAmount),
            orderId: order.$id,
            accountReference: `ORDER-${order.$id.substring(0, 8)}`,
        });

        if (!stkResponse.success) {
            // Update payment with error
            await tables.updateRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.payments,
                rowId: payment.$id,
                data: {
                    phoneNumber: formattedPhone,
                    errorMessage: stkResponse.error || 'STK Push failed',
                },
            });

            return {
                success: false,
                message: stkResponse.error || 'Failed to initiate payment',
            };
        }

        // Update payment record with checkout request ID and phone
        await tables.updateRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.payments,
            rowId: payment.$id,
            data: {
                phoneNumber: formattedPhone,
                mpesaCheckoutRequestId: stkResponse.checkoutRequestId,
                status: 'PENDING',
            },
        });

        console.log(
            `Payment initiated for order ${orderId}: CheckoutRequestID ${stkResponse.checkoutRequestId}`
        );

        return {
            success: true,
            checkoutRequestId: stkResponse.checkoutRequestId,
            message: 'STK push sent. Please check your phone.',
        };
    } catch (error) {
        console.error('Error initiating payment:', error);
        return {
            success: false,
            message: 'Failed to initiate payment',
        };
    }
}

/**
 * Get payment status for an order
 */
export async function getPaymentStatus(
    orderId: string
): Promise<Payments | null> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.payments,
            queries: [Query.equal('orderId', orderId)],
        });

        if (response.rows.length === 0) {
            return null;
        }

        return response.rows[0] as unknown as Payments;
    } catch (error) {
        console.error(`Error fetching payment status for order ${orderId}:`, error);
        return null;
    }
}

/**
 * Get payment by checkout request ID
 * Used by M-Pesa callback
 */
export async function getPaymentByCheckoutRequestId(
    checkoutRequestId: string
): Promise<Payments | null> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.payments,
            queries: [Query.equal('mpesaCheckoutRequestId', checkoutRequestId)],
        });

        if (response.rows.length === 0) {
            return null;
        }

        return response.rows[0] as unknown as Payments;
    } catch (error) {
        console.error(
            `Error fetching payment by checkout request ID ${checkoutRequestId}:`,
            error
        );
        return null;
    }
}

/**
 * Update payment status (internal use - called by callback)
 */
export async function updatePaymentStatus(
    paymentId: string,
    status: 'PENDING' | 'SUCCESS' | 'FAILED',
    mpesaReceiptNumber?: string,
    errorMessage?: string
): Promise<void> {
    try {
        const { tables } = await createAdminSession();

        const updateData: any = {
            status,
            transactionDate: new Date().toISOString(),
        };

        if (mpesaReceiptNumber) {
            updateData.mpesaReceiptNumber = mpesaReceiptNumber;
        }

        if (errorMessage) {
            updateData.errorMessage = errorMessage;
        }

        await tables.updateRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.payments,
            rowId: paymentId,
            data: updateData,
        });

        console.log(`Payment ${paymentId} status updated to ${status}`);
    } catch (error) {
        console.error(`Error updating payment ${paymentId} status:`, error);
        throw error;
    }
}

/**
 * Get all payments (admin only)
 */
export async function getAllPayments(limit: number = 50): Promise<Payments[]> {
    try {
        const { tables } = await createAdminSession();

        const response = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.payments,
            queries: [Query.orderDesc('$createdAt'), Query.limit(limit)],
        });

        return response.rows as unknown as Payments[];
    } catch (error) {
        console.error('Error fetching all payments:', error);
        throw new Error('Failed to fetch payments');
    }
}
