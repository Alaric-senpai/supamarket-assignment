'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { restockInventory } from '@/actions/restock.actions';
import { getInventoryItem } from '@/actions/inventory.actions';
import type { Branch, Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { toast } from 'sonner';

interface RestockFormClientProps {
  branches: Branch[];
  products: Product[];
}

export function RestockFormClient({ branches, products }: RestockFormClientProps) {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [currentStock, setCurrentStock] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBranchProductChange = async (branchId: string, productId: string) => {
    if (branchId && productId) {
      try {
        const inventory = await getInventoryItem(branchId, productId);
        setCurrentStock(inventory?.quantityAvailable ?? 0);
      } catch (error) {
        setCurrentStock(0);
      }
    } else {
      setCurrentStock(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBranch || !selectedProduct || !quantity) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const result = await restockInventory('admin-user-id', {
        branchId: selectedBranch,
        productId: selectedProduct,
        quantityAdded: parseInt(quantity),
      });

      if (result.success) {
        toast.success(result.message);
        setSelectedBranch('');
        setSelectedProduct('');
        setQuantity('');
        setCurrentStock(null);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to restock inventory');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="branch">Branch</Label>
          <Select
            value={selectedBranch}
            onValueChange={(value) => {
              setSelectedBranch(value);
              handleBranchProductChange(value, selectedProduct);
            }}
          >
            <SelectTrigger id="branch">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.$id} value={branch.$id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product">Product</Label>
          <Select
            value={selectedProduct}
            onValueChange={(value) => {
              setSelectedProduct(value);
              handleBranchProductChange(selectedBranch, value);
            }}
          >
            <SelectTrigger id="product">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.$id} value={product.$id}>
                  {product.name} - KES {parseFloat(product.price).toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {currentStock !== null && (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Current Stock</p>
              <p className="text-2xl font-bold">{currentStock} units</p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity to Add</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Restocking...' : 'Restock Inventory'}
      </Button>
    </form>
  );
}
