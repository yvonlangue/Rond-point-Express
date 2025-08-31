import { Card, CardContent } from '@/components/ui/card';
import { mockEvents } from '@/lib/events';
import { format } from 'date-fns';
import { Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
  // Mock data for demonstration
  const isSignedIn = true; 
  const user = {
    name: 'Alex Doe',
    // For now, assume the user is the organizer of a few mock events
    createdEventIds: [mockEvents[0].id, mockEvents[2].id, mockEvents[4].id],
  };

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md text-center">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-4">Welcome</h1>
            <p className="text-muted-foreground mb-6">
              Sign in or create an account to manage your events.
            </p>
            <div className="flex flex-col gap-4">
              <Button size="lg">Sign In</Button>
              <Button size="lg" variant="outline">
                Create an Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const createdEvents = mockEvents.filter(event => user.createdEventIds.includes(event.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Events Dashboard</h1>
        <Button asChild>
          <Link href="/create-event">Create New Event</Link>
        </Button>
      </div>

      {createdEvents.length > 0 ? (
        <div className="space-y-4">
          {createdEvents.map(event => (
            <Card key={event.id} className="border">
              <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
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
                <div className="flex gap-2">
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
  );
}
