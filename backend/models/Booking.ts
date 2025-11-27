import { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  bookingRef: string;
  customer: Schema.Types.ObjectId;
  tourSession: Schema.Types.ObjectId;
  passengers: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passport?: string;
    nationality?: string;
    dateOfBirth: Date;
  }>;
  totalPrice: number;
  pricePerPerson: number;
  numberOfPassengers: number;
  specialRequests?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  bookingDate: Date;
  confirmation?: {
    confirmed: boolean;
    confirmedAt?: Date;
    confirmedBy?: string;
  };
  cancellation?: {
    reason?: string;
    cancelledAt?: Date;
    refundAmount?: number;
  };
}

const BookingSchema = new Schema<IBooking>(
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
        firstName: {
          type: String,
          required: true,
          maxlength: 50,
        },
        lastName: {
          type: String,
          required: true,
          maxlength: 50,
        },
        email: {
          type: String,
          required: true,
          lowercase: true,
        },
        phone: {
          type: String,
          required: true,
        },
        passport: String,
        nationality: String,
        dateOfBirth: {
          type: Date,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerPerson: {
      type: Number,
      required: true,
      min: 0,
    },
    numberOfPassengers: {
      type: Number,
      required: true,
      min: 1,
    },
    specialRequests: String,
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
      default: 'PENDING',
      index: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    confirmation: {
      confirmed: {
        type: Boolean,
        default: false,
      },
      confirmedAt: Date,
      confirmedBy: String,
    },
    cancellation: {
      reason: String,
      cancelledAt: Date,
      refundAmount: Number,
    },
  },
  { timestamps: true }
);

BookingSchema.index({ tourSession: 1, bookingDate: -1 });
BookingSchema.index({ customer: 1, bookingDate: -1 });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export type { IBooking };
