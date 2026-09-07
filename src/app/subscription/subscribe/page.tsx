'use client'

import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import statesDistricts from '@/data/statesDistricts.json';

// Fixed prices - same as backend, only for showing on screen
const PLAN_PRICES = {
  Monthly: 299,
  Quarterly: 599,
  Yearly: 2200,
};

const PLAN_LABELS = {
  Monthly: "1 Month",
  Quarterly: "3 Months",
  Yearly: "1 Year",
};

// Razorpay injects this on `window` once the checkout.js script (loaded in
// layout.tsx) has finished loading
declare global {
  interface Window {
    Razorpay: any;
  }
}

function SubscribeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialState = searchParams.get("state") || "";
  const initialDistrict = searchParams.get("district") || "";

  const [step, setStep] = useState<"select" | "checkout">("select");
  const [state, setState] = useState(initialState);
  const [district, setDistrict] = useState(initialDistrict);
  const [planType, setPlanType] = useState<"Monthly" | "Quarterly" | "Yearly">("Monthly");
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const allStates = Object.keys(statesDistricts);

  useEffect(() => {
    if (state && (statesDistricts as any)[state]) {
      setDistrictList((statesDistricts as any)[state]);
    } else {
      setDistrictList([]);
    }
  }, [state]);

  const handleAddToCart = () => {
    if (!state || !district) {
      toast.error("Please select both State and District");
      return;
    }
    setStep("checkout");
  };

  // Opens the real Razorpay payment popup
  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1. Ask our backend to create a Razorpay order for this amount
      const orderResponse = await axios.post("/api/payment/create-order", {
        amount: price,
      });
      const order = orderResponse.data;

      // 2. Configure and open the Razorpay Checkout popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Trade My Property",
        description: `District Subscription — ${PLAN_LABELS[planType]} (${district}, ${state})`,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Payment succeeded on Razorpay's side - now activate the subscription
          try {
            const subResponse = await axios.post("/api/subscription/subscribe", {
              state,
              district,
              planType,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success(subResponse.data.message || "Subscription activated!");
            router.push("/property");
          } catch (error: any) {
            toast.error(error.response?.data?.error || "Payment succeeded but activation failed. Please contact support.");
          }
        },
        theme: {
          color: "#c2410c", // matches the site's orange-600 brand color
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not start payment");
    } finally {
      setLoading(false);
    }
  };

  const price = PLAN_PRICES[planType];

  return (
    <div className='min-h-screen flex items-center justify-center px-3 sm:px-4 py-8'>
      <div className='w-full max-w-md bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-6'>

        {step === "select" && (
          <>
            <h1 className='text-2xl font-bold text-orange-900 dark:text-orange-300 text-center mb-2'>
              Unlock District Details
            </h1>
            <p className='text-gray-600 dark:text-gray-300 text-center mb-6 text-sm'>
              Subscribe to view the owner's contact number and full address for
              all properties in that district. You can also add a
              property/requirement in the same district.
            </p>

            <div className='mb-4'>
              <label className='block mb-1 font-semibold text-orange-900 dark:text-orange-300'>State</label>
              <select
                className='w-full p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700'
                value={state}
                onChange={(e) => { setState(e.target.value); setDistrict(""); }}
              >
                <option value="">Select State</option>
                {allStates.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className='mb-4'>
              <label className='block mb-1 font-semibold text-orange-900 dark:text-orange-300'>District</label>
              <select
                className='w-full p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700'
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!state}
              >
                <option value="">
                  {state ? "Select District" : "Select State First"}
                </option>
                {districtList.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <div className='mb-6'>
              <label className='block mb-2 font-semibold text-orange-900 dark:text-orange-300'>Choose Plan</label>
              <div className='flex flex-col gap-2'>
                {(["Monthly", "Quarterly", "Yearly"] as const).map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => setPlanType(plan)}
                    className={`flex justify-between items-center p-3 rounded-md border-2 font-bold transition ${
                      planType === plan
                        ? "border-orange-600 bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-200"
                        : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <span>District Access — {PLAN_LABELS[plan]}</span>
                    <span>₹{PLAN_PRICES[plan]}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className='w-full bg-orange-600 text-black font-bold py-3 rounded-md hover:bg-orange-700 transition'
            >
              🛒 Add to Cart
            </button>
          </>
        )}

        {step === "checkout" && (
          <>
            <h1 className='text-2xl font-bold text-orange-900 dark:text-orange-300 text-center mb-2'>
              Checkout
            </h1>
            <p className='text-gray-600 dark:text-gray-300 text-center mb-6 text-sm'>
              Review your order before payment
            </p>

            <div className='border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4'>
              <div className='flex justify-between items-start mb-3 pb-3 border-b border-gray-200 dark:border-gray-600'>
                <div>
                  <p className='font-bold text-orange-900 dark:text-orange-300'>
                    District Subscription — {PLAN_LABELS[planType]}
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    {district}, {state}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    Qty: 1
                  </p>
                </div>
                <span className='font-bold text-green-700 dark:text-green-400 shrink-0'>
                  ₹{price}
                </span>
              </div>

              <div className='flex justify-between text-sm text-gray-700 dark:text-gray-200 mb-1'>
                <span>Subtotal</span>
                <span>₹{price}</span>
              </div>
              <div className='flex justify-between text-sm text-gray-700 dark:text-gray-200 mb-3'>
                <span>Taxes/Fees</span>
                <span>₹0</span>
              </div>
              <div className='flex justify-between text-lg font-bold text-orange-900 dark:text-orange-300 pt-2 border-t border-gray-200 dark:border-gray-600'>
                <span>Total</span>
                <span>₹{price}</span>
              </div>
            </div>

            <button
              onClick={() => setStep("select")}
              className='w-full text-sm text-orange-700 dark:text-orange-300 font-semibold mb-3 hover:underline'
            >
              ← Edit selection
            </button>

            <button
              onClick={handlePayment}
              disabled={loading}
              className='w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 disabled:opacity-50 transition'
            >
              {loading ? "Processing..." : `Proceed to Pay ₹${price}`}
            </button>

            <p className='text-xs text-gray-500 dark:text-gray-400 text-center mt-3'>
              🔒 Secured by Razorpay
            </p>
          </>
        )}

      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<p className='text-center mt-10'>Loading...</p>}>
      <SubscribeForm />
    </Suspense>
  );
}