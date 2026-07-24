    'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/users/resetpassword', { token, newPassword });
      toast.success("Password reset ho gaya, ab login karein");
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-300'>
      <form
        onSubmit={onSubmit}
        className='flex flex-col items-center justify-center py-2 gap-4 text-orange-900 w-full max-w-md p-8'
      >
        <h1 className='text-2xl font-bold'>
          {loading ? "Processing..." : "Reset Password"}
        </h1>
        <hr />

        <label className='block mb-1 self-start' htmlFor="newPassword">Naya Password</label>
        <input
          className='w-full p-2 border border-gray-500 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-gray-900 text-black'
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder='Naya password daalein'
          type="password"
        />

        <button
          type="submit"
          disabled={newPassword.length < 6 || !token || loading}
          className='w-full text-xl bg-orange-600 font-bold text-black py-2 rounded-md transition'
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}