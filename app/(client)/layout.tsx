import { redirect } from 'next/navigation';
import { verifyUserRole } from '@/lib/role-verification';
import { ClientSidebar } from '@/components/layout/client-sidebar';

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  // Verify user has client or admin role (admin can access client routes)
  // const clientVerification = await verifyUserRole('client');
  
  // if (clientVerification.valid) {
  //   console.error('[Security] Unauthorized client access attempt');
  //   redirect('/login?error=authentication_required');
  // }

  return (
    <div className="flex h-screen overflow-hidden">
      <ClientSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}