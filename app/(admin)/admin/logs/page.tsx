import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function AdminLogs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">System Logs</h1>
          <p className="text-muted-foreground mt-1">
            View system logs and audit trails
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            View recent system activity and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            System logs interface coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
