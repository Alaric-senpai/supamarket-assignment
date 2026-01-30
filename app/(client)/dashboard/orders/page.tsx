'use client'
import { getCurrentUser } from '@/actions/auth.actions';
import { getCustomerOrders } from '@/actions/orders.actions';
import { OrderHistory } from '@/components/customer/OrderHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
  const { user } = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const orders = await getCustomerOrders(user.$id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order History</h1>
        <p className="text-muted-foreground">
          View and track all your past supermarket orders
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Click "View" to see full order details and receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderHistory orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}
