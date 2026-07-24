import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    // URL se query parameters nikalna, jaise: /api/property/all?state=Uttar Pradesh&district=Lucknow
    const { searchParams } = new URL(request.url);

    const state = searchParams.get("state");
    const district = searchParams.get("district");
    const propertyType = searchParams.get("propertyType");     // Land / House / Shop
    const transactionType = searchParams.get("transactionType"); // Sell / Rent
    const listingType = searchParams.get("listingType");       // Sell / BuyerRequirement

    // Page-wise data laane ke liye (pagination) - default page 1, 10 items
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Filter object banate hain - sirf wahi cheezein add karte hain jo user ne bheji hain
    const filter: any = { status: "Approved" };

    if (state) filter.state = state;
    if (district) filter.district = district;
    if (propertyType) filter.propertyType = propertyType;
    if (transactionType) filter.transactionType = transactionType;
    if (listingType) filter.listingType = listingType;

    // Total count nikalna (pagination ke liye zaroori)
    const totalProperties = await Property.countDocuments(filter);

    // Properties fetch karna - naye listing sabse upar (newest first)
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      total: totalProperties,
      page,
      totalPages: Math.ceil(totalProperties / limit),
      properties,
    });

  } catch (error: any) {
    console.log("Fetch properties error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}