import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  // If the customer is logged in, their ID; otherwise null (anonymous visitor)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },

  // Identifies anonymous visitors using a browser-based ID (from a cookie)
  visitorId: {
    type: String,
    required: true,
  },

  // Which page is being viewed
  page: {
    type: String,
    required: true,
  },

  // When this session started
  startTime: {
    type: Date,
    default: Date.now,
  },

  // The last time a "heartbeat" was received (customer is still on the page)
  lastActiveTime: {
    type: Date,
    default: Date.now,
  },

  // Total time (in seconds) spent on this page
  durationSeconds: {
    type: Number,
    default: 0,
  },

}, { timestamps: true });

const Visit = mongoose.models.visits || mongoose.model("visits", visitSchema);

export default Visit;