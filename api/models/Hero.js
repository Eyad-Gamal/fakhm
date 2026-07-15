const mongoose = require('mongoose');

const HeroImageSchema = new mongoose.Schema({
    src: {
        type: String,
        required: true
    },      // Cloudinary URL or Base64 (backward compatible)
    publicId: {
        type: String,
        default: null
    }  // Cloudinary public ID (null for Base64)
}, { _id: false });

const HeroSchema = new mongoose.Schema({
    circles: {
        type: [HeroImageSchema],
        default: []
    },
    title: {
        type: String,
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    badge: {
        type: String,
        default: ''
    },
    ctaText: {
        type: String,
        default: 'تصفح المجموعة'
    }
}, {
    timestamps: true
});

const Hero = mongoose.model('Hero', HeroSchema);

module.exports = Hero;
