import { redirect } from "next/navigation";
import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import { getServerUser } from "@/helpers/getServerUser";
import PropertiesClient from "./PropertiesClient";

export default async function AdminPropertiesPage() {
  // Server-side admin check
  const currentUser = await getServerUser();

  if (!currentUser || !currentUser.isAdmin) {
    redirect("/dashboard");
  }

  await connect();

  // Fetch pending properties directly from the database
  const propertiesRaw = await Property.find({ status: "Pending" })
    .sort({ createdAt: -1 });

  const properties = JSON.parse(JSON.stringify(propertiesRaw));

  return <PropertiesClient initialProperties={properties} />;
}