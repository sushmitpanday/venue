const express = require('express');
const app = express();
const authrouters = require('./Routes/auth.routes');
const venueRouters = require('./Routes/venue.routes');
const CookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./database/db');
const Venue = require('./database/models/venue.model');

connectDB();
app.use(express.json());
app.use(CookieParser());

// --- Sabse Simple CORS (No Error Guaranteed) ---
app.use(cors({
    origin: true, // Ye automatically aane wale request ke origin ko allow kar dega
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get("/", (req, res) => {
    res.send('API is running...');
});

app.use("/api/auth", authrouters);
app.use("/api/venue", venueRouters);

app.get('/api/search', async(req, res) => {
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
        res.status(500).json({ error: "Search failed" });
    }
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`));
}