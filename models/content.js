const mongoose = require("mongoose");

var contentSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Content", contentSchema);