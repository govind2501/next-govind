import { connect } from "@/dbConfig/dbConfig";
import userModels from "@/models/userModels";
import { sendEmail } from "@/utils/mailHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { email } = reqBody;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await userModels.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id,
    });

    return NextResponse.json({
      message: "Reset password email sent",
      success: true,
    });
  } catch (error: any) {
    console.log("Forgot password route error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}