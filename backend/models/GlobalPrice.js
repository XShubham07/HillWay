import mongoose from 'mongoose';

const GlobalPriceSchema = new mongoose.Schema({
  mealPrice: { type: Number, default: 500 },
  teaPrice: { type: Number, default: 60 },
  bonfirePrice: { type: Number, default: 500 },

  // NEW FIELDS
  tourGuidePrice: { type: Number, default: 1000 },
  comfortSeatPrice: { type: Number, default: 800 },

  personalCabPrice: { type: Number, default: 3200 },
  standardRoomPrice: { type: Number, default: 1500 },
  panoRoomPrice: { type: Number, default: 2500 },

  // GLOBAL NOTES
  stayNote: { type: String, default: "" },
  foodNote: { type: String, default: "" },
  transportNote: { type: String, default: "" },

  // --- CONTACT SETTINGS ---
  // Editable contact information used across the frontend
  contactPhone: { type: String, default: "+91 7004165004" },
  whatsappNumber: { type: String, default: "917004165004" }, // Without + for wa.me links
  instagramUrl: { type: String, default: "https://www.instagram.com/hillwaydotin/" },
  facebookUrl: { type: String, default: "" }, // Empty = hide in footer

  // --- DISCOUNT APPLICABLE ITEMS ---
  // Controls which items are included in coupon discount calculation
  discountApplicableItems: {
    basePrice: { type: Boolean, default: true },
    roomCharges: { type: Boolean, default: true },
    transport: { type: Boolean, default: true },
    meal: { type: Boolean, default: true },
    tea: { type: Boolean, default: true },
    bonfire: { type: Boolean, default: true },
    tourGuide: { type: Boolean, default: true },
    comfortSeat: { type: Boolean, default: true }
  },

  // --- STARTING POINTS ---
  // Configurable starting points for tour bookings
  startingPoints: {
    type: [{
      name: { type: String, required: true },
      isDefault: { type: Boolean, default: false },
      requiresContact: { type: Boolean, default: false } // If true, redirects to contact page
    }],
    default: [
      { name: "Siliguri", isDefault: true, requiresContact: false },
      { name: "Patna", isDefault: false, requiresContact: true }
    ]
  },

  // --- POPUP COUPON SETTINGS ---
  // Editable content for the promotional popup shown on website
  popupCoupon: {
    enabled: { type: Boolean, default: true },
    title: { type: String, default: "Start 2025 with Adventure!" },
    subtitle: { type: String, default: "Exclusive New Year discount on all tours" },
    discountText: { type: String, default: "25% OFF" },
    discountSubtext: { type: String, default: "All Premium Tours" },
    code: { type: String, default: "NEWYEAR25" },
    buttonText: { type: String, default: "CLAIM MY DISCOUNT" },
    validUntil: { type: String, default: "January 31, 2025" },
    badge: { type: String, default: "New Year 2025" }
  }
}, { timestamps: true });

export default mongoose.models.GlobalPrice || mongoose.model('GlobalPrice', GlobalPriceSchema);
