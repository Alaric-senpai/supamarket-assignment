import { getAllInventory } from '@/actions/inventory.actions';
import { InventoryTable } from '@/components/admin/inventory-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function InventoryPage() {
  const inventory = await getAllInventory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Current Stock</h1>
        <p className="text-muted-foreground">
          View and manage inventory across all branches
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>
            Real-time stock levels for all products across branches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTable data={inventory} />
        </CardContent>
      </Card>
    </div>
  );
}
