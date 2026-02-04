// Pehle ye tha: const app = require('./app');
// Ise badal kar ye karein (kyunki app.js shayad src ke andar hai):
const app = require('./src/app');

// Agar app.js 'src' folder ke andar hai, toh aise likhein:
// const app = require('./src/app'); 

const dbconnection = require('./src/database/db'); // Agar db.js aur server.js ek hi folder mein hain
const dotenv = require('dotenv');

dotenv.config();
dbconnection();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});