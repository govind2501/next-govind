import { connect } from "@/dbConfig/dbConfig";
import Visit from "@/models/visitmodels";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { visitId } = reqBody;

    if (!visitId) {
      return NextResponse.json(
        { error: "visitId is required" },
        { status: 400 }
      );
    }

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return NextResponse.json(
        { error: "Visit not found" },
        { status: 404 }
      );
    }

    // Calculate how many seconds passed since the last heartbeat, and add it
    const now = new Date();
    const secondsSinceLastBeat = Math.round(
      (now.getTime() - new Date(visit.lastActiveTime).getTime()) / 1000
    );

    visit.durationSeconds += secondsSinceLastBeat;
    visit.lastActiveTime = now;
    await visit.save();

    return NextResponse.json({
      success: true,
      durationSeconds: visit.durationSeconds,
    });

  } catch (error: any) {
    console.log("Heartbeat error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}