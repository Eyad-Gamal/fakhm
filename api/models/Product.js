const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    src: {
        type: String,
        required: true
    },  // Cloudinary URL or Base64 (backward compatible)
    publicId: {
        type: String,
        default: null
    },  // Cloudinary public ID (null for Base64)
    overlay: {
        text: { type: String, default: '' },
        bgColor: { type: String, default: '' },
        bgOpacity: { type: Number, default: 0 },
        textColor: { type: String, default: '' },
        fontSize: { type: Number, default: 14 },
        position: {
            type: String,
            enum: ['top', 'center', 'bottom'],
            default: 'center'
        }
    }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [1, 'Product name cannot be empty'],
        validate: {
            validator: function (v) {
                return v && v.trim().length > 0;
            },
            message: 'Product name is required and cannot be empty'
        }
    },
    category: {
        type: String,
        default: '',
        trim: true
    },
    badge: {
        type: String,
        default: '',
        enum: ['', 'فاخر', 'جديد', 'عرض خاص', 'الأكثر مبيعاً']
    },
    images: {
        type: [ImageSchema],
        default: []
    },
    sizes: [{
        size: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: [0, 'Price cannot be negative']
        }
    }],
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient sorting by order field
ProductSchema.index({ order: 1 });

// Additional index for category filtering
ProductSchema.index({ category: 1, order: 1 });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
