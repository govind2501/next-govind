import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import userModels from "@/models/userModels";

// Reads the login token from the cookie and returns the user id.
// It also rejects tokens that were issued before the user's last password change,
// and tokens that belong to a user who no longer exists.
export const getDataFromToken = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    await connect();
    const user = await userModels
      .findById(decodedToken.id)
      .select("passwordChangedAt");

    if (!user) {
      throw new Error("User not found");
    }

    if (user.passwordChangedAt) {
      const changedAtSeconds = Math.floor(
        user.passwordChangedAt.getTime() / 1000
      );
      if (!decodedToken.iat || decodedToken.iat < changedAtSeconds) {
        throw new Error("Session expired. Please log in again");
      }
    }

    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};