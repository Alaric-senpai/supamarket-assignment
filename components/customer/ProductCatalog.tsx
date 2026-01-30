'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import type { Product, Inventory } from '@/lib/types';
import { useCartStore } from '@/lib/store/cart-store';

interface ProductCatalogProps {
  inventory: Inventory[];
}

export function ProductCatalog({ inventory }: ProductCatalogProps) {
  const { addItem } = useCartStore();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (productId: string, value: number) => {
    const item = inventory.find((inv) => inv.productId === productId);
    if (!item) return;

    const newValue = Math.max(0, Math.min(value, item.quantityAvailable));
    setQuantities((prev) => ({ ...prev, [productId]: newValue }));
  };

  const handleAddToCart = (item: Inventory) => {
    const quantity = quantities[item.productId] || 1;

    if (quantity <= 0) {
      toast.error('Please select a quantity');
      return;
    }

    if (quantity > item.quantityAvailable) {
      toast.error(`Only ${item.quantityAvailable} units available`);
      return;
    }

    if (!item.product) {
      toast.error('Product details not found');
      return;
    }

    addItem({
      productId: item.productId,
      productName: item.product.name,
      price: parseFloat(item.product.price),
      quantity,
      availableStock: item.quantityAvailable,
    });

    toast.success(`Added ${quantity} ${item.product.name} to cart`);

    // Reset quantity
    setQuantities((prev) => ({ ...prev, [item.productId]: 0 }));
  };

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity < 50) {
      return <Badge variant="destructive">Low Stock: {quantity}</Badge>;
    } else if (quantity < 100) {
      return <Badge variant="secondary">Stock: {quantity}</Badge>;
    } else {
      return <Badge variant="default">In Stock: {quantity}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {inventory.map((item) => {
        const product = item.product;
        if (!product) return null;

        const quantity = quantities[item.productId] || 0;
        const isOutOfStock = item.quantityAvailable === 0;

        return (
          <Card key={item.$id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{product.name}</CardTitle>
                {getStockBadge(item.quantityAvailable)}
              </div>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="text-2xl font-bold text-primary mb-4">
                KES {parseFloat(product.price).toFixed(2)}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleQuantityChange(item.productId, quantity - 1)
                    }
                    disabled={isOutOfStock || quantity <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>

                  <Input
                    type="number"
                    min="0"
                    max={item.quantityAvailable}
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.productId,
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="text-center"
                    disabled={isOutOfStock}
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleQuantityChange(item.productId, quantity + 1)
                    }
                    disabled={isOutOfStock || quantity >= item.quantityAvailable}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleAddToCart(item)}
                disabled={isOutOfStock || quantity === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
