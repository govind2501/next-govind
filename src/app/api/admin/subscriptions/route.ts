import { connect } from "@/dbConfig/dbConfig";
import Subscription from "@/models/Subscriptionmodels";
import User from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    // Sirf Admin hi ye list dekh sake
    const requesterId = await getDataFromToken(request);
    const requester = await User.findById(requesterId);

    if (!requester || !requester.isAdmin) {
      return NextResponse.json(
        { error: "Not authorized. Admin access required" },
        { status: 403 }
      );
    }

    // Saari subscriptions nikalna, saath me user ka username/email bhi
    const subscriptions = await Subscription.find({})
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    // Har subscription ka asli (computed) status nikalna - endDate ke hisaab se
    const now = new Date();
    const subscriptionsWithStatus = subscriptions.map((sub) => {
      const subObj = sub.toObject();
      const isExpired = new Date(subObj.endDate) < now;

      return {
        ...subObj,
        computedStatus:
          subObj.status === "Cancelled"
            ? "Cancelled"
            : isExpired
            ? "Expired"
            : "Active",
      };
    });

    return NextResponse.json({
      success: true,
      subscriptions: subscriptionsWithStatus,
    });

  } catch (error: any) {
    console.log("Fetch subscriptions error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}