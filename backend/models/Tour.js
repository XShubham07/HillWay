import mongoose from 'mongoose';

const TourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  location: String,
  description: String,
  
  basePrice: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  nights: { type: Number, default: 3 },
  featured: { type: Boolean, default: false },

  img: { type: String, required: true },
  mapEmbedUrl: String,

  pricing: {
    mealPerPerson: { type: Number, default: 450 },
    teaPerPerson: { type: Number, default: 60 },
    bonfire: { type: Number, default: 500 },
    
    // NEW FIELDS
    tourGuide: { type: Number, default: 1000 },
    comfortSeat: { type: Number, default: 800 },

    room: {
      standard: { type: Number, default: 1500 },
      panoramic: { type: Number, default: 2500 },
    },
    personalCab: {
      rate: { type: Number, default: 3200 },
      capacity: { type: Number, default: 4 },
    },
    tourManagerFee: { type: Number, default: 5000 },
  },

  inclusions: { type: [String], default: [] },
  
  itinerary: [
    {
      day: Number,
      title: String,
      details: String,
      meals: { type: [String], default: [] }
    }
  ],
  
  faqs: [{ q: String, a: String }],
  reviews: [{ name: String, rating: Number, text: String, date: String }]

}, { timestamps: true });

export default mongoose.models.Tour || mongoose.model('Tour', TourSchema);