import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AnnouncementDetailPage from './pages/AnnouncementDetailPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import ProfileSetupDialog from './components/profile/ProfileSetupDialog';
import { useEffect } from 'react';

// Layout component that wraps all authenticated routes
function Layout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: Layout,
});

// Define routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SignInPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const announcementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/announcements',
  component: AnnouncementsPage,
});

const announcementDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/announcements/$announcementId',
  component: AnnouncementDetailPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: NotificationsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  announcementsRoute,
  announcementDetailRoute,
  notificationsRoute,
  profileRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Auth guard component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (loginStatus !== 'initializing' && !isAuthenticated && window.location.pathname !== '/') {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, loginStatus, navigate]);

  return <>{children}</>;
}

// Profile setup guard
function ProfileSetupGuard({ children }: { children: React.ReactNode }) {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      {showProfileSetup && <ProfileSetupDialog />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthGuard>
        <ProfileSetupGuard>
          <RouterProvider router={router} />
          <Toaster />
        </ProfileSetupGuard>
      </AuthGuard>
    </ThemeProvider>
  );
}
