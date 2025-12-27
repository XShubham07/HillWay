import mongoose from 'mongoose';

const PageSeoSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true }, // e.g., 'home', 'destinations'
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  keywords: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.PageSeo || mongoose.model('PageSeo', PageSeoSchema);