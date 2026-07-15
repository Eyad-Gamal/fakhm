const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [1, 'Category name cannot be empty'],
        unique: true,
        validate: {
            validator: function (v) {
                return v && v.trim().length > 0;
            },
            message: 'Category name is required and cannot be empty'
        }
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient sorting by order field
CategorySchema.index({ order: 1 });

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
