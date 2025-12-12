# HillWay Tours - Backend Management System & Admin Panel

## Project Overview

HillWay is a comprehensive tour management platform built with:
- **Backend**: Next.js with TypeScript, MongoDB
- **Frontend**: React + Vite with Tailwind CSS
- **Admin Panel**: Dashboard for managing all tour operations

---

## 1. Architecture Overview

### Technology Stack

```
┌─────────────────────────────────────────────────┐
│          Admin Panel (React + Vite)             │
│     - Dashboard, Tours, Bookings, Reports       │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│    API Layer (Next.js REST/GraphQL)             │
│  - Authentication, Authorization (JWT)         │
│  - RBAC (Role-Based Access Control)             │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│    Business Logic Layer                         │
│  - Services, Repositories, Utilities            │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│    Database Layer (MongoDB + Mongoose)          │
│  - Schema Models, Indexes, Validation           │
└─────────────────────────────────────────────────┘
```

---

## 2. Database Schema

### Core Collections

#### **Users**
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  role: Enum['CUSTOMER', 'AGENT', 'ADMIN', 'STAFF'],
  avatar: String (URL),
  isActive: Boolean,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Tours**
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String (unique, indexed),
  description: String,
  category: ObjectId (ref: TourCategory),
  destination: ObjectId (ref: Destination),
  price: Number (base price),
  duration: Number (days),
  minGroupSize: Number,
  maxGroupSize: Number,
  difficulty: Enum['EASY', 'MODERATE', 'HARD'],
  highlights: [String],
  inclusions: [String],
  exclusions: [String],
  images: [{ url, alt, order }],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String]
  }],
  amenities: [String],
  createdBy: ObjectId (ref: User),
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### **TourSessions** (Date-wise departures)
```javascript
{
  _id: ObjectId,
  tour: ObjectId (ref: Tour),
  departureDate: Date,
  returnDate: Date,
  capacity: Number,
  available: Number,
  price: Number (can override tour price),
  seasoality: Enum['LOW', 'MEDIUM', 'HIGH'],
  status: Enum['OPEN', 'WAITLIST', 'FULL', 'CANCELLED'],
  createdAt: Date,
  updatedAt: Date
}
```

