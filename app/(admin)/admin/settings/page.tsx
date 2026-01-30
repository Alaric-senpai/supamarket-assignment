import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage application settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Basic application configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Application Name</Label>
              <Input id="app-name" defaultValue="Supamarket" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" defaultValue="KES" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>M-Pesa Configuration</CardTitle>
            <CardDescription>
              Mobile money payment settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shortcode">Short Code</Label>
              <Input id="shortcode" type="password" defaultValue="174379" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <Input id="environment" defaultValue="sandbox" disabled />
            </div>
            <Button>Update M-Pesa Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Alerts</CardTitle>
            <CardDescription>
              Configure low stock alert thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="low-stock">Low Stock Threshold</Label>
              <Input id="low-stock" type="number" defaultValue="10" />
              <p className="text-sm text-muted-foreground">
                Alert when stock falls below this number
              </p>
            </div>
            <Button>Save Alert Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
