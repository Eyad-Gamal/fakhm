import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    whatsapp: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    footerText: { 
        ar: { type: String, default: '' },
        en: { type: String, default: '' }
    },
    copyrightText: { 
        ar: { type: String, default: '' },
        en: { type: String, default: '' }
    }
}, { timestamps: true });

export default mongoose.model('Settings', SettingsSchema);
