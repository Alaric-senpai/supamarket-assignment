'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrderById } from '@/actions/orders.actions';
import { OrderConfirmation } from '@/components/customer/OrderConfirmation';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Order } from '@/lib/types';
import { useCartStore } from '@/lib/store/cart-store';
import { connection } from 'next/server'

export default async function  ConfirmationPage() {
  await connection()
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCartStore();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      
      setIsLoading(true);
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        // Clear cart on successful confirmation
        if (data?.status === 'PAID') {
          clearCart();
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, clearCart]);

  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <AlertCircle className="size-12 text-destructive" />
        <h2 className="text-2xl font-bold">Invalid Request</h2>
        <p className="text-muted-foreground">Order ID is missing.</p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <AlertCircle className="size-12 text-destructive" />
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <p className="text-muted-foreground">We couldn't find the order your are looking for.</p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrderConfirmation order={order} />
    </div>
  );
}
