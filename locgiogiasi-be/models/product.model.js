const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    compatibleModels: [{
        carModelId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        carModelName: {
            type: String,
            required: true,
            trim: true
        },
        years: [{
            type: String,
            required: true
        }]
    }],
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        width: {
            type: Number,
            default: 0
        },
        height: {
            type: Number,
            default: 0
        },
        alt: {
            type: String,
            default: ''
        }
    }],
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    specifications: {
        type: Map,
        of: String
    },
    tags: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index cho tìm kiếm
productSchema.index({ name: 'text', description: 'text', tags: 'text', code: 'text' });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ 'compatibleModels.carModelName': 1 });
productSchema.index({ 'compatibleModels.years': 1 });
productSchema.index({ 'compatibleModels.carModelId': 1 });

// Middleware update updatedAt
productSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Product', productSchema);
