import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import User from "@/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    // Step 1: Logged-in user ki ID nikalna
    const userId = await getDataFromToken(request);

    // Step 2: Check karna ki ye user Admin hai ya nahi
    const currentUser = await User.findById(userId).select("isAdmin");

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json(
        { error: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    // Step 3: Request body se data lena
    const reqBody = await request.json();
    const { propertyId, action, rejectionReason } = reqBody;
    // action = "approve" ya "reject"

    if (!propertyId || !action) {
      return NextResponse.json(
        { error: "Property ID and action dono zaroori hain" },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Action sirf 'approve' ya 'reject' ho sakta hai" },
        { status: 400 }
      );
    }

    // Step 4: Update karne ke liye fields taiyar karna
    const updateFields =
      action === "approve"
        ? { status: "Approved", rejectionReason: "" }
        : {
            status: "Rejected",
            rejectionReason: rejectionReason || "Admin ne is listing ko reject kiya hai",
          };

    // Step 5: findByIdAndUpdate - sirf status/rejectionReason update hoga,
    // poore document ki dobara validation nahi chalegi (purani properties safe rahengi)
    const property = await Property.findByIdAndUpdate(propertyId, updateFields, {
      new: true, // updated document wapas milega
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property nahi mili" },
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