import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import User from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    // Step 1: Logged-in user ki ID nikalna
    const userId = await getDataFromToken(request);

    // Step 2: Database se check karna ki ye user Admin hai ya nahi
    // (Sirf frontend check kaafi nahi hai - kisi bhi user ne agar
    //  browser me directly URL type kiya, to bhi ye check rok dega)
    const currentUser = await User.findById(userId).select("isAdmin");

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json(
        { error: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    // Step 3: Sabhi "Pending" properties fetch karna
    const pendingProperties = await Property.find({ status: "Pending" })
      .sort({ createdAt: -1 }) // sabse purani listing pehle (FIFO order)
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
