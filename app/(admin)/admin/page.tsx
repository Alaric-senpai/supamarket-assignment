import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  AlertTriangle,
  ShoppingCart,
  Warehouse
} from 'lucide-react';
import Link from 'next/link';
import { getDashboardStats, getRecentOrders, getLowStockAlerts } from '@/actions/dashboard.actions';
import { format } from 'date-fns';

export default async function AdminDashboard() {
  // Fetch real data
  const stats = await getDashboardStats();
  const recentOrders = await getRecentOrders(5);
  const lowStockAlerts = await getLowStockAlerts(5);

  const quickActions = [
    {
      title: 'Restock Inventory',
      description: 'Add stock to branch inventory',
      icon: Package,
      href: '/admin/restock',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'View Reports',
      description: 'Check sales analytics and insights',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'Manage Inventory',
      description: 'Monitor stock levels across branches',
      icon: Warehouse,
      href: '/admin/inventory',
      color: 'bg-purple-500/10 text-purple-500',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage inventory, view reports, and monitor sales
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          Administrator
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={stats.revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}%
              </span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className={stats.ordersGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {stats.ordersGrowth >= 0 ? '+' : ''}{stats.ordersGrowth}%
              </span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productsSold.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total units sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered customers
            </p>
          </CardContent>
        </Card>
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

      {/* Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Low Stock Alerts</CardTitle>
              <AlertTriangle className="size-5 text-orange-500" />
            </div>
            <CardDescription>Products running low on inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="size-12 mx-auto mb-2 opacity-50" />
                <p>No low stock alerts</p>
                <p className="text-sm">All products are well stocked</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockAlerts.map((alert) => (
                  <div key={alert.$id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium">{alert.productName}</p>
                      <p className="text-sm text-muted-foreground">{alert.branchName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.status === 'CRITICAL' ? 'destructive' : 'secondary'}>
                        {alert.quantityAvailable} units
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/inventory">View All Inventory</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <TrendingUp className="size-5 text-green-500" />
            </div>
            <CardDescription>Latest orders and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="size-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Orders will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.$id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium">Order #{order.$id.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.branchName} • {format(new Date(order.$createdAt), 'PPp')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        order.status === 'PAID' ? 'default' : 
                        order.status === 'PENDING' ? 'secondary' : 
                        'destructive'
                      }>
                        {order.status}
                      </Badge>
                      <p className="font-semibold">
                        {formatCurrency(parseFloat(order.totalAmount))}
                      </p>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/reports">View All Orders</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Overview of system health and operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <div className="size-2 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-muted-foreground">Operational</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <div className="size-2 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="font-medium">M-Pesa API</p>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <div className="size-2 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="font-medium">Inventory Sync</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
