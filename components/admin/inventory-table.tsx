'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import type { InventoryWithStatus } from '@/lib/types';

const columns: ColumnDef<InventoryWithStatus>[] = [
  {
    id: 'productName',
    accessorFn: (row) => row.product?.name || 'N/A',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original.product;
      return <div className="font-medium">{product?.name || 'N/A'}</div>;
    },
  },
  {
    id: 'branchName',
    accessorFn: (row) => row.branch?.name || 'N/A',
    header: 'Branch',
    cell: ({ row }) => {
      const branch = row.original.branch;
      return <div>{branch?.name || 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'quantityAvailable',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-mono">{row.getValue('quantityAvailable')}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'in_stock'
              ? 'default'
              : status === 'low_stock'
              ? 'secondary'
              : 'destructive'
          }
        >
          {status.replace('_', ' ')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'product.price',
    header: 'Price',
    cell: ({ row }) => {
      const product = row.original.product;
      const price = parseFloat(product?.price || '0');
      return <div>KES {price.toFixed(2)}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const inventory = row.original;

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
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Restock</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface InventoryTableProps {
  data: InventoryWithStatus[];
}

export function InventoryTable({ data }: InventoryTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="productName"
      searchPlaceholder="Search products..."
    />
  );
}
