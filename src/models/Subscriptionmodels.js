import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  // Which user bought this subscription
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  // Subscription is tied to a specific State + District
  state: {
    type: String,
    required: [true, "Please select a state"],
  },
  district: {
    type: String,
    required: [true, "Please select a district"],
  },

  // Plan type: 1 Month, 3 Months, or 1 Year
  planType: {
    type: String,
    enum: ["Monthly", "Quarterly", "Yearly"],
    required: true,
  },

  // Price paid (fake for now, real payment gateway will use this later)
  amount: {
    type: Number,
    required: true,
  },

  // Subscription validity dates
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },

  // Status - useful for quick lookup and expiry handling
  status: {
    type: String,
    enum: ["Active", "Expired", "Cancelled"],
    default: "Active",
  },

  // Fake payment reference for now (will store real gateway transaction id later)
  paymentReference: {
    type: String,
    default: "DEMO_PAYMENT",
  },

  // Kitni properties is district me is subscription ke through add ki ja sakti hain

  propertyLimit: {
    type: Number,
    default: 0,
  },
  propertiesAddedCount: {
    type: Number,
    default: 0,
  },

}, { timestamps: true });

// Ek user ki same district ke liye multiple active subscription na bane,
// isliye ek compound index bana rahe hain (user + state + district)
subscriptionSchema.index({ user: 1, state: 1, district: 1 });

const Subscription =
  mongoose.models.subscriptions || mongoose.model("subscriptions", subscriptionSchema);

export default Subscription;