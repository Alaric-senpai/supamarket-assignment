'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, RefreshCw } from 'lucide-react';
import { getAllInventory } from '@/actions/inventory.actions';
import { getBranches } from '@/actions/branches.actions';
import { toast } from 'sonner';
import type { InventoryWithStatus, Branch } from '@/lib/types';

export function InventoryView() {
  const [inventory, setInventory] = useState<InventoryWithStatus[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [inventoryData, branchesData] = await Promise.all([
        getAllInventory(),
        getBranches(),
      ]);
      setInventory(inventoryData);
      setBranches(branchesData);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusBadge = (status: 'CRITICAL' | 'LOW' | 'GOOD') => {
    switch (status) {
      case 'CRITICAL':
        return <Badge variant="destructive">Critical</Badge>;
      case 'LOW':
        return <Badge variant="secondary">Low</Badge>;
      case 'GOOD':
        return <Badge variant="default">Good</Badge>;
    }
  };

  const filteredInventory = inventory.filter(
    (item) => selectedBranchId === 'all' || item.branchId === selectedBranchId
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Inventory</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.$id} value={branch.$id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={loadData}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Restock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.$id}>
                  <TableCell className="font-medium">
                    {item.branch?.name}
                  </TableCell>
                  <TableCell>{item.product?.name}</TableCell>
                  <TableCell className="text-right font-mono">
                    {item.quantityAvailable}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.lastRestockDate
                      ? new Date(item.lastRestockDate).toLocaleDateString()
                      : 'Never'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredInventory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No inventory records found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
