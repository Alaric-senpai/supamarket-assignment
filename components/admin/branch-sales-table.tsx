'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { BranchSales } from '@/lib/types';

const columns: ColumnDef<BranchSales>[] = [
  {
    accessorKey: 'branchName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Branch
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('branchName')}</div>;
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
    accessorKey: 'products',
    header: 'Top Products',
    cell: ({ row }) => {
      const products = row.getValue('products') as any[];
      const topProducts = products.slice(0, 3);
      return (
        <div className="text-sm text-muted-foreground">
          {topProducts.map((p, i) => (
            <div key={i}>{p.productName} ({p.units})</div>
          ))}
        </div>
      );
    },
  },
];

interface BranchSalesTableProps {
  data: BranchSales[];
}

export function BranchSalesTable({ data }: BranchSalesTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="branchName"
      searchPlaceholder="Search branches..."
    />
  );
}
