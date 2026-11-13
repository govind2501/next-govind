import Link from "next/link";
import { PLAN_CONFIG } from "@/lib/plans";

export const metadata = {
  title: "Pricing | Trade My Property",
  description:
    "District-wise subscription plans for Trade My Property: Monthly, Quarterly and Yearly.",
};

const PLAN_NAMES = Object.keys(PLAN_CONFIG) as (keyof typeof PLAN_CONFIG)[];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex items-start justify-center px-3 sm:px-4 pt-8 pb-32">
      <div className="w-full max-w-3xl bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-orange-900 dark:text-orange-300 text-center mb-2">
          Subscription Plans
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6 text-sm">
          Subscriptions are district-wise. A subscription lets you view the
          owner&apos;s contact number and full address for all properties in the
          selected district, and add a property or requirement in that district.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLAN_NAMES.map((name) => {
            const plan = PLAN_CONFIG[name];
            return (
              <div
                key={name}
                className="border border-orange-200 dark:border-slate-600 rounded-xl p-4 text-center"
              >
                <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-300">
                  {name}
                </h2>
                <p className="text-3xl font-bold text-gray-900 dark:text-white my-2">
                  ₹{plan.amount.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  for {plan.months} {plan.months === 1 ? "month" : "months"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Up to {plan.propertyLimit} property listings
                </p>
              </div>
            );
          })}
        </div>

        <ul className="mt-6 text-sm text-gray-600 dark:text-gray-300 list-disc pl-5 space-y-1">
          <li>All prices are in Indian Rupees (INR) and are for one district.</li>
          <li>
            Subscription payments are non-refundable. Please read our{" "}
            <Link href="/refund-policy" className="underline text-orange-800 dark:text-orange-300">
              Refund Policy
            </Link>
            .
          </li>
        </ul>

        <div className="text-center mt-6">
          <Link
            href="/subscription/subscribe"
            className="inline-block bg-orange-700 hover:bg-orange-800 text-white font-semibold px-6 py-2 rounded-lg"
          >
            Subscribe Now
          </Link>
        </div>
      </div>
    </div>
  );
}