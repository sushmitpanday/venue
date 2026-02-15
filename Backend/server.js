// 1. Sabse pehle dotenv load karo
require('dotenv').config();

// 2. Phir database connect karo
const dbconnection = require('./src/database/db');
dbconnection();

// 3. AB app ko require karo (Isse app ko saari keys mil jayengi)
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});