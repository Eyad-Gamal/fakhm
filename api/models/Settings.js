const mongoose = require('mongoose');

const LogoSchema = new mongoose.Schema({
    src: {
        type: String,
        default: ''
    },      // Cloudinary URL or Base64 (backward compatible)
    publicId: {
        type: String,
        default: null
    }  // Cloudinary public ID (null for Base64)
}, { _id: false });

const SettingsSchema = new mongoose.Schema({
    whatsapp: {
        type: String,
        default: '',
        validate: {
            validator: function (v) {
                // Allow empty string or valid WhatsApp number (digits only)
                return !v || /^\d+$/.test(v);
            },
            message: 'WhatsApp number must contain only digits'
        }
    },
    instagram: {
        type: String,
        default: '',
        validate: {
            validator: function (v) {
                // Allow empty string or valid Instagram URL
                return !v || /^https?:\/\/(www\.)?instagram\.com\/.+/.test(v);
            },
            message: 'Invalid Instagram URL format. Must be https://instagram.com/...'
        }
    },
    facebook: {
        type: String,
        default: '',
        validate: {
            validator: function (v) {
                // Allow empty string or valid Facebook URL
                return !v || /^https?:\/\/(www\.)?facebook\.com\/.+/.test(v);
            },
            message: 'Invalid Facebook URL format. Must be https://facebook.com/...'
        }
    },
    footerText: {
        type: String,
        default: ''
    },
    copyrightText: {
        type: String,
        default: '© 2025 فخم - جميع الحقوق محفوظة'
    },
    premiumThreshold: {
        type: Number,
        default: 700,
        min: [0, 'Premium threshold cannot be negative']
    },
    logo: {
        type: LogoSchema,
        default: () => ({ src: '', publicId: null })
    }
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', SettingsSchema);

module.exports = Settings;
