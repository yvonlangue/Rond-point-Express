'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import type { Event } from '@/lib/types';
import { mockEvents } from '@/lib/events';
import { EventCard } from '@/components/event-card';
import { EventDetailsModal } from '@/components/event-details-modal';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { generateQuickFilters } from '@/ai/flows/generate-quick-filters';
import { useToast } from '@/hooks/use-toast';

export function DiscoverFeed() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [suggestedFilters, setSuggestedFilters] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const allFilterableItems = useMemo(() => {
    const categories = [...new Set(events.map(e => e.category))];
    const locations = [...new Set(events.map(e => e.location))];
    return [...new Set([...categories, ...locations])];
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (activeFilters.length === 0) {
      return events;
    }
    return events.filter(event =>
      activeFilters.some(filter => event.category === filter || event.location === filter)
    );
  }, [activeFilters, events]);

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

  const handleGenerateSuggestions = () => {
    startTransition(async () => {
      try {
        const userHistory = 'User has shown interest in outdoor music festivals and modern art exhibitions in urban areas.';
        const result = await generateQuickFilters({ userHistory });
        setSuggestedFilters(prev => [...new Set([...prev, ...result.suggestedFilters])]);
        toast({
          title: 'Suggestions Ready!',
          description: 'We have generated some quick filters based on your interests.',
        });
      } catch (error) {
        console.error('Failed to generate quick filters:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not generate filter suggestions at this time.',
        });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Discover Your Next Event</h1>
        <p className="text-lg text-muted-foreground">Browse, filter, and find experiences tailored for you.</p>
      </div>

      <div className="bg-card border p-4 mb-8 sticky top-20 z-40">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
                <p className="text-sm font-medium mb-2">Filter by Category or Location</p>
                 <div className="flex flex-wrap gap-2">
                    {allFilterableItems.map(filter => (
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
             <div className="flex-shrink-0 sm:border-l sm:pl-4">
                <p className="text-sm font-medium mb-2">AI Suggestions</p>
                 <div className="flex flex-wrap gap-2">
                    <Button onClick={handleGenerateSuggestions} disabled={isPending} variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
                        <Sparkles className={`mr-2 h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                        {isPending ? 'Generating...' : 'Smart Filters'}
                    </Button>
                    {suggestedFilters.map(filter => (
                    <Button
                        key={`suggested-${filter}`}
                        variant={activeFilters.includes(filter) ? 'default' : 'secondary'}
                        onClick={() => toggleFilter(filter)}
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
            <p className="text-muted-foreground mt-2">Try adjusting your filters to find more events.</p>
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
