'use client';

import { CheckoutForm } from '@/components/customer/CheckoutForm';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/actions/auth.actions';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

export default function CheckoutPage() {
  const { items } = useCartStore();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { user, success } = await getCurrentUser();
      if (!success || !user) {
        redirect('/login');
        return;
      }
      setUserId(user.$id);
      setIsLoading(false);
    }
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <ShoppingCart className="size-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground">You need items in your cart to checkout.</p>
        <Button asChild>
          <Link href="/dashboard/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">
          Review your order details and proceed to payment
        </p>
      </div>

      <CheckoutForm userId={userId!} />
    </div>
  );
}
