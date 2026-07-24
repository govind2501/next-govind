// import mongoose, { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a user name"],
    unique: true
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAdmin: {
    type: Boolean,
    default: false
  },

  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  VerifyToken: String,
  VerifyTokenExpiry: Date,

  // ---- Subscription fields (added for property posting paywall) ----
  subscription: {
    plan: {
      type: String,
      enum: ["none", "monthly", "yearly"],
      default: "none",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    propertyLimit: {
      type: Number,
      default: 0,
    },
    propertiesAddedCount: {
      type: Number,
      default: 0,
    },
  },
});

const user = mongoose.models.users || mongoose.model("users", userSchema)

export default user;