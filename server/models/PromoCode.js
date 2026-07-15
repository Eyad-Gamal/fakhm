import mongoose from 'mongoose';

const PromoCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxUses: { type: Number, default: null }, 
    currentUses: { type: Number, default: 0 },
    expiresAt: { type: Date, default: null }, 
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('PromoCode', PromoCodeSchema);
