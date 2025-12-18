import { RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { ServiceRequestsPage } from '@/pages/admin/ServiceRequestsPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';
import { AdminRoute } from '@/components/auth/AdminRoute';

export const adminRoutes: RouteObject = {
  path: '/admin',
  element: <AdminRoute><AdminLayout /></AdminRoute>,
  children: [
    { index: true, element: <DashboardPage /> },
    { path: 'users', element: <UsersPage /> },
    { path: 'requests', element: <ServiceRequestsPage /> },
    { path: 'settings', element: <SettingsPage /> },
  ],
};
