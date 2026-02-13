import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAnnouncement, useDeleteAnnouncement } from '../hooks/useQueries';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatFullTimestamp } from '../lib/format';
import { ArrowLeft, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AnnouncementDetailPage() {
  const { announcementId } = useParams({ from: '/announcements/$announcementId' });
  const navigate = useNavigate();
  const { identity, loginStatus } = useInternetIdentity();
  const { data: announcement, isLoading } = useGetAnnouncement(BigInt(announcementId));
  const deleteAnnouncement = useDeleteAnnouncement();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (loginStatus !== 'initializing' && !isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, loginStatus, navigate]);

  const isAuthor = announcement && identity
    ? announcement.author.toString() === identity.getPrincipal().toString()
    : false;

  const handleDelete = async () => {
    if (!announcement) return;

    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await deleteAnnouncement.mutateAsync(announcement.id);
      toast.success('Announcement deleted successfully');
      navigate({ to: '/announcements' });
    } catch (error: any) {
      console.error('Delete announcement error:', error);
      toast.error(error.message || 'Failed to delete announcement');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Loading announcement...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/announcements">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Announcements
          </Button>
        </Link>
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Announcement not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link to="/announcements">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Announcements
        </Button>
      </Link>

      {/* Announcement Detail */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl">{announcement.title}</CardTitle>
              <CardDescription className="mt-2">
                Posted {formatFullTimestamp(announcement.createdTimestamp)}
              </CardDescription>
            </div>
            {isAuthor && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleteAnnouncement.isPending}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">{announcement.body}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
