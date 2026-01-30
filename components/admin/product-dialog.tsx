'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';
import { createProduct, updateProduct } from '@/actions/products.actions';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().min(0.01, 'Price must be greater than zero'),
  description: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSuccess: (product: Product) => void;
}

export function ProductDialog({ open, onOpenChange, product, onSuccess }: ProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      price: product?.price ? parseFloat(product.price) : 0,
      description: product?.description || '',
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      let result: Product;
      if (isEdit && product) {
        result = await updateProduct(product.$id, {
          name: data.name,
          price: data.price,
          description: data.description,
        });
      } else {
        result = await createProduct({
          name: data.name,
          price: data.price,
          description: data.description,
        });
      }

      toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully`);

      onSuccess(result);
      reset();
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} product`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Product' : 'Create New Product'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update product information'
              : 'Add a new product to the catalog'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="Product Name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (KES)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="150.00"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Product description..."
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
