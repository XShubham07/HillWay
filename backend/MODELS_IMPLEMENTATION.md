# MongoDB Models Implementation Guide

## User Model

```typescript
// backend/models/User.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'CUSTOMER' | 'AGENT' | 'ADMIN' | 'STAFF';
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide valid email'],
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Phone must be 10 digits'],
    },
    role: {
      type: String,
      enum: ['CUSTOMER', 'AGENT', 'ADMIN', 'STAFF'],
      default: 'CUSTOMER',
    },
    avatar: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
```

## Tour Model

```typescript
// backend/models/Tour.ts
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

interface ITour {
  title: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  destination: mongoose.Types.ObjectId;
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

const tourSchema = new mongoose.Schema<ITour>(
  {
    title: {
      type: String,
      required: [true, 'Tour title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TourCategory',
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    minGroupSize: {
      type: Number,
      default: 1,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['EASY', 'MODERATE', 'HARD'],
      default: 'EASY',
    },
    highlights: [String],
    inclusions: [String],
    exclusions: [String],
    images: [
      {
        url: String,
        alt: String,
        order: Number,
      },
    ],
    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
        activities: [String],
      },
    ],
    amenities: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for search
tourSchema.index({ title: 'text', description: 'text' });

export const Tour = mongoose.model<ITour>('Tour', tourSchema);
```

## TourSession Model

```typescript
// backend/models/TourSession.ts
interface ITourSession {
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

const tourSessionSchema = new mongoose.Schema<ITourSession>(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
      index: true,
    },
    departureDate: {
      type: Date,
      required: true,
      index: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    available: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
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
```

## Booking Model

```typescript
// backend/models/Booking.ts
interface IPassenger {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
}

interface IBooking {
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
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    bookingRef: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tourSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TourSession',
      required: true,
      index: true,
    },
    passengers: [
      {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        age: { type: Number, required: true },
      },
    ],
    totalPassengers: {
      type: Number,
      required: true,
      min: 1,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
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
```

## Payment Model

```typescript
// backend/models/Payment.ts
interface IPayment {
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

const paymentSchema = new mongoose.Schema<IPayment>(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    method: {
      type: String,
      enum: ['CARD', 'UPI', 'BANK', 'WALLET'],
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['INITIATED', 'SUCCESS', 'FAILED'],
      default: 'INITIATED',
      index: true,
    },
    gateway: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
```

## Setup & Initialization

```typescript
// backend/lib/db.ts
import mongoose from 'mongoose';

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI!)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```

This implementation provides strong typing, validation, and proper indexing for production use.
