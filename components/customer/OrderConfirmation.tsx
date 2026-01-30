'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { CheckCircle2, ShoppingBag, Receipt } from 'lucide-react';
import type { Order } from '@/lib/types';
import { useCartStore } from '@/lib/store/cart-store';

interface OrderConfirmationProps {
  order: Order;
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const router = useRouter();
  const { clearCart } = useCartStore();

  // Clear cart on mount if order is already paid
  useEffect(() => {
    if (order.status === 'PAID') {
      clearCart();
    }
  }, [order.status, clearCart]);

  const handleContinueShopping = () => {
    router.push('/dashboard/branches');
  };

  const handleViewOrders = () => {
    router.push('/dashboard/orders');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success Message */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-6">
              <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Order Receipt
              </CardTitle>
              <Badge variant="default">PAID</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order ID</p>
                <p className="font-mono">{order.$id.substring(0, 16)}...</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p>{new Date(order.$createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Branch</p>
                <p>{order.branch?.name}</p>
              </div>
              {order.payment?.mpesaReceiptNumber && (
                <div>
                  <p className="text-muted-foreground">M-Pesa Receipt</p>
                  <p className="font-mono">{order.payment.mpesaReceiptNumber}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-3">Items Purchased</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item) => (
                    <TableRow key={item.$id}>
                      <TableCell className="font-medium">
                        {item.product?.name}
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        KES {parseFloat(item.unitPrice).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        KES {parseFloat(item.subtotal).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">
                      Total Paid
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg text-primary">
                      KES {parseFloat(order.totalAmount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleViewOrders}
          >
            View My Orders
          </Button>
          <Button className="flex-1" onClick={handleContinueShopping}>
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
