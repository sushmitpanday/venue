const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: { type: String },
    venueName: { type: String, required: true },
    amount: { type: Number, required: true },

    // --- Nayi Fields Jo Aapne Controller Mein Use Ki Hain ---
    bookingDate: { type: String },
    bookingTime: { type: String },
    eventDate: { type: String },
    transactionDate: { type: String },
    transactionTime: { type: String },
    paymentMode: { type: String, default: "Online" },

    status: { type: String, default: "Success" }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);