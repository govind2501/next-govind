import { connect } from "@/dbConfig/dbConfig";
import userModels from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { email, otp } = reqBody;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email aur OTP dono zaroori hai" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await userModels.findOne({
      email: normalizedEmail,
      VerifyToken: otp,
      VerifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Galat ya expired OTP" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.VerifyToken = undefined;
    user.VerifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: any) {
    console.log("Verify email route error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}