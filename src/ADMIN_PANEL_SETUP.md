# Admin Panel Setup Guide

## Overview

This guide covers the complete setup and structure for building a professional admin panel for HillWay Tours using React, Vite, and Tailwind CSS.

---

## Tech Stack

- **Framework**: React 19+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **State Management**: React Context + React Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Tables**: TanStack React Table
- **Authentication**: JWT (from backend)

---

## Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── Sidebar.tsx
│   │   ├─│ Navbar.tsx
│   │   ├── Tables/
│   │   │   ├── ToursTable.tsx
│   │   │   ├── BookingsTable.tsx
│   │   │   ├── CustomersTable.tsx
│   │   │   ├── PaymentsTable.tsx
│   │   │   └── BaseTable.tsx
│   │   ├── Forms/
│   │   │   ├── TourForm.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   ├── SessionForm.tsx
│   │   │   └── SettingsForm.tsx
│   │   ├── Charts/
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── BookingChart.tsx
│   │   │   ├── OccupancyChart.tsx
│   │   │   └── TopToursChart.tsx
│   │   ├── Modals/
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── TourDetailModal.tsx
│   │   │   └── RefundModal.tsx
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── common/
│   │   ├── Loading.tsx
│   │   ├── Error.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchFilter.tsx
│   │   └── DateRangePicker.tsx
├── pages/
│   ├── AdminDashboard.tsx
│   ├── ToursManagement.tsx
│   ├── BookingsManagement.tsx
│   ├── CustomersManagement.tsx
│   ├── Analytics.tsx
│   ├── FinanceReports.tsx
│   ├── Settings.tsx
│   ├── Login.tsx
│   └── NotFound.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useTours.ts
│   ├── useBookings.ts
│   ├── useAnalytics.ts
│   └── useLocalStorage.ts
├── services/
│   ├── api.ts (API client setup)
│   ├── tourService.ts
│   ├── bookingService.ts
│   ├── customerService.ts
│   ├── analyticsService.ts
│   ├── paymentService.ts
│   └── authService.ts
├── context/
│   ├── AuthContext.tsx
│   ├── UIContext.tsx (notifications, modals)
│   └── FilterContext.tsx
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   ├── validators.ts
│   └── formatters.ts
├── types/
│   ├── index.ts
│   ├── api.ts
│   └── models.ts
├── styles/
│   ├── globals.css
│   ├── admin.css
│   └── animations.css
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

## Key Features to Implement

### 1. Dashboard
```tsx
// Components:
- KPI Cards (Revenue, Bookings, Occupancy, Pending Payments)
- Revenue Trend Chart (Line Chart - Last 30 days)
- Booking Status Donut Chart
- Top 5 Tours Table
- Recent Bookings List
- Quick Action Buttons
```

### 2. Tours Management
```tsx
// Features:
- Sortable, Filterable Tours Table
- Search by title, destination, category
- Create New Tour (Modal/Page)
- Edit Tour Details
- Manage Tour Sessions (dates, pricing)
- Batch Upload Images
- Publish/Unpublish Toggle
- Delete with Confirmation
- Seasonal Pricing Adjustments
```

### 3. Bookings Management
```tsx
// Features:
- Advanced Booking Search
- Filter by: Date Range, Status, Tour, Payment Status
- View Booking Details (expand row)
- Edit Passenger Details
- Change Booking Dates
- Process Refunds
- Mark as Confirmed/Cancelled
- Generate Invoice PDF
- Send Email Reminders
```

### 4. Analytics & Reports
```tsx
// Dashboards:
- Revenue Analysis (by tour, time period, source)
- Booking Trends
- Customer Acquisition
- Cancellation Rates
- Agent Performance
- Export as PDF/CSV
```

### 5. Settings
```tsx
// Configurations:
- Site Settings (taxes, fees, currency)
- Email Templates
- Notification Rules
- Payment Gateway Settings
- User Management (admins, staff)
- API Keys
- Backup & Restore
```

---

## Authentication Flow

```tsx
// AuthContext manages:
- Login/Logout
- Token Storage (localStorage + secure httpOnly cookies)
- User Role/Permissions
- Auto-logout on token expiry
- Role-based page access

Protected Routes:
- Check token exists
- Verify user role
- Redirect unauthorized users
```

---

## API Integration

```tsx
// Axios instance with:
- Base URL configuration
- Automatic token injection
- Request/Response interceptors
- Error handling
- Request logging

// React Query Setup:
- Cache management
- Automatic retries
- Pagination support
- Real-time updates
```

---

## Installation & Setup

```bash
# Install dependencies
npm install

# Add UI components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card table dialog form input

# Install additional libraries
npm install react-query axios react-hook-form zod recharts tanstack-react-table

# Setup environment
echo 'VITE_API_URL=http://localhost:3000' > .env.local

# Run development
npm run dev
```

---

## Key UI Patterns

### Data Tables
- Sortable columns
- Multi-select rows
- Bulk actions
- Inline editing
- Row expansion for details

### Forms
- Client-side validation with Zod
- Visual error messages
- Loading states
- Auto-save drafts
- Unsaved changes warning

### Notifications
- Toast alerts (success, error, warning)
- Confirmation dialogs
- Loading skeletons
- Empty states
- Error boundaries

---

## Performance Optimization

- Code splitting by routes
- Image optimization
- Lazy loading components
- Virtual scrolling for large lists
- Query caching strategies
- Debounced search/filters

---

## Deployment

```bash
# Build for production
npm run build

# Preview build locally
npm run preview

# Deploy to Vercel
vercel deploy
```

This provides a complete, scalable admin panel for tour management.
