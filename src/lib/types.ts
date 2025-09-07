// Defines the specific types of visual art that can be categorized.
export const artTypes = [
  'Painting',
  'Sculpture',
  'Photography',
  'Digital Art',
  'Installation',
  'Printmaking',
  'Video Art',
  'Textile Arts',
  'Ceramics',
  'Drawing',
  'Mixed Media',
  'Performance Art',
  'Architecture',
] as const;

export type ArtType = (typeof artTypes)[number];

export const eventCategories = [
  'Vernissage',
  'Solo Exhibition',
  'Group Exhibition',
  'Retrospective',
  'Art Fair',
  'Biennial / Triennial',
  'Open Studios',
  'Artist Talk',
  'Panel Discussion',
  'Workshop',
  'Art Auction',
  'Performance',
  'Screening',
  'Gallery Walk',
] as const;

export type EventCategory = (typeof eventCategories)[number];

// Base User Model
export type User = {
  id: string; // UUID
  email: string;
  name: string;
  role: 'visitor' | 'organizer';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};

// Organizer-specific details, extending the base User model.
export type OrganizerProfile = User & {
  role: 'organizer';
  bio?: string;
  website?: string; // URL
  contactEmail?: string;
  profileImage?: string; // URL
};

// Event Model
export type Event = {
  id: string; // UUID
  title: string;
  description: string;
  date: string; // ISO 8601
  location: string;
  art_type: ArtType; // Changed from artType to art_type
  category: EventCategory;
  images: string[]; // Array of image URLs
  organizer: {
    name: string;
    email: string;
    phone?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  price?: number;
  ticket_url?: string; // Changed from ticketUrl to ticket_url
  featured?: boolean; // Changed from isFeatured to featured
  created_by: string; // Changed from organizerId to created_by
  created_at: string; // Changed from createdAt to created_at
  updated_at: string; // Changed from updatedAt to updated_at
};

// Premium Subscription Model
export type PremiumSubscription = {
  id: string; // UUID
  organizerId: string; // Foreign key to User/OrganizerProfile
  status: 'active' | 'inactive' | 'cancelled';
  plan: 'monthly' | 'yearly';
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  createdAt: string; // ISO 8601
};

// Analytics Log Model
export type AnalyticsLog = {
  id: string; // UUID
  eventId: string; // Foreign key to Event
  type: 'view' | 'click';
  timestamp: string; // ISO 8601
  viewerId?: string; // Optional: Foreign key to User if logged in
};

// Minimal ad model
export type AdSponsorship = {
  id: string;
  sponsorName: string;
  imageUrl: string;
  targetUrl: string;
  placement: 'header' | 'sidebar' | 'footer';
  isActive: boolean;
};