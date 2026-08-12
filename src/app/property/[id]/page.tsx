import type { Metadata } from "next";
import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import Subscription from "@/models/Subscriptionmodels";
import { getServerUser } from "@/helpers/getServerUser";
import PropertyDetailClient from "./PropertyDetailClient";

// This function runs before the page renders and sets the <title>,
// meta description, and social-share preview for this specific property
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  await connect();
  const property = await Property.findById(id);

  if (!property || property.status !== "Approved") {
    return {
      title: "Property Not Found — Trade My Property",
      description: "This property listing is not available.",
    };
  }

  const isBuyer = property.listingType === "BuyerRequirement";

  // Build a title like "3 BHK House for Sale in Lucknow — Trade My Property"
  const action = isBuyer
    ? (property.transactionType === "Rent" ? "Wanted for Rent" : "Wanted to Buy")
    : (property.transactionType === "Rent" ? "for Rent" : "for Sale");

  const bhkPart = property.bedrooms ? `${property.bedrooms} BHK ` : "";
  const title = `${bhkPart}${property.propertyType} ${action} in ${property.district}, ${property.state} — Trade My Property`;

  const description = property.description
    ? property.description.slice(0, 155)
    : `${property.propertyType} ${action} in ${property.district}, ${property.state}. Price: ₹${Number(property.price).toLocaleString('en-IN')}. View details on Trade My Property.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: property.images && property.images.length > 0 ? [property.images[0]] : [],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connect();

  const property = await Property.findById(id);

  if (!property || property.status !== "Approved") {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-6'>
          <p className='text-gray-600 dark:text-gray-300 text-lg'>Property not found</p>
        </div>
      </div>
    );
  }

  const currentUser = await getServerUser();
  let hasAccess = false;

  if (currentUser) {
    if (currentUser.isAdmin) {
      hasAccess = true;
    } else {
      const activeSubscription = await Subscription.findOne({
        user: currentUser._id,
        state: property.state,
        district: property.district,
        status: "Active",
        endDate: { $gte: new Date() },
      });
      hasAccess = !!activeSubscription;
    }
  }

  const propertyData = JSON.parse(JSON.stringify(property));

  if (!hasAccess) {
    propertyData.contactPhone = null;
    propertyData.address = null;
    propertyData.ownerName = "Locked";
    propertyData.ownerEmail = null;
  }

  return <PropertyDetailClient property={propertyData} hasAccess={hasAccess} />;
}