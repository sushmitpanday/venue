const express = require('express');
const path = require('path');
const app = express();
const authrouters = require('./Routes/auth.routes');
const venueRouters = require('./Routes/venue.routes');
const CookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./database/db');

const Venue = require('./database/models/venue.model');

connectDB();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(CookieParser());

app.get("/", (req, res) => {
    res.send('API is running on Vercel...');
});

app.use("/api/auth", authrouters);
app.use("/api/venue", venueRouters);

// --- UPDATED SEARCH API (City, Tehsil, State Filter) ---
app.get('/api/search', async(req, res) => {
    try {
        // Query params se data nikalna
        const { city, state, tehsil, query } = req.query;

        // Agar kuch bhi nahi bheja toh empty array
        if (!city && !state && !tehsil && !query) {
            return res.status(200).json([]);
        }

        let conditions = [];

        // 1. Agar user ne 'query' bheja hai (Single search box ke liye)
        if (query) {
            const searchRegex = { $regex: query.trim(), $options: 'i' };
            conditions.push({ "location.city": searchRegex });
            conditions.push({ "location.tehsil": searchRegex });
            conditions.push({ "location.state": searchRegex });
            conditions.push({ "name": searchRegex }); // Hotel name bhi search hoga
        }

        // 2. Agar user ne alag-alag inputs (City, Tehsil, State) use kiye hain
        if (city) {
            conditions.push({ "location.city": { $regex: city.trim(), $options: 'i' } });
        }
        if (tehsil) {
            conditions.push({ "location.tehsil": { $regex: tehsil.trim(), $options: 'i' } });
        }
        if (state) {
            conditions.push({ "location.state": { $regex: state.trim(), $options: 'i' } });
        }

        // $or operator ka use karke search karna
        const finalQuery = conditions.length > 0 ? { $or: conditions } : {};

        const results = await Venue.find(finalQuery).sort({ createdAt: -1 });

        console.log(`Search hit: found ${results.length} results for: ${query || city || tehsil}`);
        res.status(200).json(results);

    } catch (err) {
        console.error("Search API Error:", err);
        res.status(500).json({ error: "Database search failed" });
    }
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
}