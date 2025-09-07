'use client';

import { useState, useEffect } from 'react';
import type { Event } from '@/lib/types';
import { EventCard } from './event-card';
import { EventDetailsModal } from './event-details-modal';
import { FilterSidebar } from './filter-sidebar';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { List, LayoutGrid, SlidersHorizontal, RefreshCw, AlertCircle, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useSearchParams, useRouter } from 'next/navigation';

interface FiltersPayload {
  dateFrom?: Date;
  dateTo?: Date;
  artTypes?: string[];
  location?: string;
  accessibility?: string[];
}

interface SearchResultsProps {
  events: Event[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onSearch?: (filters: FiltersPayload) => void;
}

export function SearchResults({ events, loading = false, error, onRefresh, onSearch }: SearchResultsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchTerm = searchParams.get('q') || '';
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const handleFiltersChange = (filters: FiltersPayload) => {
    // Check if any filters are active
    const isActive = !!(
      filters.dateFrom ||
      filters.dateTo ||
      (Array.isArray(filters.artTypes) && filters.artTypes.length > 0) ||
      filters.location ||
      (Array.isArray(filters.accessibility) && filters.accessibility.length > 0)
    );
    setHasActiveFilters(isActive);
  };

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // Update URL with sort parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/search?${params.toString()}`);
  };

  const handleSearch = () => {
    if (onSearch) {
      // Get current filter values from FilterSidebar
      // For now, we'll trigger a refresh which will use current URL params
      onRefresh?.();
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar onFiltersChange={handleFiltersChange} />
          <main className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Loading events...</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-card border rounded-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar onFiltersChange={handleFiltersChange} />
          <main className="w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                {onRefresh && (
                  <Button variant="outline" size="sm" onClick={onRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar onFiltersChange={handleFiltersChange} />
        <main className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">
              {events.length} event{events.length !== 1 && 's'} found
              {searchTerm && ` for "${searchTerm}"`}
            </h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="hidden md:inline-flex"
                onClick={toggleFilters}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2"/>
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </Button>
              {hasActiveFilters && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleSearch}
                  className="flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              )}
              <div className="flex items-center border rounded-md">
                <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                  <LayoutGrid className="w-5 h-5" />
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                  <List className="w-5 h-5" />
                </Button>
              </div>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="relevance">Sort by Relevance</SelectItem>
                  <SelectItem value="price">Sort by Price</SelectItem>
                  <SelectItem value="title">Sort by Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {events.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {events.map(event => (
                <EventCard key={event.id} event={event} onOpenModal={handleOpenModal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl font-medium">No Events Found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
              {onRefresh && (
                <Button variant="outline" className="mt-4" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              )}
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
