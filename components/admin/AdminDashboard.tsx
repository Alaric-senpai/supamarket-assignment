'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Package, History, Warehouse } from 'lucide-react';

interface AdminDashboardProps {
  salesReportTab: React.ReactNode;
  restockTab: React.ReactNode;
  inventoryTab: React.ReactNode;
  historyTab: React.ReactNode;
}

export function AdminDashboard({
  salesReportTab,
  restockTab,
  inventoryTab,
  historyTab,
}: AdminDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage inventory, view sales reports, and track restocks
        </p>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Sales Report</span>
            <span className="sm:hidden">Sales</span>
          </TabsTrigger>
          <TabsTrigger value="restock" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Restock</span>
            <span className="sm:hidden">Restock</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Warehouse className="w-4 h-4" />
            <span className="hidden sm:inline">Inventory</span>
            <span className="sm:hidden">Stock</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
            <span className="sm:hidden">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          {salesReportTab}
        </TabsContent>

        <TabsContent value="restock" className="space-y-4">
          {restockTab}
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          {inventoryTab}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {historyTab}
        </TabsContent>
      </Tabs>
    </div>
  );
}
