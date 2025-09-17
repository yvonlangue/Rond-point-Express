import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sydkddzxevhdqaunxeqa.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5ZGtkZHp4ZXZoZHFhdW54ZXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMDE4MTAsImV4cCI6MjA3Mjc3NzgxMH0._DxgLGW2I9l5MFeGw9CI5pqSLDEZO08J1BWzsEisvKE'

// Create Supabase client with Clerk-compatible settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable auto refresh since we're using Clerk
    autoRefreshToken: false,
    persistSession: false,
    // Don't detect session from URL
    detectSessionInUrl: false
  }
})

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          location: string
          art_type: string
          category: string
          images: string[]
          organizer: {
            name: string
            email: string
            phone?: string
          }
          status: 'pending' | 'approved' | 'rejected'
          price: number
          ticket_url?: string
          featured: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          location: string
          art_type: string
          category: string
          images?: string[]
          organizer: {
            name: string
            email: string
            phone?: string
          }
          status?: 'pending' | 'approved' | 'rejected'
          price?: number
          ticket_url?: string
          featured?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          location?: string
          art_type?: string
          category?: string
          images?: string[]
          organizer?: {
            name: string
            email: string
            phone?: string
          }
          status?: 'pending' | 'approved' | 'rejected'
          price?: number
          ticket_url?: string
          featured?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          clerk_id: string
          name: string
          email: string
          role: 'organizer' | 'admin'
          is_premium: boolean
          event_count: number
          bio?: string
          website?: string
          contact_email?: string
          phone_number?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          name: string
          email: string
          role?: 'organizer' | 'admin'
          is_premium?: boolean
          event_count?: number
          bio?: string
          website?: string
          contact_email?: string
          phone_number?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          name?: string
          email?: string
          role?: 'organizer' | 'admin'
          is_premium?: boolean
          event_count?: number
          bio?: string
          website?: string
          contact_email?: string
          phone_number?: string
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone?: string
          subject: string
          category: string
          message: string
          status: 'unread' | 'read' | 'replied'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string
          subject: string
          category: string
          message: string
          status?: 'unread' | 'read' | 'replied'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          subject?: string
          category?: string
          message?: string
          status?: 'unread' | 'read' | 'replied'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
