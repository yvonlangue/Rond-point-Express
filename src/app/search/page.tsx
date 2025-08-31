
'use client';

import { Suspense } from 'react';
import { SearchResults } from '@/components/search-results';

function SearchResultsWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}

export default function SearchPage() {
  return <SearchResultsWrapper />;
}
