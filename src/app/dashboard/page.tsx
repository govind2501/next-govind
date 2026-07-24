'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';  

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      toast.success('Logout successful');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get('/api/users/me');
      setUser(response.data.data);
    } catch (error: any) {
      toast.error("Unable to load user data");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-300'>
        <p className='text-xl text-orange-900'>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className='min-h-screen flex flex-col items-center justify-center bg-slate-300 text-orange-900 gap-4'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <hr className='w-1/2' />

        {user ? (
          <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-md text-black'>
            <p><span className='font-bold'>Username:</span> {user.username}</p>
            <p><span className='font-bold'>Email:</span> {user.email}</p>
            <p><span className='font-bold'>User ID:</span> {user._id}</p>
            <p><span className='font-bold'>Verified:</span> {user.isVerified ? "Yes" : "No"}</p>
          </div>
        ) : (
          <p>User data not found</p>
        )}

        <button
          onClick={logout}
          className='bg-orange-600 text-black font-bold py-2 px-6 rounded-md'
        >
          Logout
        </button>
      </div>
    </>
  );
}