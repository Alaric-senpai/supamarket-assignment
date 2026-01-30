'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Package } from 'lucide-react';
import { getNonHQBranches } from '@/actions/branches.actions';
import { getProducts } from '@/actions/products.actions';
import { getInventoryItem } from '@/actions/inventory.actions';
import { restockInventory } from '@/actions/restock.actions';
import { toast } from 'sonner';
import type { Branch, Product } from '@/lib/types';

interface RestockFormProps {
  adminId: string;
}

export function RestockForm({ adminId }: RestockFormProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [currentStock, setCurrentStock] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load branches and products on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [branchesData, productsData] = await Promise.all([
          getNonHQBranches(),
          getProducts(),
        ]);
        setBranches(branchesData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Load current stock when branch and product are selected
  useEffect(() => {
    const loadCurrentStock = async () => {
      if (!selectedBranchId || !selectedProductId) {
        setCurrentStock(null);
        return;
      }

      try {
        const inventory = await getInventoryItem(selectedBranchId, selectedProductId);
        setCurrentStock(inventory?.quantityAvailable ?? null);
      } catch (error) {
        console.error('Error loading current stock:', error);
        setCurrentStock(null);
      }
    };

    loadCurrentStock();
  }, [selectedBranchId, selectedProductId]);

  const handleSubmit = async () => {
    if (!selectedBranchId || !selectedProductId || !quantity) {
      toast.error('Please fill in all fields');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await restockInventory(adminId, {
        branchId: selectedBranchId,
        productId: selectedProductId,
        quantityAdded: quantityNum,
      });

      if (result.success) {
        toast.success(result.message || 'Restock successful');
        setCurrentStock(result.newQuantity ?? null);
        setQuantity('');
      } else {
        toast.error(result.message || 'Restock failed');
      }
    } catch (error) {
      console.error('Error restocking:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Restock Inventory
        </CardTitle>
        <CardDescription>
          Add stock to branch inventory from headquarters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Branch Selection */}
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
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

          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger id="product">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.$id} value={product.$id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Current Stock Display */}
        {currentStock !== null && (
          <Alert>
            <AlertDescription>
              <strong>Current Stock:</strong> {currentStock} units
            </AlertDescription>
          </Alert>
        )}

        {/* Quantity Input */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity to Add</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={!selectedBranchId || !selectedProductId}
          />
        </div>

        {/* Submit Button */}
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedBranchId || !selectedProductId || !quantity}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Restocking...
            </>
          ) : (
            'Restock Now'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
