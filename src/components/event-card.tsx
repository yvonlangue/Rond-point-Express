
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Event } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onOpenModal: (event: Event) => void;
}

export function EventCard({ event, onOpenModal }: EventCardProps) {
  const formattedDate = format(parseISO(event.date), "eeee, MMMM d, yyyy • HH:mm");
  
  // Get the first image or use a default
  const imageUrl = event.images && event.images.length > 0 
    ? event.images[0] 
    : 'https://picsum.photos/600/400';

  console.log('EventCard - Event:', event.title, 'Images:', event.images, 'Using URL:', imageUrl);

  return (
    <Card
      className="flex flex-col overflow-hidden cursor-pointer group border relative"
      onClick={() => onOpenModal(event)}
    >
      {event.featured && (
         <Badge variant="default" className="absolute top-2 right-2 z-10">
          <Star className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      )}
      <div className="overflow-hidden">
        <Image
          src={imageUrl}
          alt={event.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          data-ai-hint="Cameroonian art"
        />
      </div>

      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm">{event.art_type}</p>
          <p className="text-sm font-medium">
            {event.price ? `${event.price.toLocaleString()} XAF` : 'Free'}
          </p>
        </div>
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {event.description}
        </p>
        <div className="text-sm space-y-1">
          <p className="font-bold">{formattedDate}</p>
          <p>{event.location}</p>
          <p>Organized by {event.organizer.name}</p>
        </div>
      </CardContent>
    </Card>
  );
}
