import { EventForm } from '@/components/event-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function CreateEventPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="border">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-3xl uppercase">Create a New Event</CardTitle>
          <CardDescription>Fill out the form below to share your event with the community.</CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm />
        </CardContent>
      </Card>
    </div>
  );
}