#### **Bookings**
```javascript
{
  _id: ObjectId,
  bookingRef: String (unique, e.g., HW-20251127-001),
  customer: ObjectId (ref: User),
  tourSession: ObjectId (ref: TourSession),
  passengers: [{
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    age: Number
  }],
  totalPassengers: Number,
  basePrice: Number,
  discount: Number,
  tax: Number,
  totalPrice: Number,
  paymentStatus: Enum['PENDING', 'COMPLETED', 'FAILED'],
  bookingStatus: Enum['CONFIRMED', 'PENDING', 'CANCELLED'],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Payments**
```javascript
{
  _id: ObjectId,
  booking: ObjectId (ref: Booking),
  amount: Number,
  currency: String,
  method: Enum['CARD', 'UPI', 'BANK', 'WALLET'],
  transactionId: String (from payment gateway),
  status: Enum['INITIATED', 'SUCCESS', 'FAILED'],
  gateway: String ('STRIPE', 'RAZORPAY', etc),
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Destinations**
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  description: String,
  country: String,
  state: String,
  coordinates: { lat, lng },
  image: String,
  createdAt: Date
}
```

---

## 3. API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Tours (Public)
```
GET    /api/tours
GET    /api/tours/:id
GET    /api/tours/search?q=...
GET    /api/tours/:id/availability
```

### Tours (Admin Only)
```
POST   /api/admin/tours
PUT    /api/admin/tours/:id
DELETE /api/admin/tours/:id
POST   /api/admin/tours/:id/sessions
PUT    /api/admin/tours/:id/sessions/:sessionId
```

### Bookings
```
GET    /api/bookings (user's bookings)
POST   /api/bookings
PUT    /api/bookings/:id/cancel
GET    /api/bookings/:id/invoice
```

### Bookings (Admin)
```
GET    /api/admin/bookings
PUT    /api/admin/bookings/:id
DELETE /api/admin/bookings/:id
PUT    /api/admin/bookings/:id/status
```

### Analytics (Admin)
```
GET    /api/admin/analytics/dashboard
GET    /api/admin/analytics/revenue?period=month
GET    /api/admin/analytics/bookings?period=month
GET    /api/admin/analytics/tours/performance
```

---

## 4. Admin Panel Features

### Dashboard
- KPIs: Total bookings, revenue, occupancy rate
- Charts: Revenue trend, booking status distribution
- Recent bookings and upcoming departures
- Quick actions (create tour, create session)

### Tours Management
- List all tours with filters (published, category, difficulty)
- Create/edit tours with rich editor for description
- Manage tour sessions (add/edit dates and pricing)
- Upload images with drag-drop
- Set pricing rules and seasonal adjustments

### Bookings Management
- Search and filter bookings
- View booking details and passenger list
- Modify booking (date, passengers, price)
- Process refunds and cancellations
- Generate invoices

### Customer Management
- Customer list and profiles
- Trip history per customer
- Wishlist management
- Communication history

### Finance & Reports
- Transaction ledger
- Revenue reports by tour, period, destination
- Refund tracking
- Tax calculations
- Exportable reports (PDF, CSV)

### Settings
- Site configuration (taxes, fees)
- Email templates
- Notification rules
- Payment gateway settings
- User management

---

## 5. Backend Implementation

### Project Structure
```
backend/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── route.ts
│   │   │   └── [...nextauth]/route.ts
│   │   ├── tours/
│   │   │   ├── route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── [id]/sessions/route.ts
│   │   ├── bookings/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── admin/
│   │   │   ├── analytics/route.ts
│   │   │   ├── bookings/route.ts
│   │   │   └── tours/route.ts
│   │   └── payments/
│   │       ├── route.ts
│   │       └── webhook/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── db.ts (MongoDB connection)
│   ├── auth.ts (NextAuth setup)
│   └── utils.ts
├── models/
│   ├── User.ts
│   ├── Tour.ts
│   ├── TourSession.ts
│   ├── Booking.ts
│   ├── Payment.ts
│   └── Destination.ts
├── services/
│   ├── authService.ts
│   ├── tourService.ts
│   ├── bookingService.ts
│   ├── paymentService.ts
│   └── analyticsService.ts
├── middleware/
│   ├── auth.ts
│   ├── rbac.ts
│   └── errorHandler.ts
├── types/
│   ├── index.ts
│   ├── models.ts
│   └── api.ts
└── .env.local
```

---

## 6. Security Implementation

### Authentication
- JWT tokens with 24hr expiry
- Refresh tokens stored securely
- Password hashing with bcrypt
- Two-factor authentication (optional)

### Authorization
- Role-based access control (RBAC)
- Resource ownership validation
- Admin-only routes protection

### Data Protection
- HTTPS only
- CORS properly configured
- Input validation & sanitization
- SQL/NoSQL injection prevention
- Rate limiting on APIs
- CSRF protection

---

## 7. Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Stripe/Razorpay account for payments

### Installation

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment variables** (.env.local)
   ```
   MONGODB_URI=mongodb+srv://...
   NEXTAUTH_SECRET=your_secret
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=...
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## 8. Admin Panel Frontend (React)

### Key Pages
- `/admin/dashboard` - Overview and KPIs
- `/admin/tours` - Tour management
- `/admin/bookings` - Booking management
- `/admin/customers` - Customer management
- `/admin/analytics` - Reports and analytics
- `/admin/settings` - Configuration

### Tech Stack
- React 19+
- Vite
- Tailwind CSS
- Shadcn/UI components
- Recharts for data visualization
- React Query for API calls
- React Hook Form for forms

---

## 9. Key Features Roadmap

✅ **Phase 1 (MVP)**
- User authentication & registration
- Tour CRUD operations
- Basic booking system
- Payment integration
- Simple admin dashboard

🔄 **Phase 2**
- Advanced search & filters
- Review & rating system
- Wishlist functionality
- Email notifications
- SMS alerts

📋 **Phase 3**
- Multi-currency support
- Promotional codes & offers
- Group booking discounts
- Custom itineraries
- Guide/Staff management

🚀 **Phase 4**
- Mobile app (React Native)
- AI-powered recommendations
- Real-time availability sync
- Video integration
- Live chat support

---

## 10. Deployment

### Development
- Localhost on port 3000

### Staging
- Vercel/Railway deployment
- Staging MongoDB
- Test payment gateway

### Production
- Vercel for frontend
- Railway/AWS for backend
- Production MongoDB Atlas
- CDN for images (AWS S3/Cloudinary)
- Error tracking (Sentry)
- Analytics (Mixpanel/GA)

---

## 11. Monitoring & Maintenance

- Error tracking and logging
- Performance monitoring
- Database backup automation
- Security patching
- Regular code reviews
- Load testing before peak season

---

For detailed implementation, refer to specific module documentation.
