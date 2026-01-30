'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import type { Product } from '@/lib/types';
import { ProductDialog } from './product-dialog';
import { DeleteProductDialog } from './delete-product-dialog';

interface ProductsManagementProps {
  initialProducts: Product[];
}

export function ProductsManagement({ initialProducts }: ProductsManagementProps) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Product Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue('name')}</div>;
      },
    },
    {
      accessorKey: 'price',
      header: 'Price (KES)',
      cell: ({ row }) => {
        const price = parseFloat(row.getValue('price'));
        const formatted = new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES',
        }).format(price);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        return <div className="text-muted-foreground truncate max-w-[300px]">{row.getValue('description') || '-'}</div>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedProduct(product);
                  setIsEditOpen(true);
                }}
              >
                Edit product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setSelectedProduct(product);
                  setIsDeleteOpen(true);
                }}
              >
                Delete product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        searchPlaceholder="Search products..."
      />

      {/* Dialogs */}
      <ProductDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={(newProduct) => {
          setProducts([...products, newProduct]);
          setIsCreateOpen(false);
        }}
      />

      <ProductDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        product={selectedProduct}
        onSuccess={(updatedProduct) => {
          setProducts(
            products.map((p) => (p.$id === updatedProduct.$id ? updatedProduct : p))
          );
          setIsEditOpen(false);
          setSelectedProduct(null);
        }}
      />

      <DeleteProductDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        product={selectedProduct}
        onSuccess={(deletedId) => {
          setProducts(products.filter((p) => p.$id !== deletedId));
          setIsDeleteOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
