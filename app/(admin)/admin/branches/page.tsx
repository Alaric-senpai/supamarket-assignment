import { getBranches } from '@/actions/branches.actions';
import { BranchesManagement } from '@/components/admin/branches-management';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Branch Management</h1>
        <p className="text-muted-foreground">
          Manage all supermarket branch locations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Branches</CardTitle>
          <CardDescription>
            View, create, edit, and manage branch locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BranchesManagement initialBranches={branches} />
        </CardContent>
      </Card>
    </div>
  );
}
