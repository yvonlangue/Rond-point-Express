
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar, MapPin, Edit, Trash2, Zap, LogIn, LineChart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usersApi } from '@/lib/api';
import type { Event } from '@/lib/types';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { useUserSync } from '@/hooks/use-user-sync';

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
  const { user, isLoaded } = useUser();
  const router = useRouter();
  useUserSync(); // Automatically sync user with Supabase
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isLoaded) {
      loadUserData();
    }
  }, [user, isLoaded]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setEventsLoading(true);
      setStatsLoading(true);
      setError(null);

      // Load user events and stats in parallel
      const [eventsResponse, statsResponse] = await Promise.all([
        usersApi.getEvents(user.id, { limit: 50 }),
        usersApi.getStats(user.id)
      ]);

      if (eventsResponse.error) {
        setError(eventsResponse.error);
      } else if (eventsResponse.data) {
        setUserEvents(eventsResponse.data.events);
      }

      if (statsResponse.error) {
        console.error('Failed to load user stats:', statsResponse.error);
      } else if (statsResponse.data) {
        setUserStats(statsResponse.data.stats);
      }
    } catch (err) {
      setError('Failed to load user data');
      console.error('Error loading user data:', err);
    } finally {
      setEventsLoading(false);
      setStatsLoading(false);
    }
  };

  const handleEditEvent = (eventId: string) => {
    // Navigate to edit page with event ID
    router.push(`/create-event?edit=${eventId}`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      // TODO: Implement delete event API call
      console.log('Delete event:', eventId);
      // After successful deletion, refresh the data
      await loadUserData();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SignedOut>
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Access Your Dashboard</CardTitle>
              <CardDescription>
                Sign in to manage your events or create a new account to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <SignInButton mode="modal">
                <Button size="lg" className="w-full">
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="grid gap-12 md:grid-cols-[1fr_300px]">
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold">My Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={loadUserData} disabled={eventsLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${eventsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button asChild disabled={!user?.publicMetadata?.isPremium && userEvents.length >= FREE_EVENT_LIMIT}>
                  <Link href="/create-event">Create New Event</Link>
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-8">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!user?.publicMetadata?.isPremium && userEvents.length >= FREE_EVENT_LIMIT && (
              <Alert variant="default" className="mb-8 bg-amber-50 border-amber-200 text-amber-900">
                 <Zap className="h-4 w-4 !text-amber-600" />
                <AlertDescription>
                  You've reached your limit of {FREE_EVENT_LIMIT} free events. 
                  <Link href="/premium" className="font-bold underline hover:text-amber-700"> Upgrade to Premium</Link> to create unlimited events.
                </AlertDescription>
              </Alert>
            )}

            {/* User Stats */}
            {userStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{userStats.totalEvents}</div>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{userStats.approvedEvents}</div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{userStats.pendingEvents}</div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{userStats.featuredEvents}</div>
                    <p className="text-sm text-muted-foreground">Featured</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* User Events */}
            {eventsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="border animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userEvents.length > 0 ? (
              <div className="space-y-4">
                {userEvents.map(event => (
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
                        <div className="text-sm text-muted-foreground mt-1">
                          Status: <span className="capitalize">{event.status || 'pending'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                         {(user?.publicMetadata as any)?.isPremium && (
                          <Button variant="outline" size="icon" disabled>
                              <LineChart className="w-4 h-4" />
                              <span className="sr-only">Analytics</span>
                          </Button>
                         )}
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditEvent(event.id)}
                        >
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
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
            {!user?.publicMetadata?.isPremium && <PremiumUpgradeCTA />}
          </aside>
        </div>
      </SignedIn>
    </div>
  );
}
