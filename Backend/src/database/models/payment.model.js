const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    userEmail: { type: String },
    venueName: { type: String, required: true },
    amount: { type: Number, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // ₹1 ke liye yahan 1 aayega
    status: { type: String, default: "Success" }
}, { timestamps: true }); // Isse Atlas mein time bhi dikhega

// Dhyan de: Agar collection ka naam 'payments' rakha hai toh Mongoose apne aap 'Payment' ko 'payments' bana dega
module.exports = mongoose.model('Payment', paymentSchema);