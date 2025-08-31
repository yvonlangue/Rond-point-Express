import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Event } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onOpenModal: (event: Event) => void;
}

export function EventCard({ event, onOpenModal }: EventCardProps) {
  const formattedDate = format(parseISO(event.date), "eeee, MMMM d, yyyy • HH:mm");

  return (
    <Card
      className="flex flex-col overflow-hidden cursor-pointer group border border-black"
      onClick={() => onOpenModal(event)}
    >
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

      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm">{event.category}</p>
          <p className="text-sm font-medium">
            {event.price ? `€${event.price}` : 'Free'}
          </p>
        </div>
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {event.description}
        </p>
        <div className="text-sm space-y-1">
          <p className="font-bold">{formattedDate}</p>
          <p>{event.location}</p>
          <p>Organized by {event.organizer}</p>
        </div>
      </CardContent>

      <CardFooter className="p-0 border-t border-black">
        <div className="flex items-center justify-center w-full p-3 font-bold text-sm">
          View Details
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </CardFooter>
    </Card>
  );
}
