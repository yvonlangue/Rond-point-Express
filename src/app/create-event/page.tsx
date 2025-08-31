import { EventForm } from '@/components/event-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CreateEventPage() {
  const isSignedIn = false;

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You must be signed in to create an event. Please sign in or create an account to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild>
              <Link href="/profile">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Explore Events</Link>
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
