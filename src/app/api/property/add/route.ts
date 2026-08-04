import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import User from "@/models/userModels";
import Subscription from "@/models/Subscriptionmodels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    // Get the logged-in user's ID from the token
    const userId = await getDataFromToken(request);

    // Get the full record of the logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const reqBody = await request.json();
    const {
      listingType, // "Sell" or "BuyerRequirement"
      title,
      description,
      propertyType,
      transactionType,
      price,
      priceUnit,
      state,
      district,
      city,
      address,
      pincode,
      area,
      bedrooms,
      bathrooms,
      images,
      ownerName,
      ownerEmail,
      contactPhone,
    } = reqBody;

    // Basic validation - fields that are always required (for both Sell and BuyerRequirement)
    if (!propertyType || !transactionType || !price || !state || !district || !ownerName || !contactPhone) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 }
      );
    }

    // Extra validation - title/description are required only for "Sell" listings
    const finalListingType = listingType === "BuyerRequirement" ? "BuyerRequirement" : "Sell";

    if (finalListingType === "Sell" && (!title || !description)) {
      return NextResponse.json(
        { error: "Please provide title and description" },
        { status: 400 }
      );
    }

    // ---- District-wise Subscription Check (Admin bypasses this) ----
    let districtSubscription = null;

    if (!user.isAdmin) {
      districtSubscription = await Subscription.findOne({
        user: userId,
        state,
        district,
        status: "Active",
        endDate: { $gte: new Date() }, // not expired yet
      });

      if (!districtSubscription) {
        return NextResponse.json(
          {
            error: `A subscription for ${district} district is required to add a property`,
          },
          { status: 403 }
        );
      }

      if (districtSubscription.propertiesAddedCount >= districtSubscription.propertyLimit) {
        return NextResponse.json(
          {
            error: `Your plan limit for ${district} district has been reached. Please renew`,
          },
          { status: 403 }
        );
      }
    }

    const newProperty = new Property({
      listingType: finalListingType,
      title,
      description,
      propertyType,
      transactionType,
      price,
      priceUnit,
      state,
      district,
      city,
      address,
      pincode,
      area,
      bedrooms,
      bathrooms,
      images,
      ownerName,
      ownerEmail,
      contactPhone,
      owner: userId, // logged-in user's ID
      status: "Pending", // always starts as pending
    });

    const savedProperty = await newProperty.save();

    // ---- Increment subscription count (skipped for Admin) ----
    if (!user.isAdmin && districtSubscription) {
      districtSubscription.propertiesAddedCount += 1;
      await districtSubscription.save();
    }

    return NextResponse.json({
      message: "Property listed successfully! Waiting for admin approval.",
      success: true,
      property: savedProperty,
    });

  } catch (error: any) {
    console.log("Property add error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}