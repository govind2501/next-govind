import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import Subscription from "@/models/Subscriptionmodels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 16 me params ek Promise hai, isliye await lagana zaroori hai
    const { id } = await params;

    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Public users ko sirf Approved property hi dikhni chahiye
    if (property.status !== "Approved") {
      return NextResponse.json(
        { error: "This property is not available" },
        { status: 403 }
      );
    }

    // Step: Check karna ki current user login hai ya nahi
    // (Login zaroori nahi hai property dekhne ke liye, isliye error ko ignore karte hain)
    let userId: string | null = null;
    try {
      userId = await getDataFromToken(request);
    } catch (err) {
      userId = null; // user login nahi hai - koi baat nahi
    }

    // Step: Check karna ki is user ki is property ke state+district ke liye
    // active subscription hai ya nahi
    let hasAccess = false;

    if (userId) {
      const activeSubscription = await Subscription.findOne({
        user: userId,
        state: property.state,
        district: property.district,
        status: "Active",
        endDate: { $gte: new Date() }, // abhi tak expire nahi hui ho
      });

      if (activeSubscription) {
        hasAccess = true;
      }
    }

    // Property ko ek plain object me convert karte hain taaki usme changes kar sakein
    const propertyData = property.toObject();

    // Agar subscription nahi hai, to sensitive contact details hata dete hain
    if (!hasAccess) {
      propertyData.contactPhone = null;
      propertyData.address = null;
      propertyData.ownerName = "Locked";
      propertyData.ownerEmail = null;
    }

    return NextResponse.json({
      success: true,
      property: propertyData,
      hasAccess, // frontend ko batayega ki "Unlock" button dikhana hai ya nahi
    });

  } catch (error: any) {
    console.log("Fetch single property error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}