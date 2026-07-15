import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema({
    badge: { 
        ar: { type: String, default: '' },
        en: { type: String, default: '' }
    },
    title: { 
        ar: { type: String, default: '' },
        en: { type: String, default: '' }
    },
    subtitle: { 
        ar: { type: String, default: '' },
        en: { type: String, default: '' }
    },
    ctaText: { 
        ar: { type: String, default: '' },
        en: { type: String, default: '' }
    },
    circles: [{ src: String, alt: String }]
}, { timestamps: true });

export default mongoose.model('Hero', HeroSchema);
