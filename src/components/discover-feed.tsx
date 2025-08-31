
'use client';

import { useState, useMemo } from 'react';
import type { Event } from '@/lib/types';
import { mockEvents } from '@/lib/events';
import { EventCard } from '@/components/event-card';
import { EventDetailsModal } from '@/components/event-details-modal';
import { Button } from '@/components/ui/button';

interface DiscoverFeedProps {
  searchTerm?: string;
}

export function DiscoverFeed({ searchTerm = '' }: DiscoverFeedProps) {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { categories, locations } = useMemo(() => {
    const categories = [...new Set(events.map(e => e.category))];
    const locations = [...new Set(events.map(e => e.location))];
    return { categories, locations };
  }, [events]);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (activeFilters.length > 0) {
      filtered = filtered.filter(event =>
        activeFilters.some(filter => event.category === filter || event.location === filter)
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
      <div className="bg-card border p-4 mb-8 sticky top-20 z-40">
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-sm font-medium mb-2">Filter by Category</p>
                 <div className="flex flex-wrap gap-2">
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
             <div>
                <p className="text-sm font-medium mb-2">Filter by Location</p>
                 <div className="flex flex-wrap gap-2">
                    {locations.map(filter => (
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
