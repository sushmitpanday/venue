const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

// 1. Error Handling for Razorpay Initialization
// Isse server crash nahi hoga agar keys missing hain
let razorpay;
try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        console.log("✅ Razorpay Initialized Successfully");
    } else {
        console.error("❌ Razorpay Keys missing in Environment Variables");
    }
} catch (error) {
    console.error("❌ Razorpay Init Error:", error.message);
}

// 2. Order Creation Route
router.post("/order", async(req, res) => {
    try {
        const { amount } = req.body;

        // Check if Razorpay is properly initialized
        if (!razorpay) {
            return res.status(500).json({
                success: false,
                message: "Razorpay is not configured on server"
            });
        }

        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        const options = {
            amount: Math.round(Number(amount) * 100), // Rupee to Paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });

    } catch (err) {
        console.error("Razorpay Order Error:", err);
        res.status(500).json({
            success: false,
            message: "Order creation failed",
            error: err.message
        });
    }
});

// Zaroori: Isse "TypeError: argument handler must be a function" fix hoga
module.exports = router;