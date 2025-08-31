'use client';

import { useState } from 'react';
import { EventCard } from './event-card';
import { EventDetailsModal } from './event-details-modal';
import type { Event } from '@/lib/types';

interface DiscoverFeedProps {
  events: Event[];
}

export function DiscoverFeed({ events }: DiscoverFeedProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Discover Events</h2>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} onOpenModal={handleOpenModal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl font-medium">No Events Found</p>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
        </div>
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
