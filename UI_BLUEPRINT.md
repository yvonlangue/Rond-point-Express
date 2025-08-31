# Rond-point Express UI Blueprint for v0 AI

## 🎨 Design System Overview

**Project**: Rond-point Express - Art Event Discovery Platform for Cameroon
**Design Philosophy**: Cultural richness meets modern accessibility
**Target Users**: Art organizers, event attendees, cultural enthusiasts

## 🎯 Brand Identity

### Colors
```css
/* Primary Colors */
--primary: #E47833;          /* Burnt Orange - Cultural richness */
--primary-foreground: #FFFFFF;
--primary-hover: #D4692A;

/* Background Colors */
--background: #FAFAFA;        /* Off-white - Content prominence */
--card: #FFFFFF;
--card-foreground: #1A1A1A;

/* Accent Colors */
--accent: #4B5320;           /* Deep Green - Interactive elements */
--accent-foreground: #FFFFFF;
--accent-hover: #3A4219;

/* Neutral Colors */
--muted: #F5F5F5;
--muted-foreground: #6B7280;
--border: #E5E7EB;
--input: #FFFFFF;
--ring: #E47833;

/* Status Colors */
--destructive: #EF4444;
--destructive-foreground: #FFFFFF;
--success: #10B981;
--warning: #F59E0B;
--info: #3B82F6;
```

### Typography
```css
/* Font Families */
--font-poppins: 'Poppins', sans-serif;    /* Headlines, CTAs */
--font-pt-sans: 'PT Sans', sans-serif;    /* Body text, descriptions */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### Spacing & Layout
```css
/* Spacing Scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */

/* Border Radius */
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;
```

## 🧩 Component Library

### 1. Navigation Components

#### Header
```typescript
interface HeaderProps {
  user?: User;
  onSignIn: () => void;
  onSignOut: () => void;
}

// Layout: Fixed top, full width, height 64px
// Background: --background with border-bottom
// Logo: CircleDot icon + "Rond-point Express" text
// Navigation: Events, Search links
// Actions: Sign In/Out, Create Event, Admin (if admin)
```

#### Navigation Menu
```typescript
interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string;
}

// Style: Horizontal flex, gap 32px
// Hover: Background color change, smooth transition
// Active: Primary color underline
// Mobile: Hamburger menu with slide-out drawer
```

### 2. Hero Section

#### Main Hero
```typescript
interface HeroProps {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  onSearch: (query: string) => void;
}

// Layout: Centered, padding 96px top/bottom
// Title: Poppins Bold, 48px-72px, primary color
// Subtitle: PT Sans, 18px-24px, muted color
// Search: Large input with search icon, prominent CTA
// Background: Gradient or subtle pattern
```

### 3. Event Components

#### Event Card
```typescript
interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    organizer: string;
    price: number;
    isFeatured: boolean;
    category: string;
  };
  onClick: () => void;
}

// Layout: Card with rounded corners, shadow
// Image: 16:9 aspect ratio, object-cover
// Content: Title, date, location, organizer
// Badges: Featured, Price, Category
// Hover: Scale transform, shadow increase
// Actions: Quick view, favorite, share
```

#### Event Grid
```typescript
interface EventGridProps {
  events: Event[];
  loading?: boolean;
  emptyMessage?: string;
}

// Layout: CSS Grid, responsive columns
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3-4 columns
// Gap: 24px between cards
// Loading: Skeleton cards with shimmer
```

### 4. Form Components

#### Search Input
```typescript
interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  suggestions?: string[];
}

// Style: Large input with search icon
// Border: 2px, primary color on focus
// Icon: Left-aligned, 20px
// Button: Right-aligned, primary background
// Suggestions: Dropdown below input
```

#### Event Form
```typescript
interface EventFormProps {
  initialData?: Partial<Event>;
  onSubmit: (data: EventFormData) => void;
  loading?: boolean;
}

// Layout: Multi-step form or single page
// Fields: Title, description, date, location, images
// Validation: Real-time feedback
// Upload: Drag-and-drop image upload
// Preview: Live preview of event card
```

### 5. User Interface Components

#### User Profile
```typescript
interface UserProfileProps {
  user: User;
  stats: {
    eventsCreated: number;
    eventsAttended: number;
    premiumStatus: boolean;
  };
}

// Layout: Card with avatar, info, stats
// Avatar: Circular, 80px, fallback initials
// Stats: Grid of metric cards
// Actions: Edit profile, upgrade premium
// Badges: Premium, verified organizer
```

#### Admin Dashboard
```typescript
interface AdminDashboardProps {
  stats: {
    totalUsers: number;
    totalEvents: number;
    pendingEvents: number;
    premiumUsers: number;
  };
  recentEvents: Event[];
  recentUsers: User[];
}

