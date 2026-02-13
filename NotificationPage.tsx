import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate, Link } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useGetNotifications, useMarkNotificationAsRead } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatTimestamp } from '../lib/format';
import { Bell, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const { identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: notifications, isLoading } = useGetNotifications();
  const markAsRead = useMarkNotificationAsRead();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (loginStatus !== 'initializing' && !isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, loginStatus, navigate]);

  const handleMarkAsRead = async (notificationId: bigint) => {
    try {
      await markAsRead.mutateAsync(notificationId);
      toast.success('Notification marked as read');
    } catch (error: any) {
      console.error('Mark as read error:', error);
      toast.error(error.message || 'Failed to mark notification as read');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const unreadNotifications = notifications?.filter((n) => !n.isRead) || [];
  const readNotifications = notifications?.filter((n) => n.isRead) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bell className="h-8 w-8 text-primary" />
          Notifications
        </h1>
        <p className="text-muted-foreground mt-1">
          Stay updated with the latest campus announcements and activities
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Loading notifications...</p>
          </CardContent>
        </Card>
      ) : !notifications || notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No notifications yet</p>
              <p className="text-sm text-muted-foreground">
                You'll receive notifications when new announcements are posted
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Unread</h2>
                <Badge variant="destructive">{unreadNotifications.length}</Badge>
              </div>
              <div className="space-y-3">
                {unreadNotifications.map((notification) => (
                  <Card
                    key={notification.id.toString()}
                    className="border-2 border-primary/20 bg-primary/5 hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Link
                            to="/announcements/$announcementId"
                            params={{ announcementId: notification.referenceId.toString() }}
                          >
                            <CardTitle className="text-base hover:text-primary transition-colors cursor-pointer">
                              {notification.message}
                            </CardTitle>
                          </Link>
                          <CardDescription className="mt-1">
                            {formatTimestamp(notification.createdTimestamp)}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={markAsRead.isPending}
                          className="gap-2 shrink-0"
                        >
                          <Check className="h-4 w-4" />
                          Mark Read
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <div className="space-y-4">
              {unreadNotifications.length > 0 && <Separator />}
              <h2 className="text-xl font-semibold">Read</h2>
              <div className="space-y-3">
                {readNotifications.map((notification) => (
                  <Card key={notification.id.toString()} className="opacity-60 hover:opacity-100 transition-opacity">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Link
                            to="/announcements/$announcementId"
                            params={{ announcementId: notification.referenceId.toString() }}
                          >
                            <CardTitle className="text-base hover:text-primary transition-colors cursor-pointer">
                              {notification.message}
                            </CardTitle>
                          </Link>
                          <CardDescription className="mt-1">
                            {formatTimestamp(notification.createdTimestamp)}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          Read
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
