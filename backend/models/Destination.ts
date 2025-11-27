import { Document, Schema } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  country: string;
  state?: string;
  city: string;
  latitude: number;
  longitude: number;
  attractions: string[];
  bestTimeToVisit: {
    start: number;
    end: number;
    description: string;
  };
  images: string[];
  climate?: string;
  cuisine?: string;
  localLanguage?: string;
  currency?: string;
  travelTips?: string[];
  accommodation?: {
    type: string;
    priceRange: string;
    options: string[];
  };
  transportation?: {
    type: string;
    description: string;
    estimatedCost?: string;
  };
  visaRequirements?: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
}

const DestinationSchema = new Schema<IDestination>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    longDescription: String,
    country: {
      type: String,
      required: true,
      index: true,
    },
    state: String,
    city: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    attractions: [String],
    bestTimeToVisit: {
      start: Number,
      end: Number,
      description: String,
    },
    images: [String],
    climate: String,
    cuisine: String,
    localLanguage: String,
    currency: String,
    travelTips: [String],
    accommodation: {
      type: String,
      priceRange: String,
      options: [String],
    },
    transportation: {
      type: String,
      description: String,
      estimatedCost: String,
    },
    visaRequirements: String,
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
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
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

DestinationSchema.index({ country: 1, isActive: 1 });
DestinationSchema.index({ isFeatured: 1, rating: -1 });

export const Destination = mongoose.model<IDestination>('Destination', DestinationSchema);
export type { IDestination };
