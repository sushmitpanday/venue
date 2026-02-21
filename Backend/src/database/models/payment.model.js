const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },

    userId: { type: String, required: true },
    venueId: { type: String, required: true },
    userEmail: { type: String },

    amount: { type: Number, required: true }, // Amount in Rupees
    status: { type: String, default: "Success" },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);