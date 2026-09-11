'use client'

import React from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Same fetch function as Navbar - since the queryKey ("users") matches,
// React Query treats this as the exact same data, no duplicate API call
const fetchUser = async () => {
  const response = await axios.get('/api/users/me');
  return response.data.data;
};

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading: loading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      toast.success('Logout successful');
      // Clears the shared "user" cache - Navbar updates instantly too
      queryClient.setQueryData(["user"], null);
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl px-8 py-6'>
          <p className='text-xl text-orange-900 dark:text-orange-300'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-12'>
      <div className='bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 flex flex-col items-center gap-4'>

        <h1 className='text-3xl font-bold text-orange-900 dark:text-orange-300'>Dashboard</h1>
        <hr className='w-1/2 border-gray-300 dark:border-gray-600' />

        {user ? (
          <div className='w-full text-black dark:text-gray-100 flex flex-col gap-2'>
            <p><span className='font-bold'>Username:</span> {user.username}</p>
            <p><span className='font-bold'>Email:</span> {user.email}</p>
            <p><span className='font-bold'>User ID:</span> {user._id}</p>
            <p><span className='font-bold'>Verified:</span> {user.isVerified ? "Yes" : "No"}</p>
          </div>
        ) : (
          <p className='dark:text-gray-200'>User data not found</p>
        )}

        <button
          onClick={logout}
          className='w-full bg-orange-600 text-black font-bold py-2 px-6 rounded-md hover:bg-orange-700 transition'
        >
          Logout
        </button>
      </div>
    </div>
  );
}