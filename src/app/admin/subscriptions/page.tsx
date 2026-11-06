import Link from "next/link";
import { redirect } from "next/navigation";
import { connect } from "@/dbConfig/dbConfig";
import Subscription from "@/models/Subscriptionmodels";
import User from "@/models/userModels";
import { getServerUser } from "@/helpers/getServerUser";
import SubscriptionsClient from "./SubscriptionsClient";

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  // Server-side admin check - runs before any HTML is even sent to the browser
  const currentUser = await getServerUser();

  if (!currentUser || !currentUser.isAdmin) {
    redirect("/dashboard");
  }

  // Which tab is selected: "active" (default), "expired" or "all"
  const { status } = await searchParams;
  const filter = status === "expired" || status === "all" ? status : "active";

  await connect();

  // Fetch subscriptions directly from the database (no API route needed here)
  const subscriptionsRaw = await Subscription.find({})
    .populate("user", "username email")
    .sort({ createdAt: -1 });

  // Compute the real status (Active/Expired/Cancelled) based on endDate
  const now = new Date();
  const allSubscriptions = JSON.parse(JSON.stringify(subscriptionsRaw)).map(
    (sub: any) => {
      const isExpired = new Date(sub.endDate) < now;
      return {
        ...sub,
        computedStatus:
          sub.status === "Cancelled"
            ? "Cancelled"
            : isExpired
            ? "Expired"
            : "Active",
      };
    }
  );

  const activeSubscriptions = allSubscriptions.filter(
    (sub: any) => sub.computedStatus === "Active"
  );
  const inactiveSubscriptions = allSubscriptions.filter(
    (sub: any) => sub.computedStatus !== "Active"
  );

  // Hidden records are not deleted: they are only filtered out of this view
  const subscriptions =
    filter === "all"
      ? allSubscriptions
      : filter === "expired"
      ? inactiveSubscriptions
      : activeSubscriptions;

  const tabs = [
    {
      key: "active",
      label: "Active",
      count: activeSubscriptions.length,
      href: "/admin/subscriptions",
    },
    {
      key: "expired",
      label: "Expired & Cancelled",
      count: inactiveSubscriptions.length,
      href: "/admin/subscriptions?status=expired",
    },
    {
      key: "all",
      label: "All",
      count: allSubscriptions.length,
      href: "/admin/subscriptions?status=all",
    },
  ];

  // Fetch all non-admin users for the activation form's dropdown.
  // Passwords and all private tokens are never sent to the browser.
  const usersRaw = await User.find({ isAdmin: false }).select(
    "-password -forgotPasswordToken -forgotPasswordTokenExpiry -VerifyToken -VerifyTokenExpiry -pendingEmailToken -pendingEmailTokenExpiry"
  );
  const users = JSON.parse(JSON.stringify(usersRaw));

  // Pass the server-fetched data down to the interactive Client Component
  return (
    <>
      <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-3 pt-4">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={
              filter === tab.key
                ? "rounded-md bg-orange-600 px-3 py-1 text-sm font-bold text-black"
                : "rounded-md border bg-orange-600  border-orange-600 px-3 py-1 text-sm text-black font-bold hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-slate-700"
            }
          >
            {tab.label} ({tab.count})
          </Link>
        ))}
      </div>
      <SubscriptionsClient subscriptions={subscriptions} users={users} />
    </>
  );
}