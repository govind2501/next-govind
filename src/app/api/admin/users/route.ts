import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connect();

    // Request bhejne wala khud admin hai ya nahi, check karna
    const requesterId = await getDataFromToken(request);
    const requester = await User.findById(requesterId);

    if (!requester || !requester.isAdmin) {
      return NextResponse.json(
        { error: "Not authorized. Admin access required" },
        { status: 403 }
      );
    }

    // Password aur token wali sensitive fields chhodkar sab users nikalna
    const users = await User.find({ isAdmin: false }).select(
      "-password -forgotPasswordToken -forgotPasswordTokenExpiry -VerifyToken -VerifyTokenExpiry"
    );

    return NextResponse.json({
      success: true,
      users,
    });

  } catch (error: any) {
    console.log("Fetch users error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}