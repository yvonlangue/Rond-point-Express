
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockEvents } from '@/lib/events';
import { format } from 'date-fns';
import { Calendar, MapPin, Edit, Trash2, Zap, LogIn, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FREE_EVENT_LIMIT = 3;

function PremiumUpgradeCTA() {
  return (
    <Card className="bg-primary-foreground border-primary/20 border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl font-bold">Unlock Premium Features</CardTitle>
        </div>
        <CardDescription>
          Upgrade your account to feature your events, get detailed analytics, and reach a wider audience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full" size="lg">
          <Link href="/premium">Upgrade to Premium</Link>
        </Button>
      </CardContent>
    </Card>
  );
}


export default function ProfilePage() {
  const { user, loading, signInWithGoogle } = useAuth();
  
  // Mock data for demonstration - will be replaced with real user data
  const organizer = {
    name: user?.displayName || 'Alex Doe',
    createdEventIds: [mockEvents[0].id, mockEvents[2].id, mockEvents[4].id],
    isPremium: false, // Mock premium status
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Access Your Dashboard</CardTitle>
            <CardDescription>
              Sign in to manage your events or create a new account to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Button size="lg" className="w-full" onClick={signInWithGoogle}>
              <LogIn className="mr-2 h-4 w-4" /> Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const createdEvents = mockEvents.filter(event => organizer.createdEventIds.includes(event.id));
  const hasReachedFreeLimit = !organizer.isPremium && createdEvents.length >= FREE_EVENT_LIMIT;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-12 md:grid-cols-[1fr_300px]">
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.displayName}!</p>
            </div>
            <Button asChild disabled={hasReachedFreeLimit}>
              <Link href="/create-event">Create New Event</Link>
            </Button>
          </div>

          {hasReachedFreeLimit && (
            <Alert variant="default" className="mb-8 bg-amber-50 border-amber-200 text-amber-900">
               <Zap className="h-4 w-4 !text-amber-600" />
              <AlertDescription>
                You've reached your limit of {FREE_EVENT_LIMIT} free events. 
                <Link href="/premium" className="font-bold underline hover:text-amber-700"> Upgrade to Premium</Link> to create unlimited events.
              </AlertDescription>
            </Alert>
          )}

          {createdEvents.length > 0 ? (
            <div className="space-y-4">
              {createdEvents.map(event => (
                <Card key={event.id} className="border">
                  <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                       {organizer.isPremium && (
                        <Button variant="outline" size="icon" disabled>
                            <LineChart className="w-4 h-4" />
                            <span className="sr-only">Analytics</span>
                        </Button>
                       )}
                      <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
              <p className="font-medium">You haven't created any events yet.</p>
              <p className="text-sm">Click the button above to get started!</p>
            </div>
          )}
        </div>
        <aside className="space-y-8">
          {!organizer.isPremium && <PremiumUpgradeCTA />}
        </aside>
      </div>
    </div>
  );
}
