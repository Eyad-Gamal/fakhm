import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: { 
        ar: { type: String, required: true },
        en: { type: String, required: true }
    },
    category: { type: String, default: '' },
    badge: { 
        ar: { type: String, default: '' },
        en: { type: String, default: '' }
    },
    images: [{ src: String }],
    sizes: [{ size: String, price: Number }],
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
