'use client';

import { useState } from 'react';
import { EventCard } from './event-card';
import { EventDetailsModal } from './event-details-modal';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { RefreshCw, AlertCircle } from 'lucide-react';
import type { Event } from '@/lib/types';

interface DiscoverFeedProps {
  events: Event[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export function DiscoverFeed({ events, loading = false, error, onRefresh }: DiscoverFeedProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Discover Events</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-card border rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-muted"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Discover Events</h2>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
          {onRefresh && (
            <Button variant="outline" className="mt-4" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
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
