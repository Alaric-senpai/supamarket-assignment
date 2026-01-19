'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Shield,
  LogOut,
  ChevronRight,
  Crown,
  Activity,
  Database,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminMenuItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: Activity,
  },
  {
    title: 'Database',
    href: '/admin/database',
    icon: Database,
  },
  {
    title: 'Logs',
    href: '/admin/logs',
    icon: FileText,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        {user && (
          <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
              <span className="text-sm font-medium truncate">{user.name}</span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <div className="mt-2 px-2 py-1 bg-yellow-500/20 rounded text-xs font-medium text-yellow-700 dark:text-yellow-400 inline-block">
              Administrator
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive && 'bg-accent text-accent-foreground font-medium'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.title}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
