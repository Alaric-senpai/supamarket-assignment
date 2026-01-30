import { getProducts } from '@/actions/products.actions';
import { ProductsManagement } from '@/components/admin/products-management';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product Management</h1>
        <p className="text-muted-foreground">
          View, create, edit, and manage supermarket products
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            Manage the list of products available in your supermarkets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsManagement initialProducts={products} />
        </CardContent>
      </Card>
    </div>
  );
}
