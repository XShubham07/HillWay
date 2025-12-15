import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  // Type: enquiry or support
  type: {
    type: String,
    enum: ['enquiry', 'support'],
    default: 'enquiry'
  },
  // For enquiries
  destination: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  adventureType: {
    type: String,
    trim: true,
    default: ''
  },
  // For support
  bookingRef: {
    type: String,
    trim: true,
    default: ''
  },
  issueType: {
    type: String,
    trim: true,
    default: ''
  },
  // Common fields
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Contacted', 'Closed'],
    default: 'New'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);