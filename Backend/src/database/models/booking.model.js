const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    userEmail: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    paymentId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Confirmed' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);