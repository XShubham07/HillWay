import { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  tour: Schema.Types.ObjectId;
  booking: Schema.Types.ObjectId;
  customer: Schema.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  guideRating?: number;
  accommodationRating?: number;
  foodRating?: number;
  overallExperience: string;
  wouldRecommend: boolean;
  visitDate: Date;
  images?: string[];
  helpful?: number;
  unhelpful?: number;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const ReviewSchema = new Schema<IReview>(
  {
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
      index: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1000,
    },
    guideRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    accommodationRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    foodRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    overallExperience: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'POOR'],
      required: true,
    },
    wouldRecommend: {
      type: Boolean,
      default: true,
    },
    visitDate: {
      type: Date,
      required: true,
    },
    images: [String],
    helpful: {
      type: Number,
      default: 0,
    },
    unhelpful: {
      type: Number,
      default: 0,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
      index: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ tour: 1, rating: -1 });
ReviewSchema.index({ customer: 1, createdAt: -1 });
ReviewSchema.index({ tour: 1, isApproved: 1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
export type { IReview };
