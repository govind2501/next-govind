import { connect } from "@/dbConfig/dbConfig";
import Subscription from "@/models/Subscriptionmodels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

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
    const { state, district, planType } = reqBody;

    if (!state || !district || !planType) {
      return NextResponse.json(
        { error: "State, District aur Plan Type teeno zaroori hain" },
        { status: 400 }
      );
    }

    const config = PLAN_CONFIG[planType as keyof typeof PLAN_CONFIG];

    if (!config) {
      return NextResponse.json(
        { error: "Plan Type sirf 'Monthly', 'Quarterly' ya 'Yearly' ho sakta hai" },
        { status: 400 }
      );
    }

    // Step 3: FAKE PAYMENT - abhi ke liye seedha success maan rahe hain
    // (Aage jaake yahan Razorpay/PhonePe ka real payment verification aayega)
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
      paymentReference: "DEMO_PAYMENT_" + Date.now(), // fake reference for now
    });

    await newSubscription.save();

    return NextResponse.json({
      success: true,
      message: `${district} district ke liye ${planType} subscription activate ho gayi!`,
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