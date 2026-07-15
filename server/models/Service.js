import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    name: { 
        ar: { type: String, required: true },
        en: { type: String, required: true }
    },
    desc: { 
        ar: { type: String, required: true },
        en: { type: String, required: true }
    },
    icon: { type: String, default: 'fa-star' },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Service', ServiceSchema);
