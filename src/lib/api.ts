// API Client utilities for Rond-point Express - Updated for Supabase
import { supabase } from './supabase'
import type { Event } from './types'

interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

interface EventsResponse {
  events: Event[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface EventResponse {
  event: Event
}

interface UserResponse {
  user: {
    id: string
    clerk_id: string
    name: string
    email: string
    role: string
    is_premium: boolean
    event_count: number
    bio?: string
    website?: string
    contact_email?: string
    phone_number?: string
    created_at: string
    updated_at: string
  }
}

interface UserStatsResponse {
  stats: {
    totalEvents: number
    approvedEvents: number
    pendingEvents: number
    rejectedEvents: number
    featuredEvents: number
    totalViews: number
  }
}

class SupabaseApiClient {
  private async request<T>(
    operation: () => Promise<any>
  ): Promise<ApiResponse<T>> {
    try {
      const result = await operation()
      
      if (result.error) {
        return {
          error: result.error.message || 'Request failed',
          message: result.error.message,
        }
      }

      return { data: result.data }
    } catch (error) {
      console.error('Supabase request failed:', error)
      return {
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  // Events API
  async getEvents(params: {
    search?: string
    artType?: string
    category?: string
    location?: string
    dateFrom?: string
    dateTo?: string
    price?: 'free' | 'paid'
    featured?: boolean
    page?: number
    limit?: number
  } = {}): Promise<ApiResponse<EventsResponse>> {
    return this.request<EventsResponse>(async () => {
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'approved') // Only show approved events

      // Apply filters
      if (params.search) {
        query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
      }
      if (params.artType) {
        query = query.eq('art_type', params.artType)
      }
      if (params.category) {
        query = query.eq('category', params.category)
      }
      if (params.location) {
        query = query.ilike('location', `%${params.location}%`)
      }
      if (params.price === 'free') {
        query = query.eq('price', 0)
      } else if (params.price === 'paid') {
        query = query.gt('price', 0)
      }
      if (params.featured) {
        query = query.eq('featured', true)
      }
      
      // Date range filters
      if (params.dateFrom) {
        console.log('Applying dateFrom filter:', params.dateFrom);
        query = query.gte('date', params.dateFrom)
      }
      if (params.dateTo) {
        console.log('Applying dateTo filter:', params.dateTo);
        query = query.lte('date', params.dateTo)
      }

      // Pagination
      const page = params.page || 1
      const limit = params.limit || 20
      const from = (page - 1) * limit
      const to = from + limit - 1

      query = query.range(from, to).order('date', { ascending: true })

      const { data, error, count } = await query

      return {
        data: {
          events: data || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            pages: Math.ceil((count || 0) / limit),
          },
        },
        error,
      }
    })
  }

  async getFeaturedEvents(): Promise<ApiResponse<EventsResponse>> {
    return this.request<EventsResponse>(async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved') // Only show approved events
        .eq('featured', true)
        .order('date', { ascending: true })
        .limit(10)

      return {
        data: {
          events: data || [],
          pagination: {
            page: 1,
            limit: 10,
            total: data?.length || 0,
            pages: 1,
          },
        },
        error,
      }
    })
  }

  async getEvent(id: string): Promise<ApiResponse<EventResponse>> {
    return this.request<EventResponse>(async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      return {
        data: { event: data },
        error,
      }
    })
  }

  async createEvent(eventData: Partial<Event>, clerkId: string): Promise<ApiResponse<EventResponse>> {
    return this.request<EventResponse>(async () => {
      // First get user ID from clerk_id
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single()

      if (!user) {
        return { error: { message: 'User not found' } }
      }

      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          created_by: user.id
        }])
        .select()
        .single()

      return {
        data: { event: data },
        error,
      }
    })
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<ApiResponse<EventResponse>> {
    return this.request<EventResponse>(async () => {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single()

      return {
        data: { event: data },
        error,
      }
    })
  }

  async deleteEvent(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(async () => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      return {
        data: { message: 'Event deleted successfully' },
        error,
      }
    })
  }

  // Users API
  async getUserProfile(clerkId: string): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>(async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', clerkId)
        .single()

      return {
        data: { user: data },
        error,
      }
    })
  }

  async createUser(userData: {
    clerk_id: string
    name: string
    email: string
    role?: string
  }): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>(async () => {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single()

      return {
        data: { user: data },
        error,
      }
    })
  }

  async getUserEvents(clerkId: string, params: {
    status?: string
    page?: number
    limit?: number
  } = {}): Promise<ApiResponse<EventsResponse>> {
    return this.request<EventsResponse>(async () => {
      // First get user ID
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single()

      if (!user) {
        return { error: { message: 'User not found' } }
      }

      let query = supabase
        .from('events')
        .select('*')
        .eq('created_by', user.id)

      if (params.status) {
        query = query.eq('status', params.status)
      }

      const page = params.page || 1
      const limit = params.limit || 20
      const from = (page - 1) * limit
      const to = from + limit - 1

      query = query.range(from, to).order('created_at', { ascending: false })

      const { data, error, count } = await query

      return {
        data: {
          events: data || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            pages: Math.ceil((count || 0) / limit),
          },
        },
        error,
      }
    })
  }

  async getUserStats(clerkId: string): Promise<ApiResponse<UserStatsResponse>> {
    return this.request<UserStatsResponse>(async () => {
      // Get user ID
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single()

      if (!user) {
        return { error: { message: 'User not found' } }
      }

      // Get event counts
      const { data: events, error } = await supabase
        .from('events')
        .select('status, featured')
        .eq('created_by', user.id)

      if (error) {
        return { error }
      }

      const stats = {
        totalEvents: events?.length || 0,
        approvedEvents: events?.filter(e => e.status === 'approved').length || 0,
        pendingEvents: events?.filter(e => e.status === 'pending').length || 0,
        rejectedEvents: events?.filter(e => e.status === 'rejected').length || 0,
        featuredEvents: events?.filter(e => e.featured).length || 0,
        totalViews: 0, // This would need to be tracked separately
      }

      return {
        data: { stats },
        error: null,
      }
    })
  }

  // Admin function to approve events
  async approveEvent(eventId: string): Promise<ApiResponse<EventResponse>> {
    return this.request<EventResponse>(async () => {
      const { data, error } = await supabase
        .from('events')
        .update({ status: 'approved' })
        .eq('id', eventId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        data: { event: data },
        error,
      }
    })
  }

  // Admin function to get pending events
  async getPendingEvents(): Promise<ApiResponse<EventsResponse>> {
    return this.request<EventsResponse>(async () => {
      const { data, error, count } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return {
        data: {
          events: data || [],
          pagination: {
            page: 1,
            limit: data?.length || 0,
            total: count || 0,
            pages: 1,
          },
        },
        error,
      }
    })
  }
}

// Create singleton instance
export const apiClient = new SupabaseApiClient()

// Helper functions for common operations
export const eventsApi = {
  getAll: (params?: Parameters<typeof apiClient.getEvents>[0]) => apiClient.getEvents(params),
  getFeatured: () => apiClient.getFeaturedEvents(),
  getById: (id: string) => apiClient.getEvent(id),
  create: (eventData: Partial<Event>, clerkId: string) => apiClient.createEvent(eventData, clerkId),
  update: (id: string, eventData: Partial<Event>) => apiClient.updateEvent(id, eventData),
  delete: (id: string) => apiClient.deleteEvent(id),
  // Admin functions
  getPending: () => apiClient.getPendingEvents(),
  approve: (id: string) => apiClient.approveEvent(id),
}

export const usersApi = {
  getProfile: (clerkId: string) => apiClient.getUserProfile(clerkId),
  create: (userData: Parameters<typeof apiClient.createUser>[0]) => apiClient.createUser(userData),
  getEvents: (clerkId: string, params?: Parameters<typeof apiClient.getUserEvents>[1]) => 
    apiClient.getUserEvents(clerkId, params),
  getStats: (clerkId: string) => apiClient.getUserStats(clerkId),
}

export default apiClient
