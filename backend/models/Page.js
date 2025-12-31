
import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: [true, 'Please provide a slug'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
    },
    metaTitle: {
        type: String,
        default: '',
    },
    metaDescription: {
        type: String,
        default: '',
    },
    metaKeywords: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    toursTitle: {
        type: String,
        default: '', // Heading for the tours section
    },
    toursNote: {
        type: String,
        default: '', // Note displayed below the tours
    },
    infoBoxes: [{
        title: String,
        subTitle: String,
        content: String, // String with potential bullet points
    }],
    faqs: [{
        question: String,
        answer: String,
    }],
    selectedTours: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export default mongoose.models.Page || mongoose.model('Page', PageSchema);
