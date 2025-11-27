import { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  userId?: Schema.Types.ObjectId;
  userName?: string;
  userEmail?: string;
  action: string;
  module: 'TOURS' | 'BOOKINGS' | 'USERS' | 'DESTINATIONS' | 'REVIEWS' | 'ENQUIRIES' | 'SETTINGS' | 'PAYMENTS' | 'ADMIN' | 'OTHER';
  entityType: string;
  entityId?: Schema.Types.ObjectId;
  entityName?: string;
  description?: string;
  changes?: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  statusCode?: number;
  ipAddress?: string;
  userAgent?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint?: string;
  requestBody?: Record<string, any>;
  responseBody?: Record<string, any>;
  errorMessage?: string;
  duration?: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tags?: string[];
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    userName: String,
    userEmail: {
      type: String,
      lowercase: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    module: {
      type: String,
      enum: ['TOURS', 'BOOKINGS', 'USERS', 'DESTINATIONS', 'REVIEWS', 'ENQUIRIES', 'SETTINGS', 'PAYMENTS', 'ADMIN', 'OTHER'],
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    entityName: String,
    description: String,
    changes: [
      {
        field: String,
        oldValue: Schema.Types.Mixed,
        newValue: Schema.Types.Mixed,
      },
    ],
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'PENDING'],
      default: 'PENDING',
      index: true,
    },
    statusCode: Number,
    ipAddress: {
      type: String,
      index: true,
    },
    userAgent: String,
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      index: true,
    },
    endpoint: String,
    requestBody: Schema.Types.Mixed,
    responseBody: Schema.Types.Mixed,
    errorMessage: String,
    duration: Number,
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW',
      index: true,
    },
    tags: [String],
  },
  { timestamps: true }
);

AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ module: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, status: 1 });
AuditLogSchema.index({ severity: 1, createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
export type { IAuditLog };
