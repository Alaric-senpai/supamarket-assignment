import { redirect } from 'next/navigation';
import { verifyUserRole } from '@/lib/role-verification';
import { AdminSidebar } from '@/components/layout/admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Strict role verification with database check to prevent cookie manipulation
  const verification = await verifyUserRole('admin');

  console.log(verification)
  
  if (!verification.valid) {
    console.error('[Security] Unauthorized admin access attempt:', verification.message);
    // Redirect to client dashboard with error
    redirect('/dashboard?error=admin_access_denied');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}