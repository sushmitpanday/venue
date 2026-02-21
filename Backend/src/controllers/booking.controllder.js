const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../database/models/booking.model');
const Payment = require('../database/models/payment.model');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const checkout = async(req, res) => {
    try {
        const options = {
            amount: Math.round(Number(req.body.amount) * 100),
            currency: "INR",
            receipt: `rcpt_${Date.now()}`
        };
        const order = await instance.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const verifyAndSave = async(req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, venueId, userEmail, date, amount } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");

        if (expectedSignature === razorpay_signature) {
            await Payment.create({ razorpay_order_id, razorpay_payment_id, razorpay_signature, userId: req.user.id, amount });
            const booking = await Booking.create({ venueId, userId: req.user.id, userEmail, date, orderId: razorpay_order_id, paymentId: razorpay_payment_id, totalAmount: amount });
            res.status(200).json({ success: true, message: "Booking Confirmed!", booking });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// YAHAN SE EXPORT HONA ZAROORI HAI
module.exports = { checkout, verifyAndSave };