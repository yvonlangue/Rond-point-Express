import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockEvents } from '@/lib/events';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';

export default function ProfilePage() {
  // Mock user data and attended events for demonstration
  const user = {
    name: 'Alex Doe',
    avatarUrl: 'https://picsum.photos/100/100',
    bio: 'Event Enthusiast & Community Builder',
  };
  const attendedEventIds = [mockEvents[0].id, mockEvents[2].id, mockEvents[4].id];
  const attendedEvents = mockEvents.filter(event => attendedEventIds.includes(event.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
        <Avatar className="h-28 w-28 border-4 border-primary/50">
          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
          <AvatarFallback className="text-3xl">{user.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground mt-1">{user.bio}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">My Attended Events</h2>
      {attendedEvents.length > 0 ? (
        <div className="space-y-4">
          {attendedEvents.map(event => (
            <Card key={event.id} className="hover:shadow-md transition-shadow border">
              <CardContent className="p-4 flex gap-4 items-center">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  width={150}
                  height={100}
                  className="object-cover w-36 h-24 hidden sm:block"
                  data-ai-hint={`${event.category.toLowerCase()} event`}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-12 border-2 border-dashed">
          <p className="font-medium">You haven't attended any events yet.</p>
          <p className="text-sm">Start exploring to find your next adventure!</p>
        </div>
      )}
    </div>
  );
}
