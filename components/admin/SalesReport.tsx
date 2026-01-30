'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { getSalesSummary, getSalesByProduct, getSalesByBranch } from '@/actions/reports.actions';
import { toast } from 'sonner';
import type { SalesSummary, ProductSales, BranchSales } from '@/lib/types';

export function SalesReport() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [branchSales, setBranchSales] = useState<BranchSales[]>([]);

  const handleGenerateReport = async () => {
    setIsLoading(true);

    try {
      const [summaryData, productData, branchData] = await Promise.all([
        getSalesSummary(dateFrom || undefined, dateTo || undefined),
        getSalesByProduct(dateFrom || undefined, dateTo || undefined),
        getSalesByBranch(dateFrom || undefined, dateTo || undefined),
      ]);

      setSummary(summaryData);
      setProductSales(productData);
      setBranchSales(branchData);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Sales Report</CardTitle>
          <CardDescription>
            Select a date range to view sales data (leave empty for all time)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                className="w-full"
                onClick={handleGenerateReport}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units Sold</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalUnits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                KES {summary.totalRevenue.toFixed(2)}
              </div>
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
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                KES {summary.averageOrderValue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales by Product */}
      {productSales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sales by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Units Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Avg Price</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productSales.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell className="font-medium">{product.productName}</TableCell>
                    <TableCell className="text-right">{product.unitsSold}</TableCell>
                    <TableCell className="text-right">
                      KES {product.revenue.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      KES {product.avgPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.percentageOfTotal.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Sales by Branch */}
      {branchSales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sales by Branch</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead className="text-right">Units Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branchSales.map((branch) => (
                  <TableRow key={branch.branchId}>
                    <TableCell className="font-medium">{branch.branchName}</TableCell>
                    <TableCell className="text-right">{branch.unitsSold}</TableCell>
                    <TableCell className="text-right">
                      KES {branch.revenue.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
