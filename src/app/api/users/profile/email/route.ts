import { connect } from "@/dbConfig/dbConfig";
import userModels from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { sendEmail } from "@/utils/mailHelpers";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  // Step 1: identify the logged-in user from the token cookie
  let userId: string;
  try {
    userId = getDataFromToken(request);
  } catch {
    return NextResponse.json(
      { error: "Please log in again" },
      { status: 401 }
    );
  }

  try {
    await connect();

    const { newEmail, currentPassword } = await request.json();

    // Step 2: validate the input
    if (typeof newEmail !== "string" || typeof currentPassword !== "string") {
      return NextResponse.json(
        { error: "New email and current password are required" },
        { status: 400 }
      );
    }

    const cleanedEmail = newEmail.toLowerCase().trim();

    if (
      !cleanedEmail ||
      cleanedEmail.length > 254 ||
      !EMAIL_PATTERN.test(cleanedEmail)
    ) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 }
      );
    }

    // Step 3: load the user and verify the current password
    const user = await userModels.findById(userId).select("email password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await bcryptjs.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    if (cleanedEmail === user.email) {
      return NextResponse.json(
        { error: "This is already your email address" },
        { status: 400 }
      );
    }

    // Step 4: make sure no other account already uses this email
    const emailInUse = await userModels.findOne({ email: cleanedEmail });
    if (emailInUse) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 400 }
      );
    }

    // Step 5: create a random token and store only its hash
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await userModels.findByIdAndUpdate(userId, {
      pendingEmail: cleanedEmail,
      pendingEmailToken: tokenHash,
      pendingEmailTokenExpiry: Date.now() + 3600000, // valid for 1 hour
    });

    // Step 6: send the confirmation link to the NEW email address
    try {
      await sendEmail({
        email: cleanedEmail,
        emailType: "CHANGE_EMAIL",
        userId,
        token,
      });
    } catch (mailError: any) {
      // Remove the pending change if the email could not be sent
      await userModels.findByIdAndUpdate(userId, {
        $unset: {
          pendingEmail: "",
          pendingEmailToken: "",
          pendingEmailTokenExpiry: "",
        },
      });
      console.log("Change email: sending failed:", mailError.message);
      return NextResponse.json(
        { error: "Could not send the confirmation email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `A confirmation link has been sent to ${cleanedEmail}`,
      success: true,
    });
  } catch (error: any) {
    console.log("Change email route error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}