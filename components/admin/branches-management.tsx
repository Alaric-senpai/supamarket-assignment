'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import type { Branch } from '@/lib/types';
import { BranchDialog } from './branch-dialog';
import { DeleteBranchDialog } from './delete-branch-dialog';

interface BranchesManagementProps {
  initialBranches: Branch[];
}

export function BranchesManagement({ initialBranches }: BranchesManagementProps) {
  const [branches, setBranches] = useState(initialBranches);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const columns: ColumnDef<Branch>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Branch Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue('name')}</div>;
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => {
        return <div className="text-muted-foreground">{row.getValue('location')}</div>;
      },
    },
    {
      accessorKey: 'isHeadquarter',
      header: 'Type',
      cell: ({ row }) => {
        const isHQ = row.getValue('isHeadquarter') as boolean;
        return (
          <Badge variant={isHQ ? 'default' : 'secondary'}>
            {isHQ ? 'Headquarters' : 'Branch'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const branch = row.original;

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
                  setSelectedBranch(branch);
                  setIsEditOpen(true);
                }}
              >
                Edit branch
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setSelectedBranch(branch);
                  setIsDeleteOpen(true);
                }}
                disabled={branch.isHeadquarter}
              >
                Delete branch
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
          Add Branch
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={branches}
        searchKey="name"
        searchPlaceholder="Search branches..."
      />

      <BranchDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={(newBranch) => {
          setBranches([...branches, newBranch]);
          setIsCreateOpen(false);
        }}
      />

      <BranchDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        branch={selectedBranch}
        onSuccess={(updatedBranch) => {
          setBranches(
            branches.map((b) => (b.$id === updatedBranch.$id ? updatedBranch : b))
          );
          setIsEditOpen(false);
          setSelectedBranch(null);
        }}
      />

      <DeleteBranchDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        branch={selectedBranch}
        onSuccess={(deletedId) => {
          setBranches(branches.filter((b) => b.$id !== deletedId));
          setIsDeleteOpen(false);
          setSelectedBranch(null);
        }}
      />
    </div>
  );
}
