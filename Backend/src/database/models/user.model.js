const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Email hamesha small letters mein save hoga
        trim: true
    },
    // FIX: Capital 'P' ko badal kar small 'p' kar diya hai
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Isse createdAt aur updatedAt apne aap ban jayenge
});

const usermodel = mongoose.model("user", userSchema);

module.exports = usermodel;