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
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    // --- Naye Fields Jo Aapne Register Form Mein Add Kiye Hain ---
    phone: {
        type: String,
        required: true,
        trim: true
    },
    occupation: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    govtIdType: {
        type: String,
        enum: ['Aadhar', 'PAN', 'VoterID', 'Driving'], // Sirf yehi options allow honge
        required: true
    },
    govtIdNumber: {
        type: String,
        required: true,
        trim: true
    },
    // Role logic
    role: {
        type: String,
        enum: ['user', 'owner', 'agent', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

const usermodel = mongoose.model("user", userSchema);
module.exports = usermodel;