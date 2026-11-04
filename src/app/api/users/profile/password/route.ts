import { connect } from "@/dbConfig/dbConfig";
import userModels from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function PATCH(request: NextRequest) {
  // Step 1: identify the logged-in user from the token cookie
  let userId: string;
  try {
    userId = await getDataFromToken(request);
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
    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8 || newPassword.length > 72) {
      return NextResponse.json(
        { error: "Password must be between 8 and 72 characters" },
        { status: 400 }
      );
    }

    // Step 3: check the current password
    const user = await userModels.findById(userId).select("password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    if (newPassword === currentPassword) {
      return NextResponse.json(
        { error: "New password must be different from the current password" },
        { status: 400 }
      );
    }

    // Step 4: hash and save the new password.
    // passwordChangedAt makes every older login token invalid.
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    const updatedUser = await userModels
      .findByIdAndUpdate(
        userId,
        {
          $set: { password: hashedPassword, passwordChangedAt: new Date() },
          $unset: { forgotPasswordToken: "", forgotPasswordTokenExpiry: "" },
        },
        { new: true }
      )
      .select("username email");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Step 5: give this browser a fresh token so this login stays active
    const token = jwt.sign(
      {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      message: "Password updated",
      success: true,
    });

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error: any) {
    console.log("Change password route error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}