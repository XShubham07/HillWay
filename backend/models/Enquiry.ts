import { Document, Schema } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  tour?: Schema.Types.ObjectId;
  destination?: Schema.Types.ObjectId;
  message: string;
  travelDate?: Date;
  numberOfTravelers?: number;
  budget?: number;
  source: 'WEBSITE' | 'EMAIL' | 'PHONE' | 'SOCIAL_MEDIA' | 'OTHER';
  status: 'NEW' | 'CONTACTED' | 'INTERESTED' | 'NOT_INTERESTED' | 'CONVERTED' | 'SPAM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  notes?: string;
  followUpDate?: Date;
  assignedTo?: Schema.Types.ObjectId;
  isFollowedUp: boolean;
  responses?: Array<{
    message: string;
    respondedAt: Date;
    respondedBy?: string;
  }>;
  convertedToBooking?: Schema.Types.ObjectId;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      index: true,
    },
    destination: {
      type: Schema.Types.ObjectId,
      ref: 'Destination',
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    travelDate: Date,
    numberOfTravelers: {
      type: Number,
      min: 1,
    },
    budget: Number,
    source: {
      type: String,
      enum: ['WEBSITE', 'EMAIL', 'PHONE', 'SOCIAL_MEDIA', 'OTHER'],
      default: 'WEBSITE',
      index: true,
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'INTERESTED', 'NOT_INTERESTED', 'CONVERTED', 'SPAM'],
      default: 'NEW',
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
      index: true,
    },
    notes: String,
    followUpDate: Date,
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    isFollowedUp: {
      type: Boolean,
      default: false,
      index: true,
    },
    responses: [
      {
        message: String,
        respondedAt: {
          type: Date,
          default: Date.now,
        },
        respondedBy: String,
      },
    ],
    convertedToBooking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
  },
  { timestamps: true }
);

EnquirySchema.index({ status: 1, createdAt: -1 });
EnquirySchema.index({ priority: 1, isFollowedUp: 1 });
EnquirySchema.index({ assignedTo: 1, status: 1 });

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
export type { IEnquiry };
