const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim : true,
    },
    lastName: {
      type: String,
      required: true,
      trim : true,
    },
    age: {
      type: Number,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email Id is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Your password is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Wrong data type ");
        }
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "reporter"],
    },
    pressId: {
      type: String,
      unique: true,
      sparse : true,
      validate: {
        validator: function (value) {
          if (this.role === "reporter" && !value) {
            return false;
          }
          return true;
        },
        message: "Press ID is required for reporters",
      },
    },
    bio: {
      type: String,
      maxlength: 100,
      default: "This is the default about section",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add 2dsphere index for geospatial queries
UserSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", UserSchema);
module.exports = User;
