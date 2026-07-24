import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import User from "@/models/userModels";
import Subscription from "@/models/Subscriptionmodels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    // Login user ki ID token se nikalna (jaise aap dashboard me karte hain)
    const userId = await getDataFromToken(request);

    // Logged-in user ka pura record nikalna
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

    // Basic validation - fields jo hamesha zaroori hain (Sell aur BuyerRequirement dono me)
    if (!propertyType || !transactionType || !price || !state || !district || !ownerName || !contactPhone) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 }
      );
    }

    // Extra validation - sirf "Sell" listing ke liye title/description zaroori
    const finalListingType = listingType === "BuyerRequirement" ? "BuyerRequirement" : "Sell";

    if (finalListingType === "Sell" && (!title || !description)) {
      return NextResponse.json(
        { error: "Please provide title and description" },
        { status: 400 }
      );
    }

    // ---- District-wise Subscription Check (Admin isse bypass karega) ----
    let districtSubscription = null;

    if (!user.isAdmin) {
      districtSubscription = await Subscription.findOne({
        user: userId,
        state,
        district,
        status: "Active",
        endDate: { $gte: new Date() }, // abhi tak expire nahi hui ho
      });

      if (!districtSubscription) {
        return NextResponse.json(
          {
            error: `Property add karne ke liye ${district} district ki subscription lena zaroori hai`,
          },
          { status: 403 }
        );
      }

      if (districtSubscription.propertiesAddedCount >= districtSubscription.propertyLimit) {
        return NextResponse.json(
          {
            error: `Aapki ${district} district ki plan limit poori ho chuki hai. Kripya renew karein`,
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
      owner: userId, // logged-in user ki ID
      status: "Pending", // hamesha pending se start hoga
    });

    const savedProperty = await newProperty.save();

    // ---- Subscription count badhana (Admin ke liye skip) ----
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