// Layout: Grid of stat cards + data tables
// Stats: Large numbers with icons
// Tables: Sortable, paginated
// Actions: Approve/reject, edit, delete
// Filters: Date range, status, search
```

### 6. Modal & Dialog Components

#### Event Details Modal
```typescript
interface EventDetailsModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onRSVP?: () => void;
  onShare?: () => void;
}

// Layout: Centered modal, max-width 600px
// Image: Large hero image
// Content: Title, description, details
// Actions: RSVP, Share, Contact organizer
// Close: X button, click outside, ESC key
```

#### Confirmation Dialog
```typescript
interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'destructive' | 'warning' | 'info';
}

// Layout: Small centered dialog
// Icon: Warning, info, or question mark
// Actions: Primary and secondary buttons
// Focus: Trap focus, keyboard navigation
```

### 7. Status & Feedback Components

#### Loading States
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'muted';
}

// Animation: Smooth rotation
// Sizes: 16px, 24px, 32px
// Colors: Primary, white, muted
```

#### Toast Notifications
```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// Layout: Fixed bottom-right, slide in
// Colors: Green, red, yellow, blue
// Auto-dismiss: 5 seconds default
// Actions: Close button, pause on hover
```

## 📱 Responsive Design Patterns

### Breakpoints
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### Grid System
```css
/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Responsive Grid */
.grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

### Mobile Navigation
```typescript
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
}

// Layout: Slide-out drawer from left
// Overlay: Dark background, click to close
// Menu: Vertical stack of nav items
// Animation: Smooth slide transition
```

## 🎭 Animation & Interactions

### Transitions
```css
/* Standard Transitions */
--transition-fast: 150ms ease-in-out;
--transition-normal: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;

/* Hover Effects */
.hover-lift {
  transition: transform var(--transition-normal);
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* Focus States */
.focus-ring {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

### Micro-interactions
```typescript
// Button clicks: Scale down 0.95
// Form focus: Border color change
// Loading: Skeleton shimmer
// Success: Checkmark animation
// Error: Shake animation
```

## 🌍 Localization & Accessibility

### Language Support
```typescript
interface LocalizationConfig {
  languages: ['en', 'fr'];
  defaultLanguage: 'en';
  translations: {
    en: Record<string, string>;
    fr: Record<string, string>;
  };
}

// Language switcher in header
// RTL support for future languages
// Date/time formatting per locale
```

### Accessibility
```typescript
// ARIA labels for all interactive elements
// Keyboard navigation support
// Screen reader friendly
// High contrast mode support
// Focus indicators
// Alt text for all images
```

## 🎨 Visual Hierarchy

### Typography Scale
```css
/* Headings */
h1: 48px Poppins Bold
h2: 36px Poppins Bold
h3: 24px Poppins Semibold
h4: 20px Poppins Medium
h5: 18px Poppins Medium
h6: 16px Poppins Medium

/* Body Text */
p: 16px PT Sans Regular
small: 14px PT Sans Regular
caption: 12px PT Sans Regular
```

### Spacing Rhythm
```css
/* Vertical Rhythm */
section: margin-bottom 64px
card: padding 24px
button: padding 12px 24px
input: padding 12px 16px
```

## 🚀 Implementation Guidelines

### CSS Architecture
```css
/* Use CSS Custom Properties for theming */
/* BEM methodology for component classes */
/* Utility-first approach with Tailwind */
/* Mobile-first responsive design */
```

### Component Structure
```typescript
// Each component should:
// 1. Accept props for customization
// 2. Include proper TypeScript types
// 3. Support accessibility features
// 4. Be responsive by default
// 5. Include loading and error states
```

### Performance Considerations
```typescript
// Lazy load images and components
// Use React.memo for expensive components
// Optimize bundle size with code splitting
// Implement proper caching strategies
```

## 📋 Component Checklist

For each component, ensure:
- [ ] Responsive design
- [ ] Accessibility features
- [ ] Loading states
- [ ] Error handling
- [ ] TypeScript types
- [ ] Unit tests
- [ ] Storybook documentation
- [ ] Design system compliance

## 🎯 Design Principles

1. **Cultural Authenticity**: Reflect Cameroon's rich cultural heritage
2. **Accessibility First**: Ensure usability for all users
3. **Mobile Priority**: Optimize for mobile devices first
4. **Performance**: Fast loading and smooth interactions
5. **Scalability**: Design system that grows with the platform
6. **Consistency**: Unified visual language across all components

---

**This blueprint provides v0 AI with comprehensive design system specifications for implementing the Rond-point Express platform with cultural authenticity and modern UX principles.**
