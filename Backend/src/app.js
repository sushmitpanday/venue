const express = require('express');
const app = express();
const authrouters = require('./Routes/auth.routes');
const venueRouters = require('./Routes/venue.routes');
const CookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./database/db'); // Aapka DB connection file

// DB Connect karein
connectDB();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || true, // Local aur Vercel dono allow karein
    credentials: true
}));
app.use(CookieParser());

app.get("/", (req, res) => {
    res.send('API is running on Vercel...');
});

app.use("/api/auth", authrouters);
app.use("/api/venue", venueRouters);

// LOCAL TESTING KE LIYE (Ye line Vercel par ignore ho jayegi)
if (process.env.NODE_ENV !== 'production') {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// VERCEL KE LIYE
module.exports = app;