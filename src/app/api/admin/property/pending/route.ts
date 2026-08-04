import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import User from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    // Step 1: Get the logged-in user's ID
    const userId = await getDataFromToken(request);

    // Step 2: Check in the database whether this user is an Admin
    // (A frontend-only check isn't enough - if any user directly types
    //  the URL in the browser, this check will still block them)
    const currentUser = await User.findById(userId).select("isAdmin");

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json(
        { error: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    // Step 3: Fetch all "Pending" properties
    const pendingProperties = await Property.find({ status: "Pending" })
      .sort({ createdAt: -1 }) // oldest listing first (FIFO order)
      .populate("owner", "username email");

    return NextResponse.json({
      success: true,
      total: pendingProperties.length,
      properties: pendingProperties,
    });

  } catch (error: any) {
    console.log("Admin pending fetch error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}