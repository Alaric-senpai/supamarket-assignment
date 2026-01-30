import { getNonHQBranches } from '@/actions/branches.actions';
import { getProducts } from '@/actions/products.actions';
import { RestockFormClient } from '@/components/admin/restock-form-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function RestockPage() {
  const [branches, products] = await Promise.all([
    getNonHQBranches(),
    getProducts(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Restock Inventory</h1>
        <p className="text-muted-foreground">
          Add stock to branch inventory from headquarters
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restock Form</CardTitle>
          <CardDescription>
            Select a branch and product to add inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RestockFormClient branches={branches} products={products} />
        </CardContent>
      </Card>
    </div>
  );
}
