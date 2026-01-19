import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

export default function AdminDatabase() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Database className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Database Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage database tables and records
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Overview</CardTitle>
          <CardDescription>
            View and manage database collections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Database management interface coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
