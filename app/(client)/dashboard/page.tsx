import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, History, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/actions/auth.actions';
import { getCustomerOrders } from '@/actions/orders.actions';
import { redirect } from 'next/navigation';

export default async function ClientDashboard() {
  const { user } = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const orders = await getCustomerOrders(user.$id);
  
  // Calculate Stats
  const paidOrders = orders.filter(o => o.status === 'PAID');
  const totalOrders = paidOrders.length;
  const totalSpent = paidOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentOrdersCount = paidOrders.filter(o => 
    new Date(o.$createdAt) > thirtyDaysAgo
  ).length;

  const quickActions = [
    {
      title: 'Browse Products',
      description: 'View available products and add to cart',
      icon: Package,
      href: '/dashboard/products',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'View Cart',
      description: 'Review items in your shopping cart',
      icon: ShoppingCart,
      href: '/dashboard/cart',
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'Order History',
      description: 'Track your past orders and receipts',
      icon: History,
      href: '/dashboard/orders',
      color: 'bg-purple-500/10 text-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground text-lg">
          Manage your orders and continue shopping at Supamarket.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid Orders</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Successful transactions</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenditure</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all completed orders</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            <History className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentOrdersCount}</div>
            <p className="text-xs text-muted-foreground">In the last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card key={action.title} className="hover:shadow-md transition-all border-primary/5 bg-accent/5">
              <CardHeader>
                <div className={`inline-flex p-3 rounded-lg ${action.color} mb-2 w-fit`}>
                  <Icon className="size-6" />
                </div>
                <CardTitle>{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href={action.href}>
                    Go to {action.title}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Getting Started */}
      <Card className="border-primary/20 bg-primary/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
           <ShoppingCart className="size-24" />
        </div>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
          <CardDescription>Follow these simple steps to shop online</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary font-bold">
                1
              </div>
              <h4 className="font-semibold uppercase text-xs tracking-wider text-muted-foreground">Step One</h4>
              <p className="text-sm">
                <strong>Select a Branch</strong>: Choose your local branch to see what's in stock.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary font-bold">
                2
              </div>
              <h4 className="font-semibold uppercase text-xs tracking-wider text-muted-foreground">Step Two</h4>
              <p className="text-sm">
                <strong>Add to Cart</strong>: Browse our catalog and add items you need.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary font-bold">
                3
              </div>
              <h4 className="font-semibold uppercase text-xs tracking-wider text-muted-foreground">Step Three</h4>
              <p className="text-sm">
                <strong>Pay with M-Pesa</strong>: Quick and secure checkout via STK Push.
              </p>
            </div>
          </div>

          <Button asChild className="w-full mt-2 shadow-sm">
            <Link href="/dashboard/branches">
              Start Shopping Now
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}