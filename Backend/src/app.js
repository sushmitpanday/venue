const express = require('express');
const app = express();
const authrouters = require('./Routes/auth.routes');
const venueRouters = require('./Routes/venue.routes');
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

// --- 1. DB Connection Wrapper (Sabse Jaruri) ---
const startConnection = async() => {
    await connectDB();
};

app.get("/", (req, res) => {
    res.send('API is running...');
});

// --- 2. Routes mein DB connection ensure kar ---
app.use("/api/auth", async(req, res, next) => { await startConnection();
    next(); }, authrouters);
app.use("/api/venue", async(req, res, next) => { await startConnection();
    next(); }, venueRouters);

app.get('/api/search', async(req, res) => {
    try {
        await startConnection(); // Har request par connection check
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