const mongoose = require('mongoose');

const ServiceImageSchema = new mongoose.Schema({
    src: {
        type: String,
        required: true
    },      // Cloudinary URL or Base64 (backward compatible)
    publicId: {
        type: String,
        default: null
    }  // Cloudinary public ID (null for Base64)
}, { _id: false });

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [1, 'Service name cannot be empty'],
        validate: {
            validator: function (v) {
                return v && v.trim().length > 0;
            },
            message: 'Service name is required and cannot be empty'
        }
    },
    desc: {
        type: String,
        required: true,
        trim: true,
        minlength: [1, 'Service description cannot be empty'],
        validate: {
            validator: function (v) {
                return v && v.trim().length > 0;
            },
            message: 'Service description is required and cannot be empty'
        }
    },
    icon: {
        type: String,
        default: ''
    },
    images: {
        type: [ServiceImageSchema],
        default: []
    },
    isCustom: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient sorting by order field
ServiceSchema.index({ order: 1 });

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;
