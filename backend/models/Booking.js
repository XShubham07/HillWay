import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  
  // Link to Tour
  tourTitle: String,
  tourId: { type: String }, // Stores ID for reliable redirect
  
  travelDate: Date,
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  rooms: { type: Number, default: 1 },
  roomType: { type: String, default: 'standard' },
  transport: { type: String, default: 'sharing' },
  addons: {
    bonfire: Boolean, meal: Boolean, tea: Boolean, comfortSeat: Boolean, tourGuide: Boolean
  },
  totalPrice: { type: Number, required: true },
  originalPrice: Number,
  couponCode: String,
  
  // PAYMENT & ADMIN FIELDS
  // UPDATED: Added 'Unpaid' to enum and set it as the default
  paymentType: { type: String, enum: ['Full', 'Partial', 'Unpaid'], default: 'Unpaid' },
  paidAmount: { type: Number, default: 0 },
  adminNotes: { type: String, default: '' },

  // NEW: HOTEL DETAILS SECTION
  hotelDetails: {
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    notes: { type: String, default: '' }
  },

  // AGENT TRACKING
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', default: null },
  commissionAmount: { type: Number, default: 0 },
  
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);