import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginButton from '../components/auth/LoginButton';
import { Bell, Megaphone, Users, Shield } from 'lucide-react';

export default function SignInPage() {
  const { identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && loginStatus !== 'initializing') {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, loginStatus, navigate]);

  const features = [
    {
      icon: Megaphone,
      title: 'Announcements',
      description: 'Stay updated with campus-wide announcements and important notices',
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Get instant notifications about new announcements and updates',
    },
    {
      icon: Users,
      title: 'Community Hub',
      description: 'Connect with students, faculty, and staff across campus',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with Internet Identity authentication',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl mb-12">
        <img
          src="/assets/generated/campus-hero.dim_1600x600.png"
          alt="Campus Hero"
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground drop-shadow-lg">
            Welcome to Campus Hub
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl drop-shadow">
            Your central platform for campus announcements, notifications, and community engagement
          </p>
          <LoginButton />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA Section */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Ready to get started?</CardTitle>
          <CardDescription className="text-base">
            Sign in with Internet Identity to access all features and stay connected with your campus community
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <LoginButton />
        </CardContent>
      </Card>
    </div>
  );
}
