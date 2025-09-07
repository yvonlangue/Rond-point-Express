# 🚀 Deployment Guide for Rond Point Express

## Quick Deploy to Vercel

### 1. **Deploy Now (Easiest)**
```bash
npx vercel --prod
```

### 2. **Manual Steps**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your repository
5. Add environment variables (see below)
6. Deploy!

## 🔧 Required Environment Variables

Add these to your Vercel project settings:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## 📱 Demo Preparation

### Create Demo Data
1. **Sign up** for a regular user account
2. **Create 3-5 sample events** with different:
   - Art types (Music, Dance, Visual Arts, etc.)
   - Categories (Concert, Exhibition, Workshop, etc.)
   - Locations (Douala, Yaoundé, etc.)
   - Dates (past, present, future)

### Set Up Admin Account
1. **Sign up** for another account
2. **In Clerk Dashboard:**
   - Go to Users
   - Find your user
   - Add to Public Metadata: `{"role": "admin"}`
3. **Refresh the app** - "Admin" button should appear
4. **Approve the demo events** you created

## 🎯 Demo Script

### **1. Homepage (30 seconds)**
- Show event discovery feed
- Demonstrate filtering by art type
- Show featured events

### **2. Search & Filters (45 seconds)**
- Navigate to search page
- Show advanced filters (date range, location, accessibility)
- Demonstrate search functionality
- Show sorting options

### **3. Event Creation (60 seconds)**
- Sign in as organizer
- Create a new event
- Show image upload functionality
- Demonstrate form validation

### **4. Admin Panel (30 seconds)**
- Switch to admin account
- Show pending events
- Approve an event
- Show admin dashboard

### **5. User Profile (30 seconds)**
- Show user dashboard
- Display event statistics
- Show profile management

## 🔗 Sharing Options

### **Local Demo**
- **URL:** `http://192.168.1.176:9002`
- **Best for:** Same office/network colleagues
- **Pros:** Instant, no setup needed
- **Cons:** Only works on same WiFi

### **Vercel Deployment**
- **URL:** `https://your-app-name.vercel.app`
- **Best for:** Remote colleagues, stakeholders
- **Pros:** Accessible anywhere, professional URL
- **Cons:** Requires environment setup

### **Screen Sharing**
- Use Zoom/Teams screen share
- Show local development version
- **Best for:** Live walkthrough with Q&A

## 📊 Demo Data Suggestions

### **Sample Events to Create:**
1. **"Jazz Night at Douala Cultural Center"**
   - Type: Music, Category: Concert
   - Location: Douala, Date: Next Friday
   - Price: 5000 FCFA

2. **"Contemporary Art Exhibition"**
   - Type: Visual Arts, Category: Exhibition
   - Location: Yaoundé, Date: This weekend
   - Price: Free

3. **"Dance Workshop for Beginners"**
   - Type: Dance, Category: Workshop
   - Location: Limbe, Date: Next month
   - Price: 10000 FCFA

4. **"Poetry Reading Evening"**
   - Type: Literature, Category: Performance
   - Location: Bafoussam, Date: Next week
   - Price: 3000 FCFA

## 🎨 Presentation Tips

### **Before the Demo:**
- ✅ Test all features work
- ✅ Have demo data ready
- ✅ Know your environment variables
- ✅ Have backup plan (local vs deployed)

### **During the Demo:**
- 🎯 **Start with the problem** (finding art events in Cameroon)
- 🎯 **Show the solution** (your platform)
- 🎯 **Highlight key features** (discovery, creation, admin)
- 🎯 **End with impact** (connecting art community)

### **Technical Questions to Expect:**
- "How does authentication work?" → Clerk integration
- "Where is data stored?" → Supabase PostgreSQL
- "How do you handle payments?" → Mobile money APIs
- "What about scalability?" → Next.js + Vercel + Supabase

## 🚨 Troubleshooting

### **Common Issues:**
1. **"Events not showing"** → Check Supabase RLS policies
2. **"Can't sign in"** → Verify Clerk keys
3. **"Images not loading"** → Check Supabase storage setup
4. **"Admin button missing"** → Verify role in Clerk metadata

### **Quick Fixes:**
```bash
# Restart development server
npm run dev

# Check environment variables
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Verify Supabase connection
# Check browser console for errors
```

---

**Ready to impress your colleagues! 🎭✨**
