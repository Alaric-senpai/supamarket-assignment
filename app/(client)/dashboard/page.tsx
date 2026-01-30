import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, History, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboard() {
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
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to Supamarket</h1>
        <p className="text-muted-foreground">
          Start shopping from your nearest branch with real-time inventory
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card key={action.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`inline-flex p-3 rounded-lg ${action.color} mb-2 w-fit`}>
                  <Icon className="size-6" />
                </div>
                <CardTitle>{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={action.href}>
                    Go to {action.title}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
            <ShoppingCart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Items in cart</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 0</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            <History className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Follow these steps to place your first order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold">Select a Branch</h4>
              <p className="text-sm text-muted-foreground">
                Choose your nearest Supamarket branch to see available products
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold">Add Items to Cart</h4>
              <p className="text-sm text-muted-foreground">
                Browse products and add your desired items to the cart
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold">Pay with M-Pesa</h4>
              <p className="text-sm text-muted-foreground">
                Complete your purchase using M-Pesa STK push
              </p>
            </div>
          </div>

          <Button asChild className="w-full mt-4">
            <Link href="/dashboard/branches">
              Start Shopping Now
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}