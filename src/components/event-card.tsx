import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/types';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onOpenModal: (event: Event) => void;
}

export function EventCard({ event, onOpenModal }: EventCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 group border">
      <CardHeader className="p-0 relative">
        <div className="overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={400}
            height={250}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={`${event.category.toLowerCase()} event`}
          />
        </div>
        <Badge className="absolute top-3 right-3" variant="secondary">
          {event.category}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-bold text-lg mb-2 truncate group-hover:text-blue-600 transition-colors">
          {event.title}
        </CardTitle>
        <div className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onOpenModal(event)} className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
