'use client';

import { useState } from 'react';
import { Hero } from '@/components/hero';
import { SearchResults } from '@/components/search-results';
import { mockEvents } from '@/lib/events';
import type { Event } from '@/lib/types';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = mockEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Hero onSearch={setSearchTerm} />
      <SearchResults events={filteredEvents} searchTerm={searchTerm} />
    </>
  );
}
