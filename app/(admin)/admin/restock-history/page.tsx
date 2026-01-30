import { getRestockHistory } from '@/actions/restock.actions';
import { RestockHistoryTable } from '@/components/admin/restock-history-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function RestockHistoryPage() {
  const history = await getRestockHistory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Restock History</h1>
        <p className="text-muted-foreground">
          View all inventory restock transactions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restock Logs</CardTitle>
          <CardDescription>
            Complete history of all restock operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RestockHistoryTable data={history} />
        </CardContent>
      </Card>
    </div>
  );
}
