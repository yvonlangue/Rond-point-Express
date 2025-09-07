'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/components/hero';
import { DiscoverFeed } from '@/components/discover-feed';
import { eventsApi } from '@/lib/api';
import type { Event } from '@/lib/types';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventsApi.getAll({ limit: 20 });
      
      if (response.error) {
        setError(response.error);
        console.error('Failed to load events:', response.error);
      } else if (response.data) {
        setEvents(response.data.events);
      }
    } catch (err) {
      setError('Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.art_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Hero />
      <DiscoverFeed 
        events={filteredEvents} 
        loading={loading}
        error={error}
        onRefresh={loadEvents}
      />
    </>
  );
}
