const mongoose = require("mongoose")

const ArticleSchema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("Article", ArticleSchema)