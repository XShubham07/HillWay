import mongoose from 'mongoose';

const GlobalPriceSchema = new mongoose.Schema({
  mealPrice: { type: Number, default: 500 },
  teaPrice: { type: Number, default: 60 },
  bonfirePrice: { type: Number, default: 500 },
  
  // Additional Service Costs
  tourGuidePrice: { type: Number, default: 1000 }, // Per Day
  comfortSeatPrice: { type: Number, default: 800 }, // Per Person
  
  // Travel & Stay Costs
  personalCabPrice: { type: Number, default: 3200 },
  standardRoomPrice: { type: Number, default: 1500 },
  panoRoomPrice: { type: Number, default: 2500 },

  // Global Notes (New Field)
  globalNotes: { type: String, default: '' }
}, { timestamps: true });

// Prevent model recompilation error in development
export default mongoose.models.GlobalPrice || mongoose.model('GlobalPrice', GlobalPriceSchema);