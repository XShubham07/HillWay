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
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

export const TourSession = mongoose.model<ITourSession>('TourSession', tourSessionSchema);
export type { ITourSession };
