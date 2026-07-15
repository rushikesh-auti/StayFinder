const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema(
  {
    houseName: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
    },

    photo: String,

    photoId: String,

    description: String,

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Home", homeSchema);