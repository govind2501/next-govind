import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import BrowsePropertiesClient from "./BrowsePropertiesClient";

export default async function BrowsePropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const state = params.state || "";
  const district = params.district || "";
  const propertyType = params.propertyType || "";
  const transactionType = params.transactionType || "";
  const listingType = params.listingType || "";
  const search = params.search || "";
  const page = parseInt(params.page || "1");
  const limit = 10;
  const skip = (page - 1) * limit;

  await connect();

  const filter: any = { status: "Approved" };
  if (state) filter.state = state;
  if (district) filter.district = district;
  if (propertyType) filter.propertyType = propertyType;
  if (transactionType) filter.transactionType = transactionType;
  if (listingType) filter.listingType = listingType;

  // Search by title, matching partial words, case-insensitive
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const totalProperties = await Property.countDocuments(filter);

  const propertiesRaw = await Property.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const properties = JSON.parse(JSON.stringify(propertiesRaw));
  const totalPages = Math.ceil(totalProperties / limit);

  return (
    <BrowsePropertiesClient
      properties={properties}
      totalPages={totalPages}
      currentPage={page}
      currentFilters={{ state, district, propertyType, transactionType, listingType }}
    />
  );
}