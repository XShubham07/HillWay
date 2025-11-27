# HillWay Tours - Complete Full-Featured Implementation

## Phase 1: Quick Start Files to Create

Create these files in order. All are production-ready and copy-paste compatible.

### 1. backend/lib/db.ts - Database Connection

```typescript
import mongoose from 'mongoose';

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
```

### 2. backend/models/Tour.ts - Tour Model

```typescript
import mongoose, { Schema, Document } from 'mongoose';

interface IItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

interface IImage {
  url: string;
  alt: string;
  order: number;
}

interface ITour extends Document {
  title: string;
  slug: string;
  description: string;
  destination: mongoose.Types.ObjectId;
  category: string;
  price: number;
  duration: number;
  minGroupSize: number;
  maxGroupSize: number;
  difficulty: 'EASY' | 'MODERATE' | 'HARD';
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  images: IImage[];
  itinerary: IItinerary[];
  amenities: string[];
  createdBy: mongoose.Types.ObjectId;
  isPublished: boolean;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const tourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
      required: [true, 'Tour title is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: String,
    destination: {
      type: Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: Number,
    minGroupSize: { type: Number, default: 1 },
    maxGroupSize: Number,
    difficulty: {
      type: String,
      enum: ['EASY', 'MODERATE', 'HARD'],
      default: 'EASY',
    },
    highlights: [String],
    inclusions: [String],
    exclusions: [String],
    images: [{ url: String, alt: String, order: Number }],
    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
        activities: [String],
      },
    ],
    amenities: [String],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: false, index: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

tourSchema.index({ title: 'text', description: 'text' });

export const Tour = mongoose.model<ITour>('Tour', tourSchema);
export type { ITour };
```

### 3. backend/models/TourSession.ts

```typescript
import mongoose, { Schema, Document } from 'mongoose';

interface ITourSession extends Document {
  tour: mongoose.Types.ObjectId;
  departureDate: Date;
  returnDate: Date;
  capacity: number;
  available: number;
  price: number;
  seasonality: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'WAITLIST' | 'FULL' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const tourSessionSchema = new Schema<ITourSession>(
  {
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
      index: true,
    },
    departureDate: { type: Date, required: true, index: true },
    returnDate: { type: Date, required: true },
    capacity: { type: Number, required: true },
    available: { type: Number, required: true },
    price: { type: Number, required: true },
    seasonality: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['OPEN', 'WAITLIST', 'FULL', 'CANCELLED'],
      default: 'OPEN',
      index: true,
    },
  },
  { timestamps: true }
);

export const TourSession = mongoose.model<ITourSession>(
  'TourSession',
  tourSessionSchema
);
export type { ITourSession };
```

### 4. backend/models/Booking.ts

```typescript
import mongoose, { Schema, Document } from 'mongoose';

interface IPassenger {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
}

interface IBooking extends Document {
  bookingRef: string;
  customer: mongoose.Types.ObjectId;
  tourSession: mongoose.Types.ObjectId;
  passengers: IPassenger[];
  totalPassengers: number;
  basePrice: number;
  discount: number;
  tax: number;
  totalPrice: number;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  bookingStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingRef: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tourSession: {
      type: Schema.Types.ObjectId,
      ref: 'TourSession',
      required: true,
      index: true,
    },
    passengers: [
      {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        age: Number,
      },
    ],
    totalPassengers: { type: Number, required: true },
    basePrice: Number,
    discount: { type: Number, default: 0 },
    tax: Number,
    totalPrice: Number,
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    bookingStatus: {
      type: String,
      enum: ['CONFIRMED', 'PENDING', 'CANCELLED'],
      default: 'PENDING',
    },
    notes: String,
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export type { IBooking };
```

### 5. backend/models/Payment.ts

```typescript
import mongoose, { Schema, Document } from 'mongoose';

interface IPayment extends Document {
  booking: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  method: 'CARD' | 'UPI' | 'BANK' | 'WALLET';
  transactionId: string;
  status: 'INITIATED' | 'SUCCESS' | 'FAILED';
  gateway: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: {
      type: String,
      enum: ['CARD', 'UPI', 'BANK', 'WALLET'],
      required: true,
    },
    transactionId: { type: String, unique: true, required: true, index: true },
    status: {
      type: String,
      enum: ['INITIATED', 'SUCCESS', 'FAILED'],
      default: 'INITIATED',
      index: true,
    },
    gateway: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export type { IPayment };
```

## Installation Requirements

```bash
npm install mongoose bcryptjs jsonwebtoken dotenv cors express validator
npm install -D @types/node @types/express typescript
```

## Environment (.env.local)

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hillway
JWT_SECRET=your_super_secret_jwt_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_live_...
RAZORPAY_KEY_ID=rzp_...
RAZORPAY_KEY_SECRET=...
NODE_ENV=development
```

## Next Steps

1. Create all model files in `backend/models/`
2. Create `backend/lib/db.ts` for database connection
3. Create authentication service in `backend/services/`
4. Create API routes in `backend/app/api/`
5. Create admin React components
6. Integrate with frontend

See BACKEND_ARCHITECTURE.md for complete API structure.
