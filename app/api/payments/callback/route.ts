// M-Pesa Payment Callback Handler
// This endpoint receives payment confirmations from M-Pesa

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession } from '@/server/clients';
import { Query } from 'node-appwrite';
import type { MpesaCallbackBody } from '@/lib/types';
import { deductInventory } from '@/actions/inventory.actions';
import { updateOrderStatus } from '@/actions/orders.actions';
import { updatePaymentStatus } from '@/actions/payments.actions';
import { appwritecfg } from '@/config/appwrite.config';


export async function POST(request: NextRequest) {
    try {
        const { tables } = await createAdminSession();
        const body: MpesaCallbackBody = await request.json();

        console.log('M-Pesa Callback received:', JSON.stringify(body, null, 2));

        const { stkCallback } = body.Body;
        const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

        // Find payment by checkout request ID
        const paymentResponse = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.payments,
            queries: [Query.equal('mpesaCheckoutRequestId', CheckoutRequestID)],
        });

        if (paymentResponse.rows.length === 0) {
            console.error(`Payment not found for CheckoutRequestID: ${CheckoutRequestID}`);
            return NextResponse.json(
                { message: 'Payment not found' },
                { status: 404 }
            );
        }

        const payment = paymentResponse.rows[0];
        const orderId = payment.orderId;

        // Get order details
        const order = await tables.getRow({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.orders,
            rowId: orderId,
        });

        // ResultCode 0 = Success
        if (ResultCode === 0) {
            console.log(`Payment successful for order ${orderId}`);

            // Extract M-Pesa receipt number from callback metadata
            let mpesaReceiptNumber = '';
            if (CallbackMetadata?.Item) {
                const receiptItem = CallbackMetadata.Item.find(
                    (item) => item.Name === 'MpesaReceiptNumber'
                );
                if (receiptItem) {
                    mpesaReceiptNumber = String(receiptItem.Value);
                }
            }

            // Update payment status
            await updatePaymentStatus(
                payment.$id,
                'SUCCESS',
                mpesaReceiptNumber,
                undefined
            );

            // Update order status
            await updateOrderStatus(orderId, 'PAID', new Date().toISOString());

            // Deduct inventory for each order item
            const orderItemsResponse = await tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.orderItems,
                queries: [Query.equal('orderId', orderId)],
            });

            for (const item of orderItemsResponse.rows) {
                const result = await deductInventory(
                    order.branchId,
                    item.productId,
                    item.quantity
                );

                if (!result.success) {
                    console.error(
                        `Failed to deduct inventory for order ${orderId}, product ${item.productId}:`,
                        result.message
                    );
                }
            }

            console.log(`Order ${orderId} completed successfully`);
        } else {
            // Payment failed
            console.log(`Payment failed for order ${orderId}: ${ResultDesc}`);

            // Update payment status
            await updatePaymentStatus(payment.$id, 'FAILED', undefined, ResultDesc);

            // Update order status
            await updateOrderStatus(orderId, 'FAILED');
        }

        // Always return 200 to acknowledge receipt
        return NextResponse.json({ message: 'Callback processed' }, { status: 200 });
    } catch (error) {
        console.error('Error processing M-Pesa callback:', error);

        // Still return 200 to prevent M-Pesa from retrying
        return NextResponse.json(
            { message: 'Callback received but processing failed' },
            { status: 200 }
        );
    }
}

// Handle GET requests (for testing)
export async function GET() {
    return NextResponse.json(
        { message: 'M-Pesa callback endpoint is active' },
        { status: 200 }
    );
}
