import { getBranches } from '@/actions/branches.actions';
import { BranchSelector } from '@/components/customer/BranchSelector';

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <div className="space-y-6">
      <BranchSelector branches={branches} />
    </div>
  );
}
