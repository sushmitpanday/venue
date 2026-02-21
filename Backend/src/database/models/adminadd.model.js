const mongoose = require('mongoose');

const adminAddSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    location: {
        address: String,
        city: String,
        state: String,
        pincode: String
    },
    images: [String],
    addedBy: { type: String, default: 'ADMIN' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminVenue', adminAddSchema);