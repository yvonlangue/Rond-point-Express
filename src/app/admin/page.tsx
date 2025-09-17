'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { eventsApi } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import type { Event } from '@/lib/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit,
  Trash2,
  Shield,
  BarChart3,
  MessageSquare,
  Star
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  pendingEvents: number;
  premiumUsers: number;
  newUsersThisMonth: number;
  newEventsThisMonth: number;
}

// Using Event type from lib/types instead of local interface

interface User {
  id: string;
  clerk_id: string;
  name: string;
  email: string;
  role: string;
  is_premium: boolean;
  event_count: number;
  created_at: string;
  updated_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

// Sortable Item Component
function SortableItem({ event, index, onUnfeature }: { event: Event; index: number; onUnfeature: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 border border-green-200 bg-green-50 rounded-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-green-100 rounded"
            >
              <div className="w-4 h-4 flex flex-col gap-1">
                <div className="w-full h-0.5 bg-green-600"></div>
                <div className="w-full h-0.5 bg-green-600"></div>
                <div className="w-full h-0.5 bg-green-600"></div>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-300">
              #{index + 1}
            </Badge>
            <Badge variant="outline" className="text-yellow-600">
              Featured
            </Badge>
          </div>
          <h5 className="font-semibold text-sm">{event.title}</h5>
          <p className="text-xs text-muted-foreground">
            {new Date(event.date).toLocaleDateString()} • {event.location}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUnfeature(event.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Star className="w-3 h-3 mr-1" />
          Unfeature
        </Button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user || user.publicMetadata?.role !== 'admin') {
      router.push('/');
      return;
    }

    if (user.publicMetadata?.role === 'admin') {
      fetchAdminData();
    }
  }, [user, isLoaded, router]);

  const fetchAdminData = async () => {
    try {
      setLoadingStats(true);
      
      // Fetch pending events from API
      const pendingResponse = await eventsApi.getPending();
      if (pendingResponse.data) {
        setPendingEvents(pendingResponse.data.events);
      }

      // Fetch approved events for admin view
      const approvedResponse = await eventsApi.getAll({ limit: 50 });
      if (approvedResponse.data) {
        setApprovedEvents(approvedResponse.data.events);
      }

      // Fetch contact messages
      const { data: messages, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error fetching contact messages:', messagesError);
      } else {
        setContactMessages(messages || []);
      }

      // Fetch real user statistics
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
      } else {
        setUsers(usersData || []);
      }

      // Fetch real event statistics
      const { data: allEventsData, error: eventsError } = await supabase
        .from('events')
        .select('*');

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
      }

      // Calculate statistics
      const totalUsers = usersData?.length || 0;
      const totalEvents = allEventsData?.length || 0;
      const pendingEventsCount = pendingResponse.data?.events.length || 0;
      const premiumUsers = usersData?.filter(user => user.is_premium).length || 0;

