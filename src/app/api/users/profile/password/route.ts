import { connect } from "@/dbConfig/dbConfig";
import userModels from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function PATCH(request: NextRequest) {
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

    const { currentPassword, newPassword } = await request.json();

    // Step 2: validate the input
    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      !currentPassword ||
      !newPassword
    ) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // bcrypt only reads the first 72 bytes, so longer passwords are not accepted
    if (newPassword.length > 72) {
      return NextResponse.json(
        { error: "New password must be at most 72 characters long" },
        { status: 400 }
      );
    }

    if (newPassword === currentPassword) {
      return NextResponse.json(
        { error: "New password must be different from the current password" },
        { status: 400 }
      );
    }

    // Step 3: load the stored password hash of this user
    const user = await userModels.findById(userId).select("password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Step 4: verify the current password
    const isCurrentCorrect = await bcryptjs.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentCorrect) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Step 5: hash and save the new password, and remove any old reset link
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    await userModels.findByIdAndUpdate(userId, {
      $set: { password: hashedPassword },
      $unset: { forgotPasswordToken: "", forgotPasswordTokenExpiry: "" },
    });

    return NextResponse.json({
      message: "Password updated",
      success: true,
    });
  } catch (error: any) {
    console.log("Update password route error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}