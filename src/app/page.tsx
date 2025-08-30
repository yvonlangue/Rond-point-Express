'use client';

import { useState } from 'react';
import { DiscoverFeed } from '@/components/discover-feed';
import { Hero } from '@/components/hero';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <Hero onSearch={setSearchTerm} />
      <DiscoverFeed searchTerm={searchTerm} />
    </>
  );
}
