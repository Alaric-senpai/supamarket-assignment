'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { ProductSales } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

const columns: ColumnDef<ProductSales>[] = [
  {
    accessorKey: 'productName',
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
      return <div className="font-medium">{row.getValue('productName')}</div>;
    },
  },
  {
    accessorKey: 'unitsSold',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Units Sold
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-mono">{row.getValue('unitsSold')}</div>;
    },
  },
  {
    accessorKey: 'revenue',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Revenue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const revenue = row.getValue('revenue') as number;
      return <div className="font-semibold">KES {revenue.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: 'avgPrice',
    header: 'Avg Price',
    cell: ({ row }) => {
      const avgPrice = row.getValue('avgPrice') as number;
      return <div>KES {avgPrice.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: 'percentageOfTotal',
    header: '% of Total',
    cell: ({ row }) => {
      const percentage = row.getValue('percentageOfTotal') as number;
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">{percentage.toFixed(1)}%</div>
          <Progress value={percentage} className="h-2" />
        </div>
      );
    },
  },
];

interface ProductSalesTableProps {
  data: ProductSales[];
}

export function ProductSalesTable({ data }: ProductSalesTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="productName"
      searchPlaceholder="Search products..."
    />
  );
}
