'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Loader2 } from 'lucide-react';
import { getBranches } from '@/actions/branches.actions';
import { useCartStore } from '@/lib/store/cart-store';
import type { Branch } from '@/lib/types';
import { toast } from 'sonner';

export function BranchSwitcher() {
  const { branchId, branchName, setBranch } = useCartStore();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchBranches() {
      setIsLoading(true);
      try {
        const data = await getBranches();
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
        toast.error('Failed to load branches');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBranches();
  }, []);

  const handleBranchChange = (newBranchId: string) => {
    const selectedBranch = branches.find((b) => b.$id === newBranchId);
    if (selectedBranch) {
      setBranch(selectedBranch.$id, selectedBranch.name);
      toast.success(`Switched to ${selectedBranch.name}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <MapPin className="size-4 text-muted-foreground" />
      <Select
        value={branchId || ''}
        onValueChange={handleBranchChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[200px] bg-background">
          <SelectValue placeholder={isLoading ? "Loading..." : "Select Branch"}>
            {branchName || "Select Branch"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            branches.map((branch) => (
              <SelectItem key={branch.$id} value={branch.$id}>
                {branch.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
