'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store/cart-store';
import { getBranchInventory } from '@/actions/inventory.actions';
import { ProductCatalog } from '@/components/customer/ProductCatalog';
import { BranchSwitcher } from '@/components/customer/BranchSwitcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Store, Package } from 'lucide-react';
import Link from 'next/link';
import type { Inventory } from '@/lib/types';

export default function ProductsPage() {
  const { branchId, branchName } = useCartStore();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchInventory() {
      if (!branchId) {
        setInventory([]);
        return;
      }
      
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {branchId ? `Products at ${branchName}` : 'Browse Products'}
          </h1>
          <p className="text-muted-foreground">
            {branchId 
              ? 'Browse items and add them to your cart. All items are in stock at this location.'
              : 'Select a branch to see available products and stock levels.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Shopping at:</span>
          <BranchSwitcher />
        </div>
      </div>

      {!branchId ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 bg-accent/5 border border-dashed rounded-xl p-8">
          <div className="bg-primary/10 p-4 rounded-full">
            <Store className="size-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Start by choosing a branch</h2>
          <p className="text-muted-foreground max-w-md">
            Use the dropdown in the header to select a branch. This will customize the product list and availability for your area.
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <Loader2 className="size-10 animate-spin text-primary opacity-50" />
          <p className="text-muted-foreground animate-pulse">Fetching inventory...</p>
        </div>
      ) : inventory.length > 0 ? (
        <ProductCatalog inventory={inventory} />
      ) : (
        <Card className="bg-accent/5 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="size-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-1">No products found</h3>
            <p className="text-muted-foreground max-w-xs">
              This branch doesn't have any products in stock at the moment. Try selecting another branch.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
