'use client';

import { ShoppingCart } from '@/components/customer/ShoppingCart';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, branchName } = useCartStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
        {branchName && (
          <p className="text-muted-foreground">
            Shopping from <span className="font-medium text-foreground">{branchName}</span>
          </p>
        )}
      </div>

      {items.length > 0 ? (
        <ShoppingCart />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <ShoppingBag className="size-12 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground max-w-md">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild>
            <Link href="/dashboard/products">Go to Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
