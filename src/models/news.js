const mongoose = require("mongoose");
const validator = require("validator"); 

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Politics", "Sports", "Technology", "Health", "Entertainment"]
  },
  description: {
    type: [String],
    required: true,
    validate: {
      validator: function (value) {
        return value.some(para => typeof para === "string" && para.length > 50);
      },
      message: "At least one paragraph should be longer than 50 characters."
    }
  },
  image: {
    type: [String],
    required: true,
    validate: {
      validator: function (value) {
        return Array.isArray(value) && value.length > 0 &&
          value.some(photo => typeof photo === "string" && validator.isURL(photo));
      },
      message: "At least one valid image URL is required."
    }
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], 
      required: true
    }
  }
}, {
  timestamps: true
});

newsSchema.index({ location: "2dsphere" });

const News = mongoose.model("News", newsSchema);
module.exports = News;
