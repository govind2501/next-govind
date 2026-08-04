import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import User from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    // Step 1: Get the logged-in user's ID
    const userId = await getDataFromToken(request);

    // Step 2: Check whether this user is an Admin
    const currentUser = await User.findById(userId).select("isAdmin");

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json(
        { error: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    // Step 3: Get data from the request body
    const reqBody = await request.json();
    const { propertyId, action, rejectionReason } = reqBody;
    // action = "approve" or "reject"

    if (!propertyId || !action) {
      return NextResponse.json(
        { error: "Property ID and action are both required" },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Action can only be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Step 4: Prepare the fields to update
    const updateFields =
      action === "approve"
        ? { status: "Approved", rejectionReason: "" }
        : {
            status: "Rejected",
            rejectionReason: rejectionReason || "Admin has rejected this listing",
          };

    // Step 5: findByIdAndUpdate - only status/rejectionReason will be updated,
    // full-document validation won't run again (old properties stay safe)
    const property = await Property.findByIdAndUpdate(propertyId, updateFields, {
      new: true, // return the updated document
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Property ${action === "approve" ? "approved" : "rejected"} successfully`,
      property,
    });

  } catch (error: any) {
    console.log("Admin approve/reject error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}