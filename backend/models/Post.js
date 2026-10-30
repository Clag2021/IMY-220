const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

    creator : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    img: String,
    caption: String,
    hashtags: [String],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    reports: [
        {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: { type: String, default: "Inappropriate content" },
        createdAt: { type: Date, default: Date.now },
        },
    ],

    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId,
                ref: "User"
        },
        username: String,
        text: String,
        createdAt: {
            type : Date,
            immutable : true,
            default : () => Date.now()
        }
    }],
    
    createdAt: {
        type : Date,
        immutable : true,
        default : () => Date.now()
    },
});

module.exports = mongoose.model("Post", postSchema);