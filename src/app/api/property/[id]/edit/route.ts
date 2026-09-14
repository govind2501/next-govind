import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;

    const userId = await getDataFromToken(request);
    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (String(property.owner) !== String(userId)) {
      return NextResponse.json(
        { error: "Not authorized to edit this property" },
        { status: 403 }
      );
    }

    const reqBody = await request.json();
    const { images, video, contactPhone, price, priceUnit } = reqBody;

    if (!contactPhone || !price) {
      return NextResponse.json(
        { error: "Phone and price are required" },
        { status: 400 }
      );
    }

    property.images = images;
    property.video = video;
    property.contactPhone = contactPhone;
    property.price = price;
    property.priceUnit = priceUnit;
    property.status = "Pending";

    await property.save();

    return NextResponse.json({
      message: "Property updated successfully! Waiting for admin re-approval.",
      success: true,
    });
  } catch (error: any) {
    console.log("Property edit error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}