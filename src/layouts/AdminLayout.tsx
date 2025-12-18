import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, ListChecks, LogOut, Bell, X, Activity } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { AdminNotification } from '@/components/admin/AdminNotification';
import { AdminActivityFeed } from '@/components/admin/AdminActivityFeed';
import { useState } from 'react';

export function AdminLayout() {
  const { signOut } = useUser();

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/requests', icon: ListChecks, label: 'Service Requests' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const [showActivity, setShowActivity] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                  }
                >
                  <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex flex-col border-t border-gray-200 p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setShowActivity(!showActivity)}
            >
              <Activity className="mr-3 h-5 w-5" />
              {showActivity ? 'Hide Activity' : 'Show Activity'}
            </Button>
            <Button
              onClick={signOut}
              variant="ghost"
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {window.location.pathname.split('/').pop()?.replace(/^\w/, (c: string) => c.toUpperCase()) || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <AdminNotification />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto focus:outline-none p-6">
          <div className="max-w-7xl mx-auto">
            <div className={showActivity ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
              <div className={showActivity ? 'lg:col-span-2' : ''}>
                <Outlet />
              </div>
              {showActivity && (
                <div className="lg:col-span-1">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <AdminActivityFeed />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
