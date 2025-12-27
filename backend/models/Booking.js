import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  
  tourTitle: String,
  tourId: { type: String },
  
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
  
  // --- UPDATED PAYMENT SECTION ---
  paymentType: { type: String, enum: ['Full', 'Partial', 'Unpaid'], default: 'Unpaid' },
  
  // Total amount paid so far (Sum of history)
  paidAmount: { type: Number, default: 0 }, 
  
  // New: List of all partial payments
  paymentHistory: [{
    amount: Number,
    note: String,
    date: { type: Date, default: Date.now }
  }],

  // New: Special discount given by admin
  additionalDiscount: { type: Number, default: 0 },
  // -------------------------------

  adminNotes: { type: String, default: '' },

  hotelDetails: {
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    notes: { type: String, default: '' }
  },

  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', default: null },
  commissionAmount: { type: Number, default: 0 },
  
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);