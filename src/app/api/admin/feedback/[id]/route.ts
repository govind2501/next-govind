import { connect } from "@/dbConfig/dbConfig";
import Feedback from "@/models/feedbackmodels";
import User from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();

    // Only an Admin can delete feedback
    const requesterId = await getDataFromToken(request);
    const requester = await User.findById(requesterId);

    if (!requester || !requester.isAdmin) {
      return NextResponse.json(
        { error: "Not authorized. Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback deleted successfully",
    });

  } catch (error: any) {
    console.log("Delete feedback error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}