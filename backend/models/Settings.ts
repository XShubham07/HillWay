import { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo?: string;
  favicon?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  currency: string;
  timezone: string;
  language: string;
  currencySymbol: string;
  taxPercentage: number;
  commissionPercentage: number;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  termsAndConditions?: string;
  privacyPolicy?: string;
  refundPolicy?: string;
  cancellationPolicy?: string;
  aboutUs?: string;
  seoTitle?: string;
  seoDescription?: string;
  googleAnalyticsId?: string;
  sendgridApiKey?: string;
  smtpConfig?: {
    host: string;
    port: number;
    username: string;
    password: string;
    fromEmail: string;
  };
  supportEmail: string;
  supportPhone: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  generalSettings?: Record<string, any>;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      required: true,
    },
    siteDescription: String,
    siteUrl: {
      type: String,
      required: true,
    },
    logo: String,
    favicon: String,
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: String,
    state: String,
    country: String,
    postalCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      youtube: String,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    language: {
      type: String,
      default: 'en',
    },
    currencySymbol: {
      type: String,
      default: '$',
    },
    taxPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    commissionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceMessage: String,
    termsAndConditions: String,
    privacyPolicy: String,
    refundPolicy: String,
    cancellationPolicy: String,
    aboutUs: String,
    seoTitle: String,
    seoDescription: String,
    googleAnalyticsId: String,
    sendgridApiKey: String,
    smtpConfig: {
      host: String,
      port: Number,
      username: String,
      password: String,
      fromEmail: String,
    },
    supportEmail: String,
    supportPhone: String,
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      ifscCode: String,
    },
    generalSettings: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);
export type { ISettings };
