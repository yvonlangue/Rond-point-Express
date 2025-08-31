'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchResults } from '@/components/search-results';
import { mockEvents } from '@/lib/events';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';

  const filteredEvents = mockEvents.filter(event => {
    const matchesQuery = query ? (
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase())
    ) : true;
    const matchesCategory = category ? event.category === category : true;
    const matchesLocation = location ? event.location.toLowerCase().includes(location.toLowerCase()) : true;

    return matchesQuery && matchesCategory && matchesLocation;
  });

  return <SearchResults events={filteredEvents} />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
