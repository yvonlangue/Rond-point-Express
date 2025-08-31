
'use client';

import { useState, useMemo } from 'react';
import type { Event } from '@/lib/types';
import { mockEvents } from '@/lib/events';
import { EventCard } from '@/components/event-card';
import { EventDetailsModal } from '@/components/event-details-modal';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

interface DiscoverFeedProps {
  searchTerm?: string;
}

export function DiscoverFeed({ searchTerm = '' }: DiscoverFeedProps) {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const categories = useMemo(() => {
    return [...new Set(events.map(e => e.category))];
  }, [events]);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (activeFilters.length > 0) {
      filtered = filtered.filter(event =>
        activeFilters.includes(event.category)
      );
    }

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(lowercasedSearchTerm) ||
        event.description.toLowerCase().includes(lowercasedSearchTerm) ||
        event.location.toLowerCase().includes(lowercasedSearchTerm) ||
        event.organizer.toLowerCase().includes(lowercasedSearchTerm) ||
        event.category.toLowerCase().includes(lowercasedSearchTerm)
      );
    }
    
    return filtered;
  }, [activeFilters, events, searchTerm]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="bg-card p-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Trending Events</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Updated moments ago</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
            <Button
                variant={activeFilters.length === 0 ? 'default' : 'outline'}
                onClick={() => setActiveFilters([])}
                className="transition-all"
                size="sm"
            >
                All Events
            </Button>
            {categories.map(filter => (
            <Button
                key={filter}
                variant={activeFilters.includes(filter) ? 'default' : 'outline'}
                onClick={() => toggleFilter(filter)}
                className="transition-all"
                size="sm"
            >
                {filter}
            </Button>
            ))}
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} onOpenModal={handleOpenModal} />
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-xl font-medium">No Events Found</p>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search term to find more events.</p>
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
