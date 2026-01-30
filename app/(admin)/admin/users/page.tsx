import { listUsers } from '@/actions/user.actions';
import { UsersTable } from '@/components/admin/users-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function UsersPage() {
  const users = await listUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">
          Manage system users and their roles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable data={users} />
        </CardContent>
      </Card>
    </div>
  );
}
