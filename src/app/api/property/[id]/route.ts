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
    // In Next.js 16, params is a Promise, so it must be awaited
    const { id } = await params;

    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Public users should only see Approved properties
    if (property.status !== "Approved") {
      return NextResponse.json(
        { error: "This property is not available" },
        { status: 403 }
      );
    }

    // Step: Check whether the current user is logged in
    // (Login is not required to view a property, so we ignore the error)
    let userId: string | null = null;
    try {
      userId = await getDataFromToken(request);
    } catch (err) {
      userId = null; // user is not logged in - that's fine
    }

    // Step: Check whether this user has an active subscription
    // for this property's state+district
    let hasAccess = false;

    if (userId) {
      const activeSubscription = await Subscription.findOne({
        user: userId,
        state: property.state,
        district: property.district,
        status: "Active",
        endDate: { $gte: new Date() }, // not expired yet
      });

      if (activeSubscription) {
        hasAccess = true;
      }
    }

    // Convert the property into a plain object so we can modify it
    const propertyData = property.toObject();

    // If there's no subscription, remove the sensitive contact details
    if (!hasAccess) {
      propertyData.contactPhone = null;
      propertyData.address = null;
      propertyData.ownerName = "Locked";
      propertyData.ownerEmail = null;
    }

    return NextResponse.json({
      success: true,
      property: propertyData,
      hasAccess, // tells the frontend whether to show the "Unlock" button
    });

  } catch (error: any) {
    console.log("Fetch single property error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}