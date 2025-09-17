'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/components/hero';
import { EventCard } from '@/components/event-card';
import { EventDetailsModal } from '@/components/event-details-modal';
import { eventsApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Star } from 'lucide-react';
import type { Event } from '@/lib/types';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load all events
      const response = await eventsApi.getAll({ limit: 20 });
      
      if (response.error) {
        setError(response.error);
        console.error('Failed to load events:', response.error);
      } else if (response.data) {
        setEvents(response.data.events);
        
        // Separate featured events
        const featured = response.data.events.filter(event => event.featured);
        setFeaturedEvents(featured);
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

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // Get main featured event (first featured event)
  const mainEvent = featuredEvents[0];
  // Get remaining featured events for sidebar
  const sidebarFeaturedEvents = featuredEvents.slice(1, 3);
  // Get recent events (non-featured, sorted by date)
  const recentEvents = events
    .filter(event => !event.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  if (loading) {
    return (
      <>
        <Hero />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                <div className="h-8 bg-muted rounded animate-pulse"></div>
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-card border rounded-lg overflow-hidden animate-pulse">
                      <div className="h-32 bg-muted"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-6">
              <div className="bg-card border rounded-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-muted"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                <div className="h-8 bg-muted rounded animate-pulse"></div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-card border rounded-lg overflow-hidden animate-pulse">
                      <div className="h-24 bg-muted"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Hero />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Featured Events */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Most Popular</h2>
              
              <div className="space-y-4">
                {sidebarFeaturedEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleOpenModal(event)}>
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {event.images && event.images.length > 0 ? (
                        <img 
                          src={event.images[0]} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-primary/60" />
                        </div>
                      )}
                      {event.featured && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{event.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{event.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Featured Event */}
          <div className="lg:col-span-6">
            {mainEvent ? (
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleOpenModal(mainEvent)}>
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  {mainEvent.images && mainEvent.images.length > 0 ? (
                    <img 
                      src={mainEvent.images[0]} 
                      alt={mainEvent.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-primary/60" />
                    </div>
                  )}
                  {mainEvent.featured && (
                    <Badge className="absolute top-4 left-4 bg-yellow-500">
                      <Star className="w-4 h-4 mr-1" />
                      Featured Event
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{mainEvent.category}</Badge>
                    <Badge variant="secondary">{mainEvent.art_type}</Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{mainEvent.title}</h2>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{mainEvent.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(mainEvent.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {mainEvent.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {mainEvent.organizer.name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground">No Featured Events</h3>
                    <p className="text-sm text-muted-foreground">Check back soon for exciting events!</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Sidebar - Recent Events */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Recent Events</h2>
              
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleOpenModal(event)}>
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {event.images && event.images.length > 0 ? (
                        <img 
                          src={event.images[0]} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary/60" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{event.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{event.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
