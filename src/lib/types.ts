export const eventCategories = [
  'Music',
  'Art',
  'Food',
  'Sports',
  'Business',
  'Community',
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
};
