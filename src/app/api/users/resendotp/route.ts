  import { connect } from "@/dbConfig/dbConfig";
import userModels from "@/models/userModels";
import { sendEmail } from "@/utils/mailHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { email } = await request.json();
    const normalizedEmail = email.toLowerCase().trim();

    const user = await userModels.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }
    if (user.isVerified) {
      return NextResponse.json({ error: "User pehle se verified hai" }, { status: 400 });
    }

    await sendEmail({ email: user.email, emailType: "VERIFY", userId: user._id });

    return NextResponse.json({ message: "OTP dobara bhej diya gaya", success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}