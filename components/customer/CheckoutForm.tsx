'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { createOrder } from '@/actions/orders.actions';
import { toast } from 'sonner';

interface CheckoutFormProps {
  userId: string;
}

export function CheckoutForm({ userId }: CheckoutFormProps) {
  const router = useRouter();
  const { items, branchId, branchName, getTotal } = useCartStore();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const handleCreateOrder = async () => {
    if (!branchId) {
      toast.error('No branch selected');
      return;
    }

    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setIsCreatingOrder(true);

    try {
      const result = await createOrder(userId, {
        branchId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      if (result.success && result.orderId) {
        toast.success('Order created successfully');
        router.push(`/dashboard/payment?orderId=${result.orderId}`);
      } else {
        toast.error(result.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('An error occurred while creating your order');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold">No items to checkout</h2>
          <Button onClick={() => router.push('/products')}>
            Go to Products
          </Button>
        </div>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">
            Review your order before proceeding to payment
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <p className="text-sm text-muted-foreground">Branch: {branchName}</p>
          </CardHeader>
          <CardContent>
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
                {items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell className="font-medium">
                      {item.productName}
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      KES {item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      KES {(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg text-primary">
                    KES {total.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription>
            By clicking "Continue to Payment", your order will be created and you will
            be redirected to the payment page to complete your purchase via M-Pesa.
          </AlertDescription>
        </Alert>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/cart')}
            disabled={isCreatingOrder}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>

          <Button
            className="flex-1"
            size="lg"
            onClick={handleCreateOrder}
            disabled={isCreatingOrder}
          >
            {isCreatingOrder ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Order...
              </>
            ) : (
              'Continue to Payment'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
