
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/types';
import { Calendar, MapPin, User, Ticket } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from './ui/button';
import Link from 'next/link';

interface EventDetailsModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailsModal({ event, isOpen, onClose }: EventDetailsModalProps) {
  const formattedDate = format(parseISO(event.date), "eeee, MMMM d, yyyy • HH:mm");
  
  // Get the first image or use a default
  const imageUrl = event.images && event.images.length > 0 
    ? event.images[0] 
    : 'https://picsum.photos/600/400';


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 flex flex-col">
        <div className="relative">
          <Image
            src={imageUrl}
            alt={event.title}
            width={600}
            height={300}
            className="w-full h-auto object-contain"
            data-ai-hint="Douala gallery"
          />
        </div>
        <DialogHeader className="p-6 pb-2">
          <div className="flex justify-between items-start">
            <DialogTitle className="font-bold text-3xl pr-4">{event.title}</DialogTitle>
            <div className='flex flex-col items-end gap-2'>
              <Badge variant="outline">{event.art_type}</Badge>
              <p className="text-lg font-bold">
                {event.price && event.price > 0 ? `${event.price.toLocaleString()} XAF` : 'Free'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Organized by {event.organizer.name}</span>
            </div>
          </div>
        </DialogHeader>
        <div className="px-6 pb-6 space-y-4 flex-1">
          <p className="text-base text-foreground/80 leading-relaxed">
            {event.description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
