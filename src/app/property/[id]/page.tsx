import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import Subscription from "@/models/Subscriptionmodels";
import { getServerUser } from "@/helpers/getServerUser";
import PropertyDetailClient from "./PropertyDetailClient";

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
      <div className='min-h-screen flex items-center justify-center bg-slate-100'>
        <p className='text-gray-600 text-lg'>Property not found</p>
      </div>
    );
  }

  // Check if the current user (if logged in) has a subscription for this district
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

  // Hide sensitive contact details if there's no access
  if (!hasAccess) {
    propertyData.contactPhone = null;
    propertyData.address = null;
    propertyData.ownerName = "Locked";
    propertyData.ownerEmail = null;
  }

  return <PropertyDetailClient property={propertyData} hasAccess={hasAccess} />;
}