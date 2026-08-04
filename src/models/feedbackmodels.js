import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  // If the customer is logged in, their ID
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },

  visitorId: {
    type: String,
    required: true,
  },

  // Which page the feedback was given on
  page: {
    type: String,
    required: true,
  },

  // Quick reason selected by the customer (from a dropdown)
  reason: {
    type: String,
    enum: [
      "Could not understand the price",
      "Could not find the right property",
      "Website is slow",
      "Subscribing felt difficult",
      "Other",
    ],
    required: true,
  },

  // The customer's own written message (optional)
  message: {
    type: String,
    default: "",
  },

}, { timestamps: true });

const Feedback =
  mongoose.models.feedbacks || mongoose.model("feedbacks", feedbackSchema);

export default Feedback;