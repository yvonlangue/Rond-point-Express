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
  artType: ArtType;
  category: EventCategory;
  images: string[]; // Array of image URLs
  organizerId: string; // Foreign key to User/OrganizerProfile
  organizer: string; // Denormalized organizer name for display
  isFeatured?: boolean; // For premium organizers
  price?: number;
  ticketUrl?: string; // Optional for integrated ticketing
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
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