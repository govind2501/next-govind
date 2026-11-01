import { connect } from "@/dbConfig/dbConfig";
import userModels from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

    const { username } = await request.json();

    // Step 2: clean and validate the new username
    const cleaned =
      typeof username === "string" ? username.trim().replace(/\s+/g, " ") : "";

    if (cleaned.length < 3 || cleaned.length > 30) {
      return NextResponse.json(
        { error: "Username must be between 3 and 30 characters" },
        { status: 400 }
      );
    }

    if (!/^[A-Za-z0-9 ._-]+$/.test(cleaned)) {
      return NextResponse.json(
        {
          error:
            "Username can only contain letters, numbers, spaces, dots, underscores and hyphens",
        },
        { status: 400 }
      );
    }

    // Step 3: make sure nobody else already uses this name (case-insensitive)
    const taken = await userModels
      .findOne({ username: cleaned, _id: { $ne: userId } })
      .collation({ locale: "en", strength: 2 });

    if (taken) {
      return NextResponse.json(
        { error: "This username is already taken" },
        { status: 400 }
      );
    }

    // Step 4: update only the username of this user
    const user = await userModels
      .findByIdAndUpdate(userId, { username: cleaned }, { new: true })
      .select("username email");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Step 5: issue a fresh token because the old one holds the old username
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      message: "Username updated",
      success: true,
      username: user.username,
    });

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error: any) {
    // Duplicate key error from the unique index (two requests at the same time)
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: "This username is already taken" },
        { status: 400 }
      );
    }
    console.log("Update username route error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}