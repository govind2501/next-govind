import { connect } from "@/dbConfig/dbConfig";
import userModels from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Sends the user back to the profile page with a result code in the URL
function redirectTo(request: NextRequest, status: string) {
  const url = new URL(
    `/profile?emailChange=${status}`,
    process.env.DOMAIN || request.url
  );
  return NextResponse.redirect(url);
}

const clearPendingFields = {
  pendingEmail: "",
  pendingEmailToken: "",
  pendingEmailTokenExpiry: "",
};

export async function GET(request: NextRequest) {
  try {
    await connect();

    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return redirectTo(request, "invalid");
    }

    // Only the hash of the token is stored, so hash the incoming one to compare
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModels
      .findOne({
        pendingEmailToken: tokenHash,
        pendingEmailTokenExpiry: { $gt: Date.now() },
      })
      .select("username email pendingEmail");

    if (!user || !user.pendingEmail) {
      return redirectTo(request, "invalid");
    }

    const newEmail = user.pendingEmail;

    // Check again that nobody else took this email while the link was waiting
    const emailInUse = await userModels.findOne({
      email: newEmail,
      _id: { $ne: user._id },
    });

    if (emailInUse) {
      await userModels.findByIdAndUpdate(user._id, {
        $unset: clearPendingFields,
      });
      return redirectTo(request, "taken");
    }

    // Apply the change and remove the pending fields so the link works only once
    await userModels.findByIdAndUpdate(user._id, {
      $set: { email: newEmail },
      $unset: clearPendingFields,
    });

    const response = redirectTo(request, "success");

    // If this browser is logged in as the same user, refresh the token cookie
    // because the old token still contains the old email
    try {
      const loggedInId = await getDataFromToken(request);
      if (String(loggedInId) === String(user._id)) {
        const newToken = jwt.sign(
          { id: user._id, username: user.username, email: newEmail },
          process.env.TOKEN_SECRET as string,
          { expiresIn: "1d" }
        );
        response.cookies.set("token", newToken, { httpOnly: true });
      }
    } catch {
      // Not logged in on this browser, nothing to refresh
    }

    return response;
  } catch (error: any) {
    if (error?.code === 11000) {
      return redirectTo(request, "taken");
    }
    console.log("Confirm email route error:", error.message);
    return redirectTo(request, "error");
  }
}