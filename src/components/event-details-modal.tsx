import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/types';
import { Calendar, MapPin, User, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface EventDetailsModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailsModal({ event, isOpen, onClose }: EventDetailsModalProps) {
  const { toast } = useToast();

  const handleAttend = () => {
    toast({
      title: "You're going!",
      description: `You are now attending "${event.title}".`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0">
        <div className="relative">
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={600}
            height={300}
            className="w-full h-64 object-cover rounded-t-lg"
            data-ai-hint={`${event.category.toLowerCase()} event detail`}
          />
        </div>
        <DialogHeader className="p-6 pb-2">
          <div className="flex justify-between items-start">
            <DialogTitle className="font-headline text-3xl pr-4">{event.title}</DialogTitle>
            <Badge variant="secondary">{event.category}</Badge>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Organized by {event.organizer}</span>
            </div>
          </div>
        </DialogHeader>
        <div className="px-6 pb-6 space-y-4">
          <p className="text-body text-base text-foreground/80 leading-relaxed">
            {event.description}
          </p>
          <Button onClick={handleAttend} className="w-full" size="lg">
            <Ticket className="mr-2 h-5 w-5" />
            Attend Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
