import { connect } from "@/dbConfig/dbConfig";
import Subscription from "@/models/Subscriptionmodels";
import User from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect();

const PLAN_CONFIG = {
  Monthly: { amount: 299, months: 1, propertyLimit: 5 },
  Quarterly: { amount: 599, months: 3, propertyLimit: 15 },
  Yearly: { amount: 2200, months: 12, propertyLimit: 60 },
};

export async function POST(request: NextRequest) {
  try {
    // Sirf Admin hi ye action kar sake
    const requesterId = await getDataFromToken(request);
    const requester = await User.findById(requesterId);

    if (!requester || !requester.isAdmin) {
      return NextResponse.json(
        { error: "Not authorized. Admin access required" },
        { status: 403 }
      );
    }

    const reqBody = await request.json();
    const { userId, state, district, planType } = reqBody;

    if (!userId || !state || !district || !planType) {
      return NextResponse.json(
        { error: "User, State, District aur Plan Type sabhi zaroori hain" },
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

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return NextResponse.json(
        { error: "User nahi mila" },
        { status: 404 }
      );
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + config.months);

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
      paymentReference: "ADMIN_ACTIVATED_" + Date.now(),
    });

    await newSubscription.save();

    return NextResponse.json({
      success: true,
      message: `${targetUser.username} ke liye ${district} district ki ${planType} subscription activate ho gayi`,
      subscription: newSubscription,
    });

  } catch (error: any) {
    console.log("Admin subscription activate error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}