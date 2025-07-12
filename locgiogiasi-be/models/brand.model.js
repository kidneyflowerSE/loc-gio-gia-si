const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    carModels: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        years: [{
            type: String,
            required: true
        }],
        isActive: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
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
brandSchema.index({ name: 'text' });
brandSchema.index({ isActive: 1 });
brandSchema.index({ 'carModels.name': 1 });
brandSchema.index({ 'carModels.isActive': 1 });

// Middleware update updatedAt
brandSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Brand', brandSchema);
