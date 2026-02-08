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
    // YE ZAROORI HAI: Taaki pata chale ki ye 'user' hai ya 'owner'
    role: {
        type: String,
        enum: ['user', 'owner'],
        default: 'user'
    }
}, {
    timestamps: true
});

const usermodel = mongoose.model("user", userSchema);
module.exports = usermodel;