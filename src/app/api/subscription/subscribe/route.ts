import { connect } from "@/dbConfig/dbConfig";
import Subscription from "@/models/Subscriptionmodels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

connect();

// Fixed prices for now - these will later come from a payment gateway response
const PLAN_CONFIG = {
  Monthly: { amount: 299, months: 1, propertyLimit: 20 },
  Quarterly: { amount: 599, months: 3, propertyLimit: 80 },
  Yearly: { amount: 2200, months: 12, propertyLimit: 260 },
};

export async function POST(request: NextRequest) {
  try {
    // Step 1: Find out who is buying the subscription
    const userId = await getDataFromToken(request);

    // Step 2: Read request body
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

    // Step 3: Verify the payment is genuinely from Razorpay by re-computing
    // the signature ourselves and comparing it. This is what stops anyone
    // from calling this API directly and getting a free subscription.
    const bodyToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(bodyToSign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed. Please contact support." },
        { status: 400 }
      );
    }

    const amount = config.amount;

    // Step 4: Calculate subscription end date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + config.months);

    // Step 5: Create the subscription record
    const newSubscription = new Subscription({
      user: userId,
      state,
      district,
      planType,
      amount,
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
    console.log("Subscribe error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}