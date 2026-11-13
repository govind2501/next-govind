import mongoose from "mongoose";

// One record per payment attempt. Created BEFORE the customer goes to the
// payment gateway, so that when the gateway sends the customer back we compare
// the result with what the server saved - never with what the browser says.
const paymentAttemptSchema = new mongoose.Schema(
  {
    txnid: { type: String, required: true, unique: true },
    gateway: { type: String, enum: ["razorpay", "payu"], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    planType: { type: String, enum: ["Monthly", "Quarterly", "Yearly"], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Created", "Success", "Failed"], default: "Created" },
    gatewayPaymentId: { type: String, default: "" },
  },
  { timestamps: true }
);

const PaymentAttempt =
  mongoose.models.PaymentAttempt ||
  mongoose.model("PaymentAttempt", paymentAttemptSchema);

export default PaymentAttempt;