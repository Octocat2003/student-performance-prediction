import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [displayName, setDisplayName] = useState('');
  const [department, setDepartment] = useState('');

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (loginStatus !== 'initializing' && !isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, loginStatus, navigate]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setDepartment(profile.department || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!identity) {
      toast.error('Not authenticated');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        principal: identity.getPrincipal(),
        displayName: displayName.trim(),
        department: department.trim() || undefined,
      });
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          Your Profile
        </h1>
        <p className="text-muted-foreground mt-1">Manage your campus profile information</p>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your display name and department information</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">
                Display Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="displayName"
                placeholder="Enter your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                This name will be visible to other users on the platform
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department / Program (Optional)</Label>
              <Input
                id="department"
                placeholder="e.g., Computer Science, Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Help others identify your academic department or program
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Principal ID</Label>
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-xs break-all">{identity?.getPrincipal().toString()}</code>
              </div>
              <p className="text-xs text-muted-foreground">
                Your unique Internet Identity principal (read-only)
              </p>
            </div>

            <Button type="submit" disabled={saveProfile.isPending} className="w-full gap-2">
              <Save className="h-4 w-4" />
              {saveProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
