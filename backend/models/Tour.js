import mongoose from 'mongoose';

const TourSchema = new mongoose.Schema({
  // --- Basic Info ---
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  location: { type: String, required: true },
  description: String,
  
  // --- Stats ---
  basePrice: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  nights: { type: Number, default: 1 },
  featured: { type: Boolean, default: false },

  // --- Media ---
  img: { type: String, required: true },
  mapEmbedUrl: String,

  // --- Detailed Pricing Logic (For BookingSidebar) ---
  pricing: {
    mealPerPerson: { type: Number, default: 450 },
    teaPerPerson: { type: Number, default: 60 },
    room: {
      standard: { type: Number, default: 1500 },
      panoramic: { type: Number, default: 2500 },
    },
    personalCab: {
      rate: { type: Number, default: 3000 },
      capacity: { type: Number, default: 4 },
    },
    tourManagerFee: { type: Number, default: 5000 },
  },

  // --- Lists ---
  inclusions: { type: [String], default: [] },
  itinerary: [
    {
      day: Number,
      title: String,
      details: String,
    }
  ],
}, { timestamps: true });

export default mongoose.models.Tour || mongoose.model('Tour', TourSchema);