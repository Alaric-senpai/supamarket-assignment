import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            System analytics and performance metrics
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>
            View comprehensive system analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Analytics dashboard coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
