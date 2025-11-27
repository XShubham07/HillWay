import mongoose from 'mongoose';

const TourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  location: { type: String, required: true },
  basePrice: { type: Number, required: true },
  nights: { type: Number, default: 1 },
  img: { type: String, required: true },
  description: String,
  inclusions: { type: [String], default: [] },
  itinerary: [{ day: String, title: String, details: String }],
  rating: { type: Number, default: 4.5 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Tour || mongoose.model('Tour', TourSchema);