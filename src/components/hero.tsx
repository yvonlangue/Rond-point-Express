'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface HeroProps {
  onSearch: (term: string) => void;
}

export function Hero({ onSearch }: HeroProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="text-center py-16 md:py-24">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">Discover Cultural Events</h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Connect with your local cultural scene. Find exhibitions, performances, festivals, and workshops happening near you.
      </p>
      <div className="flex max-w-xl mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for events, artists, venues..."
            className="pl-10 h-12 text-base border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button onClick={handleSearch} size="lg" className="h-12">
          Search
        </Button>
      </div>
    </div>
  );
}
