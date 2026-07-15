import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: { 
        ar: { type: String, required: true },
        en: { type: String, required: true }
    },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Category', CategorySchema);
