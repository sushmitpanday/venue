const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../database/models/payment.model');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. Order banana
const checkout = async(req, res) => {
    try {
        const options = {
            amount: 100, // ₹1 (100 paise)
            currency: "INR",
            receipt: `order_${Date.now()}`
        };
        const order = await instance.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Atlas mein save karna
const verifyAndSave = async(req, res) => {
    console.log("🚀 SERVER: Verification shuru!");
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userEmail } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            const payment = await Payment.create({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                userEmail: userEmail || "test@example.com",
                amount: 1,
                userId: req.user ? req.user.id : "TEST_USER_ID"
            });

            console.log("✅ SUCCESS: Data Atlas mein chala gaya!");
            res.status(200).json({ success: true, message: "Atlas updated!" });
        } else {
            console.log("❌ ERROR: Signature mismatch!");
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (err) {
        console.log("❌ DB ERROR:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};

// 3. Sabhi payments laana (Admin ke liye)
const getAllPayments = async(req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.status(200).json(payments);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// --- YE SABSE ZAROORI HAI: EXPORT SAHI KARNA ---
module.exports = {
    checkout,
    verifyAndSave,
    getAllPayments
};