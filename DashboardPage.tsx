import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useListAnnouncements, useGetNotificationsSummary, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatTimestamp } from '../lib/format';
import { Bell, Megaphone, User, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function DashboardPage() {
  const { identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: announcements, isLoading: announcementsLoading } = useListAnnouncements();
  const { data: summary } = useGetNotificationsSummary();
  const { data: profile } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (loginStatus !== 'initializing' && !isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, loginStatus, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const recentAnnouncements = announcements?.slice(0, 3) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back{profile?.displayName ? `, ${profile.displayName}` : ''}!
        </h1>
        <p className="text-muted-foreground">Here's what's happening on campus today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active announcements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(summary?.unread || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Number(summary?.total || 0)} total notifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{profile?.displayName || 'User'}</div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {profile?.department || 'No department set'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>Latest updates from campus</CardDescription>
            </div>
            <Link to="/announcements">
              <Button variant="ghost" size="sm" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {announcementsLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading announcements...</p>
          ) : recentAnnouncements.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No announcements yet</p>
          ) : (
            <div className="space-y-4">
              {recentAnnouncements.map((announcement, index) => (
                <div key={announcement.id.toString()}>
                  {index > 0 && <Separator className="my-4" />}
                  <Link
                    to="/announcements/$announcementId"
                    params={{ announcementId: announcement.id.toString() }}
                    className="block group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {announcement.body}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(announcement.createdTimestamp)}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Create Announcement
            </CardTitle>
            <CardDescription>Share important updates with the campus community</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/announcements">
              <Button className="w-full">Go to Announcements</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              View Notifications
            </CardTitle>
            <CardDescription>Check your latest notifications and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/notifications">
              <Button className="w-full" variant="outline">
                Go to Notifications
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
