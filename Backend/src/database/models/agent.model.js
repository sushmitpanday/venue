const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const agentSchema = new mongoose.Schema({
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
    // --- Naye Fields Jo Aapne Maange Hain ---
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    occupation: {
        type: String,
        required: true,
        trim: true
    },
    govtIdType: {
        type: String,
        enum: ['Aadhar', 'PAN', 'VoterID', 'Driving'],
        required: true
    },
    govtIdNumber: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: 'agent'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Timestamps se createdAt/updatedAt automatically manage ho jayenge

// PASSWORD HASHING MIDDLEWARE
// PASSWORD HASHING MIDDLEWARE
agentSchema.pre('save', async function() { // Yahan se 'next' hata diya
    if (!this.isModified('password')) {
        return; // next() ki jagah return use karein
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error; // error throw karein, mongoose ise handle kar lega
    }
});

// LOGIN HELPER
agentSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Agent', agentSchema);