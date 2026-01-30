'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import type { SalesSummary, ProductSales, BranchSales } from '@/lib/types';
import { ProductSalesTable } from './product-sales-table';
import { BranchSalesTable } from './branch-sales-table';

interface SalesReportsClientProps {
  summary: SalesSummary;
  productSales: ProductSales[];
  branchSales: BranchSales[];
}

export function SalesReportsClient({ summary, productSales, branchSales }: SalesReportsClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Reports</h1>
        <p className="text-muted-foreground">
          Comprehensive sales analytics and insights
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {summary.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalUnits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {summary.averageOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Sales by Product</TabsTrigger>
          <TabsTrigger value="branches">Sales by Branch</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>
                Sales breakdown by individual products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductSalesTable data={productSales} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branch Performance</CardTitle>
              <CardDescription>
                Sales breakdown by branch location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BranchSalesTable data={branchSales} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
