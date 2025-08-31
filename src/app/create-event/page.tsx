'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { EventForm } from '@/components/event-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CreateEventPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/profile');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md text-center">
         <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Event</CardTitle>
            <CardDescription>
              To create and manage events, you need an account. Please sign in or create one to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">Redirecting to sign-in...</p>
            <Button asChild size="lg" disabled>
              <Link href="/profile">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="border">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-3xl">Create a New Event</CardTitle>
          <CardDescription>Fill out the form below to share your event with the community.</CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm />
        </CardContent>
      </Card>
    </div>
  );
}
