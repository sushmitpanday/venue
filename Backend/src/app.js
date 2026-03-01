const express = require('express');
const compression = require('compression'); // Response size chhota karne ke liye
const helmet = require('helmet'); // Security aur performance headers ke liye
const path = require('path');
const CookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./database/db');
const Venue = require('./database/models/venue.model');

// Routes imports
const authrouters = require('./Routes/auth.routes');
const venueRouters = require('./Routes/venue.routes');
const paymentRoutes = require('./Routes/payment.routes');
const adminRoutes = require('./Routes/admin.routes');

const app = express();

// 1. FAST LOADING MIDDLEWARES
app.use(helmet()); // XSS attack rokta hai aur फालतू headers hatata hai
app.use(compression()); // JSON aur static files ko "zip" karke bhejta hai (2x faster)

// 2. DATABASE CONNECTION (Startup par hi connect karein)
connectDB();

// 3. BODY PARSING (Limit optimized)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(CookieParser());

// 4. STATIC FILES CACHING (Images baar-baar download nahi hongi)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: '7d', // 7 din tak browser image cache rakhega
    etag: true // Sirf tab download karega jab image change hogi
}));

// 5. CORS CONFIGURATION
app.use(cors({
    origin: ["https://rentmyvenue.com", "https://www.rentmyvenue.com", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// 6. ROUTES REGISTRATION (Middleware hataya kyunki DB connect ho chuka hai)
app.use("/api/auth", authrouters);
app.use("/api/venue", venueRouters);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
    res.send('API is running fast! 🚀');
});

// 7. SEARCH API (Performance Optimized)
app.get('/api/search', async(req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(200).json([]);

        const searchRegex = { $regex: query.trim(), $options: 'i' };

        // Sirf wahi fields mangwayein jo frontend par chahiye (.select)
        const results = await Venue.find({
                $or: [
                    { "name": searchRegex },
                    { "location.city": searchRegex },
                    { "location.state": searchRegex }
                ]
            })
            .select('name location price images capacity') // Extra fields skip karein
            .limit(12) // Memory bachane ke liye limit lagayein
            .lean(); // Mongoose object ko simple JSON banata hai (Very Fast)

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

// SERVER START
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server optimized & live on port ${PORT}`);
});

module.exports = app;