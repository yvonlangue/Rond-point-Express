
'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockEvents } from '@/lib/events';
import type { Event } from '@/lib/types';
import { EventCard } from './event-card';
import { EventDetailsModal } from './event-details-modal';
import { FilterSidebar } from './filter-sidebar';
import { Button } from './ui/button';
import { List, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredEvents = useMemo(() => {
    let events = mockEvents;
    if (query) {
      events = events.filter(event =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    return events;
  }, [query]);

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar />
        <main className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">
              {filteredEvents.length} event{filteredEvents.length !== 1 && 's'} found for "{query}"
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="hidden md:inline-flex">
                <SlidersHorizontal className="w-4 h-4 mr-2"/>
                Filters
              </Button>
              <div className="flex items-center border rounded-md">
                <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                  <LayoutGrid className="w-5 h-5" />
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                  <List className="w-5 h-5" />
                </Button>
              </div>
              <Select defaultValue="date">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="relevance">Sort by Relevance</SelectItem>
                  <SelectItem value="price">Sort by Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredEvents.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} onOpenModal={handleOpenModal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl font-medium">No Events Found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </div>
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

export function SearchResults() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
}
