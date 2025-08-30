export const eventCategories = [
  'Painting',
  'Sculpture',
  'Drawing',
  'Printmaking',
  'Photography',
  'Video Art',
  'Digital Art',
  'Installation Art',
  'Performance Art',
  'Architecture',
  'Ceramics',
  'Textile Arts',
  'Fashion',
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

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  location: string;
  category: EventCategory;
  imageUrl: string;
  organizer: string;
  price?: number;
};
