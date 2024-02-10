const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    nationality: {
        type: String,
        enum: ["India", "USA", "UK", "Canada", "Columbia", "Australia"],
        required: true,
    },

},
    { timestamps: true }
)

module.exports = mongoose.model("User", UserSchema)