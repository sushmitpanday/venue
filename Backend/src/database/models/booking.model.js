const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true },
    date: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Confirmed', 'Cancelled', 'Refunded'], default: "Confirmed" }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);