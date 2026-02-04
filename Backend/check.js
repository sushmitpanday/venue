const mongoose = require('mongoose');
const uri = "mongodb+srv://app_user:N6UqxYuT0hpOtXTc@cluster0.w8j09ks.mongodb.net/venue-project?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
    .then(() => console.log("✅ SUCCESS: Connection ho gaya!"))
    .catch(err => console.log("❌ FAIL: " + err.message));