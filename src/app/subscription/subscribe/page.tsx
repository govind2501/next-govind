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

function SubscribeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Agar Property Detail page se "state" aur "district" URL me aaye hain,
  // to unhe pehle se select kar denge
  const initialState = searchParams.get("state") || "";
  const initialDistrict = searchParams.get("district") || "";

  const [state, setState] = useState(initialState);
  const [district, setDistrict] = useState(initialDistrict);
  const [planType, setPlanType] = useState<"Monthly" | "Quarterly" | "Yearly">("Monthly");
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const allStates = Object.keys(statesDistricts);

  // State change hone par district list update karna
  useEffect(() => {
    if (state && (statesDistricts as any)[state]) {
      setDistrictList((statesDistricts as any)[state]);
    } else {
      setDistrictList([]);
    }
  }, [state]);

  const handleFakePayment = async () => {
    if (!state || !district) {
      toast.error("Please State aur District dono select karein");
      return;
    }

    try {
      setLoading(true);

      // Yahan asli Razorpay/Payment Gateway aayega aage jaake.
      // Abhi ke liye seedha "subscribe" API call kar rahe hain, jaise payment ho chuka ho.
      const response = await axios.post("/api/subscription/subscribe", {
        state,
        district,
        planType,
      });

      toast.success(response.data.message || "Subscription activate ho gayi!");
      router.push("/property");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Subscription nahi ho payi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 bg-slate-100'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-md p-6'>

        <h1 className='text-2xl font-bold text-orange-900 text-center mb-2'>
          Unlock District Details
        </h1>
        <p className='text-gray-600 text-center mb-6 text-sm'>
          Subscription lekar us district ki sabhi properties ke owner ka
          contact number aur poora address dekh sakte hain. Isi district me
          property/requirement add bhi kar sakte hain.
        </p>

        {/* State Selection */}
        <div className='mb-4'>
          <label className='block mb-1 font-semibold text-orange-900'>State</label>
          <select
            className='w-full p-2 border border-gray-500 rounded-md text-black'
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
          <label className='block mb-1 font-semibold text-orange-900'>District</label>
          <select
            className='w-full p-2 border border-gray-500 rounded-md text-black'
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!state}
          >
            <option value="">
              {state ? "Select District" : "Pehle State chunein"}
            </option>
            {districtList.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        {/* Plan Selection */}
        <div className='mb-6'>
          <label className='block mb-2 font-semibold text-orange-900'>Choose Plan</label>
          <div className='flex gap-2'>
            <button
              type="button"
              onClick={() => setPlanType("Monthly")}
              className={`flex-1 p-3 rounded-md border-2 font-bold transition ${
                planType === "Monthly"
                  ? "border-orange-600 bg-orange-100 text-orange-900"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              1 Month
              <div className='text-sm font-normal'>₹{PLAN_PRICES.Monthly}</div>
            </button>

            <button
              type="button"
              onClick={() => setPlanType("Quarterly")}
              className={`flex-1 p-3 rounded-md border-2 font-bold transition ${
                planType === "Quarterly"
                  ? "border-orange-600 bg-orange-100 text-orange-900"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              3 Months
              <div className='text-sm font-normal'>₹{PLAN_PRICES.Quarterly}</div>
            </button>

            <button
              type="button"
              onClick={() => setPlanType("Yearly")}
              className={`flex-1 p-3 rounded-md border-2 font-bold transition ${
                planType === "Yearly"
                  ? "border-orange-600 bg-orange-100 text-orange-900"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              1 Year
              <div className='text-sm font-normal'>₹{PLAN_PRICES.Yearly}</div>
            </button>
          </div>
        </div>

        {/* Fake Payment Button */}
        <button
          onClick={handleFakePayment}
          disabled={loading}
          className='w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 disabled:opacity-50 transition'
        >
          {loading ? "Processing..." : `Pay ₹${PLAN_PRICES[planType]} (Demo)`}
        </button>

        <p className='text-xs text-gray-500 text-center mt-3'>
          ⚠️ Ye ek demo payment hai, abhi koi asli paisa nahi katega.
        </p>
      </div>
    </div>
  );
}

// Suspense wrapper zaroori hai kyunki useSearchParams client-side hook hai
export default function SubscribePage() {
  return (
    <Suspense fallback={<p className='text-center mt-10'>Loading...</p>}>
      <SubscribeForm />
    </Suspense>
  );
}