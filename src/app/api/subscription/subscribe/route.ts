import { connect } from "@/dbConfig/dbConfig";
import Subscription from "@/models/Subscriptionmodels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";

connect();

// Fixed prices - the server decides the price, never the browser
const PLAN_CONFIG = {
  Monthly: { amount: 299, months: 1, propertyLimit: 20 },
  Quarterly: { amount: 599, months: 3, propertyLimit: 80 },
  Yearly: { amount: 2200, months: 12, propertyLimit: 260 },
};

export async function POST(request: NextRequest) {
  // Step 1: find out who is buying the subscription (not logged in -> 401)
  let userId: string;
  try {
    userId = await getDataFromToken(request);
  } catch {
    return NextResponse.json(
      { error: "Please log in again" },
      { status: 401 }
    );
  }

  try {
    // Step 2: read and validate the request body
    const reqBody = await request.json();
    const {
      state,
      district,
      planType,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = reqBody;

    if (!state || !district || !planType) {
      return NextResponse.json(
        { error: "State, District and Plan Type are all required" },
        { status: 400 }
      );
    }

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Payment details are missing" },
        { status: 400 }
      );
    }

    const config = PLAN_CONFIG[planType as keyof typeof PLAN_CONFIG];

    if (!config) {
      return NextResponse.json(
        { error: "Plan Type can only be 'Monthly', 'Quarterly' or 'Yearly'" },
        { status: 400 }
      );
    }

    // Step 3: verify the payment is genuinely from Razorpay by re-computing
    // the signature ourselves and comparing it.
    const bodyToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(bodyToSign)
      .digest("hex");

    const givenBuffer = Buffer.from(String(razorpay_signature));
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      givenBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(givenBuffer, expectedBuffer)
    ) {
      return NextResponse.json(
        { error: "Payment verification failed. Please contact support." },
        { status: 400 }
      );
    }

    // Step 4: one payment can create only one subscription
    const paymentAlreadyUsed = await Subscription.findOne({
      paymentReference: razorpay_payment_id,
    });

    if (paymentAlreadyUsed) {
      return NextResponse.json(
        { error: "This payment has already been used" },
        { status: 409 }
      );
    }

    // Step 5: ask Razorpay what was really paid, and compare it with the plan price
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const payment: any = await razorpay.payments.fetch(razorpay_payment_id);

    const expectedAmountInPaise = config.amount * 100;
    const paymentIsGood =
      payment.order_id === razorpay_order_id &&
      Number(payment.amount) === expectedAmountInPaise &&
      payment.currency === "INR" &&
      (payment.status === "captured" || payment.status === "authorized");

    if (!paymentIsGood) {
      return NextResponse.json(
        {
          error:
            "Payment amount does not match the selected plan. Please contact support.",
        },
        { status: 400 }
      );
    }

    // Step 6: calculate the subscription end date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + config.months);

    // Step 7: create the subscription record
    const newSubscription = new Subscription({
      user: userId,
      state,
      district,
      planType,
      amount: config.amount,
      startDate,
      endDate,
      status: "Active",
      propertyLimit: config.propertyLimit,
      propertiesAddedCount: 0,
      paymentReference: razorpay_payment_id,
    });

    await newSubscription.save();

    return NextResponse.json({
      success: true,
      message: `${planType} subscription activated for ${district} district!`,
      subscription: newSubscription,
    });
  } catch (error: any) {
    // Log the real reason on the server only, and send a generic message to the browser
    console.log("Subscribe error:", error?.message || error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}