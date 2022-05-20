const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    }, // Playlist, Video, Articles
    topics: [String], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("resources", schema);
