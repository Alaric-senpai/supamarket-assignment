import { getSalesSummary, getSalesByProduct, getSalesByBranch } from '@/actions/reports.actions';
import { SalesReportsClient } from '@/components/admin/sales-reports-client';

export default async function ReportsPage() {
  const [summary, productSales, branchSales] = await Promise.all([
    getSalesSummary(),
    getSalesByProduct(),
    getSalesByBranch(),
  ]);

  return (
    <SalesReportsClient
      summary={summary}
      productSales={productSales}
      branchSales={branchSales}
    />
  );
}
