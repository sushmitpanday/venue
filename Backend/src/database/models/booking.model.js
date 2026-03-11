const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    venueName: { type: String, required: true }, // Venue ka naam direct store karein
    userEmail: { type: String, required: true },

    // Dates & Times
    bookingDate: { type: String, required: true }, // Jis din ka event hai
    bookingTime: { type: String },
    eventDate: { type: String }, // Event ka time (e.g. 10:00 AM)
    transactionDate: { type: String }, // Paisa kab kata
    transactionTime: { type: String }, // Paisa kis waqt kata

    // Payment Details
    orderId: { type: String, required: true }, // Razorpay Order ID
    paymentId: { type: String, required: true }, // Razorpay Payment ID (Unique Transaction ID)
    paymentMode: { type: String, default: "Online/Razorpay" },
    totalAmount: { type: Number, required: true },

    status: { type: String, enum: ['Confirmed', 'Cancelled', 'Refunded'], default: "Confirmed" }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);