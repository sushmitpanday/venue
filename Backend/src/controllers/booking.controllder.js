// Backend Route: POST /api/venue/book
router.post("/book", async(req, res) => {
    try {
        const {
            venueId,
            bookingDate,
            amount,
            razorpay_payment_id,
            userEmail
        } = req.body;

        // 1. Pehle check karo ki is date par ye venue pehle se booked toh nahi hai
        const existingBooking = await Booking.findOne({ venueId, bookingDate });
        if (existingBooking) {
            return res.status(400).json({ message: "Bhai, ye date toh pehle hi booked hai!" });
        }

        // 2. New Booking create karo (Tera Schema jo bhi ho)
        const newBooking = new Booking({
            venueId,
            userEmail,
            date: bookingDate,
            paymentId: razorpay_payment_id,
            totalAmount: amount,
            status: "Confirmed"
        });

        await newBooking.save();
        res.status(201).json({ success: true, message: "Booking saved!" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});