import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useNotificationPolling } from '../../hooks/useNotificationPolling';
import LoginButton from '../auth/LoginButton';
import UnreadBadge from '../notifications/UnreadBadge';
import { Bell, Home, Megaphone, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SiCoffeescript } from 'react-icons/si';
import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const isAuthenticated = !!identity;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useNotificationPolling();

  const currentPath = routerState.location.pathname;

  const navItems = isAuthenticated
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/announcements', label: 'Announcements', icon: Megaphone },
        { path: '/notifications', label: 'Notifications', icon: Bell },
        { path: '/profile', label: 'Profile', icon: User },
      ]
    : [];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            } ${mobile ? 'text-base' : 'text-sm font-medium'}`}
            onClick={() => mobile && setMobileMenuOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.label}
            {item.path === '/notifications' && <UnreadBadge />}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/generated/campus-logo.dim_512x512.png"
                alt="Campus Logo"
                className="h-10 w-10 rounded-lg"
              />
              <span className="font-bold text-lg hidden sm:inline-block">Campus Hub</span>
            </Link>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-2">
                <NavLinks />
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            <LoginButton />

            {/* Mobile Menu */}
            {isAuthenticated && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <nav className="flex flex-col gap-2 mt-8">
                    <NavLinks mobile />
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-6 mt-auto">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Campus Hub. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <SiCoffeescript className="h-4 w-4 text-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
