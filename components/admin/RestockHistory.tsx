'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Loader2 } from 'lucide-react';
import { getRestockHistory } from '@/actions/restock.actions';
import { getBranches } from '@/actions/branches.actions';
import { toast } from 'sonner';
import type { RestockLog, Branch } from '@/lib/types';

export function RestockHistory() {
  const [logs, setLogs] = useState<RestockLog[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [logsData, branchesData] = await Promise.all([
          getRestockHistory(selectedBranchId === 'all' ? undefined : selectedBranchId),
          getBranches(),
        ]);
        setLogs(logsData);
        setBranches(branchesData);
      } catch (error) {
        console.error('Error loading restock history:', error);
        toast.error('Failed to load restock history');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedBranchId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Restock History</CardTitle>
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
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Qty Added</TableHead>
              <TableHead className="text-right">Previous</TableHead>
              <TableHead className="text-right">New Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.$id}>
                <TableCell className="text-sm">
                  {new Date(log.$createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{log.branch?.name}</TableCell>
                <TableCell>{log.product?.name}</TableCell>
                <TableCell className="text-right font-medium text-green-600">
                  +{log.quantityAdded}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {log.previousQuantity}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {log.newQuantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {logs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No restock history found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
