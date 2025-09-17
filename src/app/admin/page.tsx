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
  MessageSquare
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
  _id: string;
  name: string;
  email: string;
  role: string;
  isPremium: boolean;
  eventCount: number;
  createdAt: string;
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

      // For now, use mock stats since we don't have comprehensive admin stats API
      // In production, you'd create admin-specific Supabase functions
      setStats({
        totalUsers: 150,
        totalEvents: 45,
        pendingEvents: pendingResponse.data?.events.length || 0,
        premiumUsers: 12,
        newUsersThisMonth: 8,
        newEventsThisMonth: 5,
      });

      // Mock users data for now
      setUsers([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'organizer',
          isPremium: true,
          eventCount: 5,
          createdAt: '2024-01-15',
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'organizer',
          isPremium: false,
          eventCount: 2,
          createdAt: '2024-01-20',
        },
      ]);

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
                      </div>
                    </div>
                  ))}
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
                  <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      {user.isPremium && (
                        <Badge variant="outline" className="text-primary">
                          Premium
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {user.eventCount} events
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
