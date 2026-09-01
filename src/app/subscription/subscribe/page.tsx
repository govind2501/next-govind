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

function SubscribeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // If "state" and "district" arrived in the URL from the Property Detail page,
  // pre-select them
  const initialState = searchParams.get("state") || "";
  const initialDistrict = searchParams.get("district") || "";

  const [step, setStep] = useState<"select" | "checkout">("select");
  const [state, setState] = useState(initialState);
  const [district, setDistrict] = useState(initialDistrict);
  const [planType, setPlanType] = useState<"Monthly" | "Quarterly" | "Yearly">("Monthly");
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const allStates = Object.keys(statesDistricts);

  // Update the district list whenever the state changes
  useEffect(() => {
    if (state && (statesDistricts as any)[state]) {
      setDistrictList((statesDistricts as any)[state]);
    } else {
      setDistrictList([]);
    }
  }, [state]);

  // "Add to Cart" - just validates the selection and moves to the checkout step
  const handleAddToCart = () => {
    if (!state || !district) {
      toast.error("Please select both State and District");
      return;
    }
    setStep("checkout");
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // A real Razorpay/Payment Gateway will go here in the future.
      // For now, calling the "subscribe" API directly, as if payment succeeded.
      const response = await axios.post("/api/subscription/subscribe", {
        state,
        district,
        planType,
      });

      toast.success(response.data.message || "Subscription activated!");
      router.push("/property");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Subscription failed");
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

            {/* State Selection */}
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

            {/* District Selection */}
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

            {/* Plan Selection - like choosing a product variant */}
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

            {/* Add to Cart button - moves to the checkout summary */}
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

            {/* Cart summary - product/service, price shown clearly */}
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

            {/* Proceed to Pay - the actual checkout action */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className='w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 disabled:opacity-50 transition'
            >
              {loading ? "Processing..." : `Proceed to Pay ₹${price}`}
            </button>

            <p className='text-xs text-gray-500 dark:text-gray-400 text-center mt-3'>
              ⚠️ This is a demo payment, no real money will be charged.
            </p>
          </>
        )}

      </div>
    </div>
  );
}

// Suspense wrapper is required because useSearchParams is a client-side hook
export default function SubscribePage() {
  return (
    <Suspense fallback={<p className='text-center mt-10'>Loading...</p>}>
      <SubscribeForm />
    </Suspense>
  );
}