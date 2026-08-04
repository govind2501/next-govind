import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";

// Used only inside Server Components / Server Actions.
// Reads the token cookie directly (no NextRequest needed here).
export async function getServerUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";

    if (!token) return null;

    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    await connect();
    const user = await User.findById(decodedToken.id).select("-password");

    return user;
  } catch (error) {
    return null;
  }
}