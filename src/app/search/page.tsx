'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResults } from '@/components/search-results';
import { eventsApi } from '@/lib/api';
import type { Event } from '@/lib/types';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';
  const artType = searchParams.get('artType') || '';
  const price = searchParams.get('price') || '';
  const featured = searchParams.get('featured') || '';
  
  // New filter parameters
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';
  const artTypes = searchParams.get('artTypes') || '';
  const accessibility = searchParams.get('accessibility') || '';

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, [query, category, location, artType, price, featured, dateFrom, dateTo, artTypes, accessibility]);

  interface SearchFilters {
    dateFrom?: Date;
    dateTo?: Date;
    artTypes?: string[];
    location?: string;
    accessibility?: string[];
  }

  const handleSearch = (filters: SearchFilters) => {
    // Update URL with filter parameters
    const params = new URLSearchParams();
    
    if (filters.dateFrom) {
      params.set('dateFrom', filters.dateFrom.toISOString());
    }
    if (filters.dateTo) {
      params.set('dateTo', filters.dateTo.toISOString());
    }
    if (Array.isArray(filters.artTypes) && filters.artTypes.length > 0) {
      params.set('artTypes', filters.artTypes.join(','));
    }
    if (filters.location) {
      params.set('location', filters.location);
    }
    if (Array.isArray(filters.accessibility) && filters.accessibility.length > 0) {
      params.set('accessibility', filters.accessibility.join(','));
    }
    
    // Preserve existing search parameters
    const existingParams = new URLSearchParams(searchParams.toString());
    existingParams.forEach((value, key) => {
      if (!params.has(key)) {
        params.set(key, value);
      }
    });
    
    // Navigate to updated URL
    router.push(`/search?${params.toString()}`);
  };

  interface QueryParams {
    search?: string;
    category?: string;
    location?: string;
    artType?: string;
    price?: 'free' | 'paid' | string;
    featured?: boolean;
    dateFrom?: string;
    dateTo?: string;
    accessibility?: string[] | string;
    limit?: number;
  }

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchParams: QueryParams = {};
      
      if (query) searchParams.search = query;
      if (category) searchParams.category = category;
      if (price) searchParams.price = price;
      if (featured === 'true') searchParams.featured = true;
      
      // Handle location - prioritize filter over URL parameter
      if (location) {
        searchParams.location = location;
      }
      
      // Handle art type - prioritize filter over URL parameter
      if (artTypes) {
        const artTypesArray = artTypes.split(',');
        searchParams.artType = artTypesArray[0]; // Use first one for now
      } else if (artType) {
        searchParams.artType = artType;
      }
      
      // Apply new filter parameters
      if (dateFrom) searchParams.dateFrom = dateFrom;
      if (dateTo) searchParams.dateTo = dateTo;
      if (accessibility) {
        // Handle accessibility filters
        searchParams.accessibility = accessibility;
      }
      
      searchParams.limit = 50; // Show more results on search page
      
      console.log('Search parameters being sent to API:', searchParams);
      
      const response = await eventsApi.getAll(searchParams);
      
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

  return (
    <SearchResults 
      events={events} 
      loading={loading}
      error={error}
      onRefresh={loadEvents}
      onSearch={handleSearch}
    />
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading search results...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
