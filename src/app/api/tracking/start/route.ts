import { connect } from "@/dbConfig/dbConfig";
import Visit from "@/models/visitmodels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { visitorId, page } = reqBody;

    if (!visitorId || !page) {
      return NextResponse.json(
        { error: "visitorId and page are required" },
        { status: 400 }
      );
    }

    // If the customer is logged in, capture their user ID (optional, ignore errors)
    let userId: string | null = null;
    try {
      userId = await getDataFromToken(request);
    } catch (err) {
      userId = null;
    }

    const newVisit = new Visit({
      user: userId,
      visitorId,
      page,
      startTime: new Date(),
      lastActiveTime: new Date(),
      durationSeconds: 0,
    });

    const savedVisit = await newVisit.save();

    return NextResponse.json({
      success: true,
      visitId: savedVisit._id,
    });

  } catch (error: any) {
    console.log("Visit start error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}