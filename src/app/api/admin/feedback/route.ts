import { connect } from "@/dbConfig/dbConfig";
import Feedback from "@/models/feedbackmodels";
import User from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connect();

    const requesterId = await getDataFromToken(request);
    const requester = await User.findById(requesterId);

    if (!requester || !requester.isAdmin) {
      return NextResponse.json(
        { error: "Not authorized. Admin access required" },
        { status: 403 }
      );
    }

    const feedbackList = await Feedback.find({})
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      feedbackList,
    });

  } catch (error: any) {
    console.log("Fetch feedback error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}