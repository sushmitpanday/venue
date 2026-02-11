const express = require('express');
const app = express();
const authrouters = require('./Routes/auth.routes');
const venueRouters = require('./Routes/venue.routes');
const paymentRoutes = require('./Routes/payment.routes');
const CookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./database/db');
const Venue = require('./database/models/venue.model');

// Middleware
app.use(express.json());
app.use(CookieParser());
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// DB Connection Wrapper (Reusable)
const startConnection = async(req, res, next) => {
    await connectDB();
    next();
};

app.get("/", (req, res) => {
    res.send('API is running...');
});

// --- ROUTES REGISTRATION ---

// 1. Auth Routes (Ab isi ke andar Agent, Owner, aur Admin sab hain)
// Frontend path: /api/auth/agent/login etc.
app.use("/api/auth", startConnection, authrouters);

// 2. Venue Routes
app.use("/api/venue", startConnection, venueRouters);

// 3. Payment Routes
app.use("/api/payment", startConnection, paymentRoutes);

// Search API
app.get('/api/search', startConnection, async(req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(200).json([]);

        const searchRegex = { $regex: query.trim(), $options: 'i' };
        const results = await Venue.find({
            $or: [
                { "name": searchRegex },
                { "location.city": searchRegex },
                { "location.state": searchRegex }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Search failed", details: err.message });
    }
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`));
}