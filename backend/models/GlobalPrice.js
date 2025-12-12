import mongoose from 'mongoose';

const GlobalPriceSchema = new mongoose.Schema({
  mealPrice: { type: Number, default: 500 },
  teaPrice: { type: Number, default: 60 },
  bonfirePrice: { type: Number, default: 500 },
  
  // NEW FIELDS
  tourGuidePrice: { type: Number, default: 1000 }, // Per Day
  comfortSeatPrice: { type: Number, default: 800 }, // Per Person
  
  personalCabPrice: { type: Number, default: 3200 },
  standardRoomPrice: { type: Number, default: 1500 },
  panoRoomPrice: { type: Number, default: 2500 },

  // GLOBAL NOTES (New)
  stayNote: { type: String, default: "" },
  foodNote: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.GlobalPrice || mongoose.model('GlobalPrice', GlobalPriceSchema);