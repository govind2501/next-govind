import { redirect } from "next/navigation";
import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";
import { getServerUser } from "@/helpers/getServerUser";
import EditPropertyClient from "./EditPropertyClient";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connect();

  const property = await Property.findById(id);
  if (!property) {
    redirect("/property");
  }

  const currentUser = await getServerUser();
  const isOwner = !!(currentUser && String(currentUser._id) === String(property.owner));

  if (!isOwner && !(currentUser && currentUser.isAdmin)) {
    redirect(`/property/${id}`);
  }

  const propertyData = JSON.parse(JSON.stringify(property));

  return <EditPropertyClient property={propertyData} />;
}