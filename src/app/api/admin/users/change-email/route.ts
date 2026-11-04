import { connect } from "@/dbConfig/dbConfig";
import userModels from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { sendEmail } from "@/utils/mailHelpers";
import { NextRequest, NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Admin only: changes a customer's email, logs the customer out everywhere,
// and sends a password reset link to the NEW email address.
export async function POST(request: NextRequest) {
  // Step 1: identify the caller
  let requesterId: string;
  try {
    requesterId = await getDataFromToken(request);
  } catch {
    return NextResponse.json(
      { error: "Please log in again" },
      { status: 401 }
    );
  }

  try {
    await connect();

    // Step 2: only an Admin can use this
    const requester = await userModels.findById(requesterId).select("isAdmin");
    if (!requester || !requester.isAdmin) {
      return NextResponse.json(
        { error: "Not authorized. Admin access required" },
        { status: 403 }
      );
    }

    // Step 3: validate the input
    const { userId, newEmail } = await request.json();

    if (typeof userId !== "string" || typeof newEmail !== "string") {
      return NextResponse.json(
        { error: "User and new email are required" },
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

    const target = await userModels
      .findById(userId)
      .select("email username isAdmin");
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Admin accounts must change their own email from the Profile page
    if (target.isAdmin) {
      return NextResponse.json(
        { error: "Admin accounts cannot be changed from here" },
        { status: 400 }
      );
    }

    if (cleanedEmail === target.email) {
      return NextResponse.json(
        { error: "This is already the user's email address" },
        { status: 400 }
      );
    }

    const emailInUse = await userModels.findOne({ email: cleanedEmail });
    if (emailInUse) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 400 }
      );
    }

    // Step 4: change the email and log the user out of every device
    await userModels.findByIdAndUpdate(userId, {
      $set: { email: cleanedEmail, passwordChangedAt: new Date() },
      $unset: {
        pendingEmail: "",
        pendingEmailToken: "",
        pendingEmailTokenExpiry: "",
      },
    });

    console.log(`Admin ${requesterId} changed the email of user ${userId}`);

    // Step 5: send a password reset link to the new email address
    let resetLinkSent = true;
    try {
      await sendEmail({ email: cleanedEmail, emailType: "RESET", userId });
    } catch (mailError: any) {
      resetLinkSent = false;
      console.log("Admin change email: reset mail failed:", mailError.message);
    }

    return NextResponse.json({
      success: true,
      message: resetLinkSent
        ? `Email changed to ${cleanedEmail}. A password reset link was sent to it.`
        : `Email changed to ${cleanedEmail}, but the reset link could not be sent. Ask the user to use Forgot Password.`,
    });
  } catch (error: any) {
    console.log("Admin change email error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}