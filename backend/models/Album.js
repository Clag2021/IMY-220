const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  hashtags: [{
    type: String,
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Album", albumSchema);