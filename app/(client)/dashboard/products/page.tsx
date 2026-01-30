'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store/cart-store';
import { getBranchInventory } from '@/actions/inventory.actions';
import { ProductCatalog } from '@/components/customer/ProductCatalog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { Inventory } from '@/lib/types';

export default function ProductsPage() {
  const { branchId, branchName } = useCartStore();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInventory() {
      if (!branchId) return;
      
      setIsLoading(true);
      try {
        const data = await getBranchInventory(branchId);
        setInventory(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInventory();
  }, [branchId]);

  if (!branchId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <MapPin className="size-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">No Branch Selected</h2>
        <p className="text-muted-foreground max-w-md">
          Please select a branch first to see available products and stock levels.
        </p>
        <Button asChild>
          <Link href="/dashboard/branches">Select Branch</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Products at {branchName}</h1>
        <p className="text-muted-foreground">
          Browse items and add them to your cart. All items are in stock at this location.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : inventory.length > 0 ? (
        <ProductCatalog inventory={inventory} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products available at this branch currently.</p>
        </div>
      )}
    </div>
  );
}
