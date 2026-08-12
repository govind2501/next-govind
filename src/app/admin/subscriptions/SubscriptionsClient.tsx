'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import statesDistricts from '@/data/statesDistricts.json';

interface UserType {
  _id: string;
  username: string;
  email: string;
}

interface SubscriptionType {
  _id: string;
  user: { _id: string; username: string; email: string } | null;
  state: string;
  district: string;
  planType: string;
  amount: number;
  startDate: string;
  endDate: string;
  computedStatus: "Active" | "Expired" | "Cancelled";
  propertyLimit: number;
  propertiesAddedCount: number;
}

export default function SubscriptionsClient({
  subscriptions,
  users,
}: {
  subscriptions: SubscriptionType[];
  users: UserType[];
}) {
  const router = useRouter();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [planType, setPlanType] = useState<"Monthly" | "Quarterly" | "Yearly">("Monthly");
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [activating, setActivating] = useState(false);

  const allStates = Object.keys(statesDistricts);

  useEffect(() => {
    if (state && (statesDistricts as any)[state]) {
      setDistrictList((statesDistricts as any)[state]);
    } else {
      setDistrictList([]);
    }
    setDistrict("");
  }, [state]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId || !state || !district) {
      toast.error("Please select User, State and District");
      return;
    }

    try {
      setActivating(true);
      const response = await axios.post("/api/admin/subscriptions/activate", {
        userId: selectedUserId,
        state,
        district,
        planType,
      });
      toast.success(response.data.message || "Subscription activated");
      setSelectedUserId("");
      setState("");
      setDistrict("");
      setPlanType("Monthly");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setActivating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN");
  };

  return (
    <div className='min-h-screen p-6'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl font-bold text-white drop-shadow-md mb-6'>
          District Subscriptions
        </h1>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
          <div className='bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-5 text-center border-t-4 border-orange-600'>
            <p className='text-sm text-gray-500 dark:text-gray-400 font-semibold'>Active Monthly</p>
            <p className='text-3xl font-bold text-orange-900 dark:text-orange-300 mt-1'>
              {subscriptions.filter((s) => s.computedStatus === "Active" && s.planType === "Monthly").length}
            </p>
          </div>
          <div className='bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-5 text-center border-t-4 border-orange-600'>
            <p className='text-sm text-gray-500 dark:text-gray-400 font-semibold'>Active Quarterly</p>
            <p className='text-3xl font-bold text-orange-900 dark:text-orange-300 mt-1'>
              {subscriptions.filter((s) => s.computedStatus === "Active" && s.planType === "Quarterly").length}
            </p>
          </div>
          <div className='bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-5 text-center border-t-4 border-orange-600'>
            <p className='text-sm text-gray-500 dark:text-gray-400 font-semibold'>Active Yearly</p>
            <p className='text-3xl font-bold text-orange-900 dark:text-orange-300 mt-1'>
              {subscriptions.filter((s) => s.computedStatus === "Active" && s.planType === "Yearly").length}
            </p>
          </div>
        </div>

        <div className='bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-5 mb-6'>
          <h2 className='text-lg font-bold text-orange-900 dark:text-orange-300 mb-4'>
            Manually Activate a Subscription
          </h2>
          <form onSubmit={handleActivate} className='grid grid-cols-1 md:grid-cols-5 gap-3'>
            <select
              className='p-2 border border-gray-400 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700'
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Select Customer</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.username} ({u.email})</option>
              ))}
            </select>

            <select
              className='p-2 border border-gray-400 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700'
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select State</option>
              {allStates.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            <select
              className='p-2 border border-gray-400 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700'
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!state}
            >
              <option value="">{state ? "Select District" : "Select State First"}</option>
              {districtList.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              className='p-2 border border-gray-400 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700'
              value={planType}
              onChange={(e) => setPlanType(e.target.value as "Monthly" | "Quarterly" | "Yearly")}
            >
              <option value="Monthly">Monthly (₹299)</option>
              <option value="Quarterly">Quarterly (₹599)</option>
              <option value="Yearly">Yearly (₹2200)</option>
            </select>

            <button
              type="submit"
              disabled={activating}
              className='px-4 py-2 bg-orange-600 text-black font-bold rounded-md disabled:opacity-50'
            >
              {activating ? "Activating..." : "Activate"}
            </button>
          </form>
        </div>

        <div className='overflow-x-auto bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl'>
          <table className='w-full text-left text-sm border-collapse'>
            <thead>
              <tr className='bg-orange-800'>
                <th className='p-3 text-white font-bold border border-orange-900'>Customer</th>
                <th className='p-3 text-white font-bold border border-orange-900'>State</th>
                <th className='p-3 text-white font-bold border border-orange-900'>District</th>
                <th className='p-3 text-white font-bold border border-orange-900'>Plan</th>
                <th className='p-3 text-white font-bold border border-orange-900'>Status</th>
                <th className='p-3 text-white font-bold border border-orange-900'>Expiry</th>
                <th className='p-3 text-white font-bold border border-orange-900'>Properties Used</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub, index) => (
                <tr
                  key={sub._id}
                  className={index % 2 === 0 ? "bg-yellow-50 dark:bg-slate-700" : "bg-white dark:bg-slate-800"}
                >
                  <td className='p-3 text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600'>
                    {sub.user ? `${sub.user.username} (${sub.user.email})` : "Deleted User"}
                  </td>
                  <td className='p-3 text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600'>{sub.state}</td>
                  <td className='p-3 text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600'>{sub.district}</td>
                  <td className='p-3 text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600'>{sub.planType}</td>
                  <td className='p-3 border border-gray-300 dark:border-gray-600'>
                    {sub.computedStatus === "Active" && (
                      <span className='text-white font-bold bg-green-600 px-2 py-1 rounded'>Active</span>
                    )}
                    {sub.computedStatus === "Expired" && (
                      <span className='text-white font-bold bg-red-600 px-2 py-1 rounded'>Expired</span>
                    )}
                    {sub.computedStatus === "Cancelled" && (
                      <span className='text-white font-bold bg-gray-600 px-2 py-1 rounded'>Cancelled</span>
                    )}
                  </td>
                  <td className='p-3 text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600'>{formatDate(sub.endDate)}</td>
                  <td className='p-3 text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600'>
                    {sub.propertiesAddedCount} / {sub.propertyLimit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {subscriptions.length === 0 && (
          <div className='bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-6 text-center mt-6'>
            <p className='text-gray-500 dark:text-gray-400'>No subscriptions found</p>
          </div>
        )}
      </div>
    </div>
  );
}