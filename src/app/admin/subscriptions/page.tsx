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

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);

  // Manual activation form
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

  // Admin check - sirf admin hi ye page dekh sake
  useEffect(() => {
    const checkAdminAndFetch = async () => {
      try {
        const meRes = await axios.get("/api/users/me");
        if (!meRes.data.data.isAdmin) {
          toast.error("Access denied. Admins only");
          router.push("/dashboard");
          return;
        }
        fetchData();
      } catch (error) {
        router.push("/login");
      }
    };
    checkAdminAndFetch();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subRes, userRes] = await Promise.all([
        axios.get("/api/admin/subscriptions"),
        axios.get("/api/admin/users"),
      ]);
      setSubscriptions(subRes.data.subscriptions);
      setUsers(userRes.data.users);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Data load nahi ho paya");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId || !state || !district) {
      toast.error("User, State aur District sabhi chunein");
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
      toast.success(response.data.message || "Subscription activate ho gayi");
      // Form reset karke list refresh karna
      setSelectedUserId("");
      setState("");
      setDistrict("");
      setPlanType("Monthly");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Kuch galat ho gaya");
    } finally {
      setActivating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN");
  };

  if (loading) {
    return <div className='p-8 text-center text-lg'>Loading...</div>;
  }

  return (
    <div className='min-h-screen p-6 bg-slate-100'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl font-bold text-orange-900 mb-6'>
          District Subscriptions
        </h1>

        {/* Manual Activation Form */}
        <div className='bg-white rounded-lg shadow p-5 mb-6'>
          <h2 className='text-lg font-bold text-orange-900 mb-4'>
            Manually Subscription Activate Karein
          </h2>
          <form onSubmit={handleActivate} className='grid grid-cols-1 md:grid-cols-5 gap-3'>
            <select
              className='p-2 border border-gray-400 rounded-md text-black'
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Select Customer</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.username} ({u.email})</option>
              ))}
            </select>

            <select
              className='p-2 border border-gray-400 rounded-md text-black'
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select State</option>
              {allStates.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            <select
              className='p-2 border border-gray-400 rounded-md text-black'
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!state}
            >
              <option value="">{state ? "Select District" : "State pehle chunein"}</option>
              {districtList.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              className='p-2 border border-gray-400 rounded-md text-black'
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

        {/* Subscriptions List */}
        <div className='overflow-x-auto bg-white rounded-lg shadow'>
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
                  className={index % 2 === 0 ? "bg-yellow-50" : "bg-white"}
                >
                  <td className='p-3 text-black border border-gray-300'>
                    {sub.user ? `${sub.user.username} (${sub.user.email})` : "Deleted User"}
                  </td>
                  <td className='p-3 text-black border border-gray-300'>{sub.state}</td>
                  <td className='p-3 text-black border border-gray-300'>{sub.district}</td>
                  <td className='p-3 text-black border border-gray-300'>{sub.planType}</td>
                  <td className='p-3 border border-gray-300'>
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
                  <td className='p-3 text-black border border-gray-300'>{formatDate(sub.endDate)}</td>
                  <td className='p-3 text-black border border-gray-300'>
                    {sub.propertiesAddedCount} / {sub.propertyLimit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {subscriptions.length === 0 && (
          <p className='text-center text-gray-500 mt-6'>Koi subscription nahi mili</p>
        )}
      </div>
    </div>
  );
}