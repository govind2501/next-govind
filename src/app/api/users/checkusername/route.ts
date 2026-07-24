        import { connect } from "@/dbConfig/dbConfig";
import userModels from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username || username.trim().length < 3) {
      return NextResponse.json(
        { available: false, message: "Username kam se kam 3 characters ka hona chahiye" },
        { status: 400 }
      );
    }

    const existingUser = await userModels.findOne({ username: username.trim() });

    if (existingUser) {
      return NextResponse.json({ available: false, message: "Yah username pehle se liya hua hai" });
    }

    return NextResponse.json({ available: true, message: "Yah username available hai" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}