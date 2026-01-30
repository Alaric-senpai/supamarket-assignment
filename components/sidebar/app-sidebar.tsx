'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logout } from '@/actions/auth.actions';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Package,
  History,
  User,
  LogOut,
  Home,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

const menuItems = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: Home,
      },
    ],
  },
  {
    title: 'Shopping',
    items: [
      {
        title: 'Branches',
        url: '/dashboard/branches',
        icon: Home,
      },
      {
        title: 'Products',
        url: '/dashboard/products',
        icon: Package,
      },
      {
        title: 'Cart',
        url: '/dashboard/cart',
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: 'Orders',
    items: [
      {
        title: 'Order History',
        url: '/dashboard/orders',
        icon: History,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: User,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-primary-foreground">
            <ShoppingCart className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Supamarket</h2>
            <p className="text-xs text-muted-foreground">Customer Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url}>
                          <Icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground font-medium px-2">Theme</p>
          <AnimatedThemeToggler className="size-8 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" />
        </div>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}

function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await Logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      className="w-full justify-start" 
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut className="size-4 mr-2" />
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
