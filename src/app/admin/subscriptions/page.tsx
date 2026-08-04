import { redirect } from "next/navigation";
import { connect } from "@/dbConfig/dbConfig";
import Subscription from "@/models/Subscriptionmodels";
import User from "@/models/userModels";
import { getServerUser } from "@/helpers/getServerUser";
import SubscriptionsClient from "./SubscriptionsClient";

export default async function AdminSubscriptionsPage() {
  // Server-side admin check - runs before any HTML is even sent to the browser
  const currentUser = await getServerUser();

  if (!currentUser || !currentUser.isAdmin) {
    redirect("/dashboard");
  }

  await connect();

  // Fetch subscriptions directly from the database (no API route needed here)
  const subscriptionsRaw = await Subscription.find({})
    .populate("user", "username email")
    .sort({ createdAt: -1 });

  // Compute the real status (Active/Expired/Cancelled) based on endDate
  const now = new Date();
  const subscriptions = JSON.parse(JSON.stringify(subscriptionsRaw)).map((sub: any) => {
    const isExpired = new Date(sub.endDate) < now;
    return {
      ...sub,
      computedStatus:
        sub.status === "Cancelled" ? "Cancelled" : isExpired ? "Expired" : "Active",
    };
  });

  // Fetch all non-admin users for the activation form's dropdown
  const usersRaw = await User.find({ isAdmin: false }).select(
    "-password -forgotPasswordToken -forgotPasswordTokenExpiry -VerifyToken -VerifyTokenExpiry"
  );
  const users = JSON.parse(JSON.stringify(usersRaw));

  // Pass the server-fetched data down to the interactive Client Component
  return <SubscriptionsClient subscriptions={subscriptions} users={users} />;
}