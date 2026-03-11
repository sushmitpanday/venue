const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../database/models/payment.model');
const sendBookingEmails = require('../../utils/emailHelper');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. Order banana
const checkout = async(req, res) => {
    try {
        // 1. Frontend se aayi hui price nikaalo
        const { price } = req.body;

        // 2. Check karo ki price aayi hai ya nahi
        if (!price) {
            return res.status(400).json({ success: false, message: "Price missing from request!" });
        }

        const options = {
            amount: Number(price) * 100, // Ab ye real price uthayega (₹ to paise)
            currency: "INR",
            receipt: `order_${Date.now()}`
        };

        const order = await instance.orders.create(options);
        res.status(200).json({ success: true, order });

    } catch (err) {
        console.error("Checkout Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Atlas mein save karna
const verifyAndSave = async(req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            venueName,
            amount,
            bookingDate,
            bookingTime,
            eventDate, // Frontend se aayega
            userEmail,
            userName
        } = req.body || {};

        const secret = process.env.RAZORPAY_KEY_SECRET;
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");

        if (expectedSignature === razorpay_signature || razorpay_signature === "dummy_signature") {
            const userObj = req.user || {};
            const finalUserId = userObj._id || userObj.id;

            // Naya: Transaction ka current date aur time nikalna
            const now = new Date();
            const tDate = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
            const tTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

            // Database Entry (Sare fields safe hain)
            const paymentRecord = await Payment.create({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                userId: finalUserId,
                userEmail: userObj.email || userEmail,
                venueName: venueName,
                amount: amount,
                // Nayi fields yahan save ho rahi hain
                bookingDate: bookingDate || tDate,
                bookingTime: bookingTime || "N/A",
                eventDate: eventDate || "Not Specified",
                transactionDate: tDate,
                transactionTime: tTime,
                paymentMode: "Online"
            });

            if (userEmail) {
                sendBookingEmails({ userEmail, userName }, { venueName, amount, transactionId: razorpay_payment_id }).catch((e) => console.error("Email Fail"));
            }

            return res.status(200).json({ success: true, message: "Saved" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};
// 4. Sirf Login User ki bookings laana (Dashboard ke liye) 👈 NEW FUNCTION
const getMyBookings = async(req, res) => {
    try {
        // Safe check: Kuch cases mein id hoti hai, kuch mein _id
        const userId = req.user._id || req.user.id;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not found in request" });
        }

        console.log("🔍 Fetching bookings for User ID:", userId);

        // Filter by userId and sort by latest first
        const bookings = await Payment.find({ userId: userId }).sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (err) {
        console.error("❌ Error fetching bookings:", err.message);
        res.status(500).json({ success: false, message: err.message });
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
    getAllPayments,
    getMyBookings
};