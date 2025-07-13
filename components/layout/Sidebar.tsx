'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Building2, 
  Calendar, 
  Clock, 
  BarChart3, 
  Settings,
  Menu,
  X,
  LogOut,
  UserCog,
  Shield,
  TrendingUp,
  FileText,
  UserPlus,
  CalendarDays,
  Activity,
  MessageSquare,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { TenantSwitcher } from '@/components/tenant/TenantSwitcher';

const getNavigationItems = (userRole: string) => {
  const baseItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, roles: ['admin', 'hr', 'employee'] },
    { name: 'Employees', href: '/employees', icon: Users, roles: ['admin', 'hr'] },
    { name: 'Departments', href: '/departments', icon: Building2, roles: ['admin', 'hr'] },
    { name: 'Leave Requests', href: '/leave-requests', icon: Calendar, roles: ['admin', 'hr', 'employee'] },
    { name: 'Attendance', href: '/attendance', icon: Clock, roles: ['admin', 'hr', 'employee'] },
    { name: 'Performance', href: '/performance', icon: TrendingUp, roles: ['admin', 'hr', 'employee'] },
    { name: 'Surveys & Feedback', href: '/surveys', icon: MessageSquare, roles: ['admin', 'hr', 'employee'] },
    { name: 'Onboarding', href: '/onboarding', icon: UserPlus, roles: ['admin', 'hr'] },
    { name: 'Shift Management', href: '/shifts', icon: CalendarDays, roles: ['admin', 'hr', 'employee'] },
    { name: 'AI Tools', href: '/ai-tools', icon: Brain, roles: ['admin', 'hr'] },
    { name: 'Reports', href: '/reports', icon: FileText, roles: ['admin', 'hr'] },
  ];

  // Add role-specific items
  if (userRole === 'admin') {
    baseItems.push(
      { name: 'User Management', href: '/users', icon: UserCog, roles: ['admin'] },
      { name: 'Audit Logs', href: '/audit-logs', icon: Activity, roles: ['admin'] },
      { name: 'System Settings', href: '/settings', icon: Settings, roles: ['admin'] }
    );
  } else if (userRole === 'hr') {
    baseItems.push(
      { name: 'HR Users', href: '/users', icon: Shield, roles: ['hr'] },
      { name: 'HR Settings', href: '/settings', icon: Settings, roles: ['hr'] }
    );
  }

  return baseItems;
};

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { tenant } = useTenant();

  const navigationItems = getNavigationItems(user?.role || '');
  const filteredNavigation = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ 
                  background: tenant ? `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.secondaryColor})` : 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
                }}
              >
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h1 
                className="text-xl font-bold bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: tenant ? `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.secondaryColor})` : 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
                }}
              >
                {tenant?.name || 'HRMS Pro'}
              </h1>
            </div>
          </div>

          {/* Tenant Switcher */}
          <div className="p-4 border-b border-gray-200">
            <TenantSwitcher />
          </div>

          {/* User info */}
          <div className="flex items-center p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-medium">
                  {user?.name.charAt(0)}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <div className="flex items-center space-x-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  user?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : user?.role === 'hr' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user?.role === 'admin' ? 'Administrator' : user?.role === 'hr' ? 'HR Manager' : 'Employee'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}