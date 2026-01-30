'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import type { RestockWithRelations } from '@/lib/types';
import { format } from 'date-fns';

const columns: ColumnDef<RestockWithRelations>[] = [
  {
    accessorKey: '$createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('$createdAt') as string;
      return <div>{format(new Date(date), 'PPp')}</div>;
    },
  },
  {
    id: 'branchName',
    accessorFn: (row) => row.branch?.name || 'N/A',
    header: 'Branch',
    cell: ({ row }) => {
      const branch = row.original.branch;
      return <div className="font-medium">{branch?.name || 'N/A'}</div>;
    },
  },
  {
    id: 'productName',
    accessorFn: (row) => row.product?.name || 'N/A',
    header: 'Product',
    cell: ({ row }) => {
      const product = row.original.product;
      return <div>{product?.name || 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'quantityAdded',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Quantity Added
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge variant="secondary" className="font-mono">
          +{row.getValue('quantityAdded')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'previousQuantity',
    header: 'Previous',
    cell: ({ row }) => {
      return <div className="font-mono text-muted-foreground">{row.getValue('previousQuantity')}</div>;
    },
  },
  {
    accessorKey: 'newQuantity',
    header: 'New Total',
    cell: ({ row }) => {
      return <div className="font-mono font-semibold">{row.getValue('newQuantity')}</div>;
    },
  },
];

interface RestockHistoryTableProps {
  data: RestockWithRelations[];
}

export function RestockHistoryTable({ data }: RestockHistoryTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="branchName"
      searchPlaceholder="Search by branch..."
    />
  );
}
