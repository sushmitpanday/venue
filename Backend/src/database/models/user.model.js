const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        required: true,
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const usermodel = mongoose.model("user", userSchema)

module.exports = usermodel