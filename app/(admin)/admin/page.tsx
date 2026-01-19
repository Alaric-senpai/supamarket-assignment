import { getCurrentUser } from '@/actions/auth.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Users, Activity, Database, Shield } from 'lucide-react';

export default async function AdminDashboard() {
  const { user } = await getCurrentUser();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Crown className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Administrator
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Coming soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Coming soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Healthy</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Secure</div>
            <p className="text-xs text-muted-foreground">
              No threats detected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Info Alert */}
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-600" />
            Administrator Access
          </CardTitle>
          <CardDescription>
            You have full administrative privileges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Logged in as: <span className="font-semibold text-foreground">{user?.email}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            User ID: <span className="font-mono text-xs text-foreground">{user?.$id}</span>
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Administrative tasks and tools
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
            <Users className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Manage Users</h3>
            <p className="text-sm text-muted-foreground">
              View and manage user accounts
            </p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
            <Activity className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Analytics</h3>
            <p className="text-sm text-muted-foreground">
              View system analytics and reports
            </p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
            <Database className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Database</h3>
            <p className="text-sm text-muted-foreground">
              Manage database and records
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current system health and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Authentication Service</span>
            </div>
            <span className="text-sm text-muted-foreground">Operational</span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Database</span>
            </div>
            <span className="text-sm text-muted-foreground">Operational</span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">OAuth Services</span>
            </div>
            <span className="text-sm text-muted-foreground">Operational</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