      // Calculate new users this month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newUsersThisMonth = usersData?.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
      }).length || 0;

      // Calculate new events this month
      const newEventsThisMonth = allEventsData?.filter(event => {
        const eventDate = new Date(event.created_at);
        return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
      }).length || 0;

      setStats({
        totalUsers,
        totalEvents,
        pendingEvents: pendingEventsCount,
        premiumUsers,
        newUsersThisMonth,
        newEventsThisMonth,
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: 'destructive',
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const approveEvent = async (eventId: string) => {
    try {
      const response = await eventsApi.approve(eventId);
      if (response.error) {
        throw new Error(response.error);
      }
      
      toast({
        title: 'Success',
        description: 'Event approved successfully',
      });
      
      // Refresh data immediately
      await fetchAdminData();
    } catch (error) {
      console.error('Error approving event:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve event',
        variant: 'destructive',
      });
    }
  };

  const rejectEvent = async (eventId: string) => {
    try {
      // Mock rejection - in real implementation, this would update Supabase
      console.log('Rejecting event:', eventId);
        fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };

  const updateMessageStatus = async (messageId: string, status: 'read' | 'replied') => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', messageId);

      if (error) {
        throw error;
      }

      // Update local state
      setContactMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        )
      );

      toast({
        title: 'Success',
        description: `Message marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating message status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update message status',
        variant: 'destructive',
      });
    }
  };

  const toggleFeaturedStatus = async (eventId: string, currentFeatured: boolean) => {
    try {
      // Check if we're trying to add a featured event and already have 3
      if (!currentFeatured) {
        const currentFeaturedCount = approvedEvents.filter(e => e.featured).length;
        if (currentFeaturedCount >= 3) {
          toast({
            title: 'Limit Reached',
            description: 'You can only feature up to 3 events at a time. Please unfeature an event first.',
            variant: 'destructive',
          });
          return;
        }
      }

      const { error } = await supabase
        .from('events')
        .update({ featured: !currentFeatured })
        .eq('id', eventId);

      if (error) {
        throw error;
      }

      // Update local state for approved events
      setApprovedEvents(prev => 
        prev.map(event => 
          event.id === eventId ? { ...event, featured: !currentFeatured } : event
        )
      );

      toast({
        title: 'Success',
        description: `Event ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update featured status',
        variant: 'destructive',
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const featuredEvents = approvedEvents.filter(e => e.featured);
      const oldIndex = featuredEvents.findIndex(e => e.id === active.id);
      const newIndex = featuredEvents.findIndex(e => e.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedEvents = arrayMove(featuredEvents, oldIndex, newIndex);
        
        // Update the order by updating the created_at timestamp to reflect the new order
        // This is a simple approach - in production you might want a dedicated order field
        try {
          for (let i = 0; i < reorderedEvents.length; i++) {
            const event = reorderedEvents[i];
            // We'll use a simple approach: update the event with a new timestamp
            // In a real app, you'd have a dedicated 'order' or 'priority' field
            await supabase
              .from('events')
              .update({ updated_at: new Date().toISOString() })
              .eq('id', event.id);
          }

          // Update local state
          setApprovedEvents(prev => {
            const nonFeatured = prev.filter(e => !e.featured);
            return [...reorderedEvents, ...nonFeatured];
          });

          toast({
            title: 'Success',
            description: 'Featured events reordered successfully',
          });
        } catch (error) {
          console.error('Error reordering events:', error);
          toast({
            title: 'Error',
            description: 'Failed to reorder events',
            variant: 'destructive',
          });
        }
      }
    }
  };

  if (!isLoaded || loadingStats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.publicMetadata?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Access denied. Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, events, and platform analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-medium">Admin Panel</span>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.newUsersThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.newEventsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Events</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingEvents}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.premiumUsers}</div>
              <p className="text-xs text-muted-foreground">
                Active subscriptions
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="moderation" className="space-y-6">
        <TabsList>
          <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
          <TabsTrigger value="approved">Approved Events</TabsTrigger>
          <TabsTrigger value="featured">Featured Events</TabsTrigger>
          <TabsTrigger value="messages">Contact Messages</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="moderation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Pending Events ({pendingEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No pending events to review
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Organizer: {event.organizer.name} • Date: {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.art_type} • {event.category} • {event.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => approveEvent(event.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectEvent(event.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Approved Events ({approvedEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {approvedEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No approved events yet
                </p>
              ) : (
                <div className="space-y-4">
                  {approvedEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Organizer: {event.organizer.name} • Date: {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.art_type} • {event.category} • {event.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-500">
                          Approved
                        </Badge>
                        {event.featured && (
                          <Badge variant="outline" className="text-yellow-600">
                            Featured
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant={(event.featured ?? false) ? "default" : "outline"}
                          onClick={() => toggleFeaturedStatus(event.id, event.featured ?? false)}
                          className="flex items-center gap-1"
                          disabled={!event.featured && approvedEvents.filter(e => e.featured).length >= 3}
                        >
                          <Star className="w-3 h-3" />
                          {(event.featured ?? false) ? 'Unfeature' : 'Feature'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Featured Events Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">How Featured Events Work:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• <strong>Main Featured:</strong> The first featured event appears in the center of the homepage</li>
                  <li>• <strong>Sidebar Featured:</strong> Up to 2 additional featured events appear in the &quot;Most Popular&quot; sidebar</li>
                  <li>• <strong>Drag to Reorder:</strong> Drag events up/down to change their priority order</li>
                  <li>• <strong>Limit:</strong> Maximum 3 featured events at a time</li>
                </ul>
              </div>
              
              {approvedEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No approved events available to feature
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Featured Events */}
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">
                        Currently Featured ({approvedEvents.filter(e => e.featured).length}/3)
                      </h4>
                      <div className="space-y-3">
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext
                            items={approvedEvents.filter(e => e.featured).map(e => e.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {approvedEvents.filter(event => event.featured).map((event, index) => (
                              <SortableItem
                                key={event.id}
                                event={event}
                                index={index}
                                onUnfeature={(id) => toggleFeaturedStatus(id, true)}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      </div>
                    </div>

                    {/* Available Events */}
                    <div>
                      <h4 className="font-semibold mb-3 text-blue-600">
                        Available to Feature ({approvedEvents.filter(e => !e.featured).length})
                        {approvedEvents.filter(e => e.featured).length >= 3 && (
                          <Badge variant="destructive" className="ml-2">
                            Limit Reached
                          </Badge>
                        )}
                      </h4>
                      <div className="space-y-3">
                        {approvedEvents.filter(event => !event.featured).map((event) => (
                          <div key={event.id} className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-semibold text-sm">{event.title}</h5>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(event.date).toLocaleDateString()} • {event.location}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleFeaturedStatus(event.id, event.featured ?? false)}
                                className="text-blue-600 hover:text-blue-700"
                                disabled={approvedEvents.filter(e => e.featured).length >= 3}
                              >
                                <Star className="w-3 h-3 mr-1" />
                                Feature
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Contact Messages ({contactMessages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contactMessages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No contact messages yet
                </p>
              ) : (
                <div className="space-y-4">
                  {contactMessages.map((message) => (
                    <div key={message.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold">{message.name}</h3>
                          <p className="text-sm text-muted-foreground">{message.email}</p>
                          {message.phone && (
                            <p className="text-sm text-muted-foreground">Phone: {message.phone}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={message.status === 'unread' ? 'destructive' : message.status === 'read' ? 'secondary' : 'default'}
                          >
                            {message.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <Badge variant="outline" className="text-xs">
                          {message.category}
                        </Badge>
                        <h4 className="font-medium mt-2">{message.subject}</h4>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{message.message}</p>
                      
                      <div className="flex items-center gap-2">
                        {message.status === 'unread' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateMessageStatus(message.id, 'read')}
                          >
                            Mark as Read
                          </Button>
                        )}
                        {message.status !== 'replied' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateMessageStatus(message.id, 'replied')}
                          >
                            Mark as Replied
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject}`)}
                        >
                          Reply via Email
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recent Users ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
                     <div className="space-y-4">
                       {users.map((user) => (
                         <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                           <div className="flex-1">
                             <h3 className="font-semibold">{user.name}</h3>
                             <p className="text-sm text-muted-foreground">{user.email}</p>
                             <p className="text-xs text-muted-foreground">
                               Joined: {new Date(user.created_at).toLocaleDateString()}
                             </p>
                           </div>
                           <div className="flex items-center gap-2">
                             <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                               {user.role}
                             </Badge>
                             {user.is_premium && (
                               <Badge variant="outline" className="text-primary">
                                 Premium
                               </Badge>
                             )}
                             <span className="text-sm text-muted-foreground">
                               {user.event_count} events
                             </span>
                           </div>
                         </div>
                       ))}
                     </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Platform Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics and insights will be available here.
                <br />
                Features include user growth, event performance, and revenue tracking.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
