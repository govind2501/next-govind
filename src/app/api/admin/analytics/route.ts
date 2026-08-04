import { connect } from "@/dbConfig/dbConfig";
import Visit from "@/models/visitmodels";
import User from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connect();

    // Only an Admin can view this
    const requesterId = await getDataFromToken(request);
    const requester = await User.findById(requesterId);

    if (!requester || !requester.isAdmin) {
      return NextResponse.json(
        { error: "Not authorized. Admin access required" },
        { status: 403 }
      );
    }

    // Group all visits by page, calculate total visits and average duration
    const stats = await Visit.aggregate([
      {
        $group: {
          _id: "$page",
          totalVisits: { $sum: 1 },
          averageDurationSeconds: { $avg: "$durationSeconds" },
          totalDurationSeconds: { $sum: "$durationSeconds" },
        },
      },
      { $sort: { totalVisits: -1 } },
    ]);

    return NextResponse.json({
      success: true,
      stats,
    });

  } catch (error: any) {
    console.log("Fetch analytics error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connect();

    // Only an Admin can delete visit data
    const requesterId = await getDataFromToken(request);
    const requester = await User.findById(requesterId);

    if (!requester || !requester.isAdmin) {
      return NextResponse.json(
        { error: "Not authorized. Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    if (!page) {
      return NextResponse.json(
        { error: "Page is required" },
        { status: 400 }
      );
    }

    const result = await Visit.deleteMany({ page });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} visit(s) for ${page}`,
    });

  } catch (error: any) {
    console.log("Delete visits error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}