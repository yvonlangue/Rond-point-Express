# Rond-point Express 🎨

A comprehensive art event discovery and management platform for Cameroon's cultural scene. Built with Next.js 15, MongoDB, Firebase Auth, and mobile money integration.

## ✨ Features

### 🎯 Core Functionality
- **Event Discovery**: Browse art events with advanced filtering and search
- **Event Creation**: Create and manage events with approval workflow
- **User Management**: Freemium model with premium upgrades
- **Content Moderation**: Admin dashboard for event approval and user management
- **Mobile Money Integration**: MTN Mobile Money & Orange Money payments

### 👥 User Roles
- **Visitors**: Browse events without registration
- **Organizers**: Create events (3 free, unlimited with premium)
- **Premium Users**: Unlimited events, analytics, featured placement
- **Admins**: Content moderation, user management, analytics

### 🔧 Technical Stack
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: Firebase Auth with role-based access
- **Payments**: Mobile money APIs (MTN/Orange)
- **UI Components**: shadcn/ui with custom design system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Firebase project
- Git

### 1. Clone and Install
```bash
git clone <repository-url>
cd RONT-POINT-EXPRESS
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Frontend Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Backend Configuration
API_PORT=3001
FRONTEND_URL=http://localhost:9002
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/rond-point-express

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"
```

### 3. Database Setup
```bash
# Start MongoDB (if using local)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env.local
```

### 4. Run Development Servers
```bash
# Run both frontend and backend
npm run dev:full

# Or run separately
npm run dev          # Frontend (port 9002)
npm run dev:api      # Backend (port 3001)
```

### 5. Access the Application
- **Frontend**: http://localhost:9002
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

## 📁 Project Structure

```
src/
├── api/                    # Backend API
│   ├── config/            # Database configuration
│   ├── middleware/        # Auth and admin middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   └── server.ts          # Express server
├── app/                   # Next.js app router
│   ├── admin/             # Admin dashboard
│   ├── create-event/      # Event creation
│   ├── premium/           # Premium upgrade
│   ├── profile/           # User dashboard
│   └── search/            # Event search
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── ...                # Custom components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and types
└── ...
```

## 🔐 Authentication Setup

### 1. Firebase Project Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Google provider
3. Create a web app and copy configuration
4. Generate service account key for backend

### 2. Create Admin User
```javascript
// In Firebase Console > Authentication
// Add a user with email and password
// Then manually update their role in MongoDB:

db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 💳 Payment Integration

### Mobile Money Setup
The platform supports MTN Mobile Money and Orange Money:

```javascript
// Example payment flow
const payment = await fetch('/api/payments/initiate', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    amount: 25000,
    paymentMethod: 'mtn',
    phoneNumber: '+237612345678',
    description: 'Premium Subscription'
  })
});
```

## 🎨 Design System

### Colors
- **Primary**: Burnt Orange (#E47833)
- **Background**: Off-white (#FAFAFA)
- **Accent**: Deep Green (#4B5320)

### Fonts
- **Headlines**: Poppins (sans-serif)
- **Body**: PT Sans (sans-serif)

## 📊 API Endpoints

### Public Endpoints
- `GET /api/events` - Get public events
- `GET /api/events/featured` - Get featured events
- `GET /api/events/:id` - Get single event

### Authenticated Endpoints
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upgrade` - Upgrade to premium

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/events` - Get events for moderation
- `POST /api/admin/events/:id/approve` - Approve event
- `POST /api/admin/events/:id/reject` - Reject event
- `GET /api/admin/users` - Get users for management

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel with environment variables
```

### Backend (Railway/Render)
```bash
# Set environment variables
# Deploy Express server
```

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment
3. Configure network access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ for Cameroon's art community**
