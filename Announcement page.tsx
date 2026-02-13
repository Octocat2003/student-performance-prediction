import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useListAnnouncements, useCreateAnnouncement, useDeleteAnnouncement } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatTimestamp } from '../lib/format';
import { Megaphone, Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AnnouncementsPage() {
  const { identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: announcements, isLoading } = useListAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (loginStatus !== 'initializing' && !isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, loginStatus, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createAnnouncement.mutateAsync({ title: title.trim(), body: body.trim() });
      toast.success('Announcement created successfully!');
      setTitle('');
      setBody('');
      setShowForm(false);
    } catch (error: any) {
      console.error('Create announcement error:', error);
      toast.error(error.message || 'Failed to create announcement');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await deleteAnnouncement.mutateAsync(id);
      toast.success('Announcement deleted successfully');
    } catch (error: any) {
      console.error('Delete announcement error:', error);
      toast.error(error.message || 'Failed to delete announcement');
    }
  };

  const isAuthor = (authorPrincipal: any) => {
    if (!identity) return false;
    return authorPrincipal.toString() === identity.getPrincipal().toString();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-primary" />
            Announcements
          </h1>
          <p className="text-muted-foreground mt-1">Campus-wide updates and notices</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'New Announcement'}
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Create New Announcement</CardTitle>
            <CardDescription>Share important information with the campus community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter announcement title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  placeholder="Enter announcement details"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={createAnnouncement.isPending} className="flex-1">
                  {createAnnouncement.isPending ? 'Creating...' : 'Create Announcement'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">Loading announcements...</p>
            </CardContent>
          </Card>
        ) : !announcements || announcements.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-3">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">No announcements yet</p>
                <p className="text-sm text-muted-foreground">
                  Be the first to create an announcement for the campus community
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id.toString()} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/announcements/$announcementId"
                      params={{ announcementId: announcement.id.toString() }}
                    >
                      <CardTitle className="hover:text-primary transition-colors cursor-pointer">
                        {announcement.title}
                      </CardTitle>
                    </Link>
                    <CardDescription className="mt-1">
                      {formatTimestamp(announcement.createdTimestamp)}
                    </CardDescription>
                  </div>
                  {isAuthor(announcement.author) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(announcement.id)}
                      disabled={deleteAnnouncement.isPending}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap line-clamp-3">{announcement.body}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
