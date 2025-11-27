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
    description: {
      type: String,
      required: true,
    },
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
    duration: { type: Number, required: true },
    minGroupSize: { type: Number, default: 1 },
    maxGroupSize: { type: Number, required: true },
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
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

tourSchema.index({ title: 'text', description: 'text' });

export const Tour = mongoose.model<ITour>('Tour', tourSchema);
export type { ITour };
