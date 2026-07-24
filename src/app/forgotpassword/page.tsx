'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/users/forgotpassword', { email });
      toast.success("Reset email sent, apna inbox check karein");
      setSent(true);
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
          {loading ? "Processing..." : "Forgot Password"}
        </h1>
        <hr />

        {sent ? (
          <p className='text-center'>
            If this email is registered , You will recive a reset link . Please check both your inbox and spam folder .
          </p>
        ) : (
          <>
            <label className='block mb-1 self-start' htmlFor="email">Email</label>
            <input
              className='w-full p-2 border border-gray-500 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-gray-900 text-black'
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Apna email daalein'
              type="email"
            />

            <button
              type="submit"
              disabled={email.length < 5 || loading}
              className='w-full text-xl bg-orange-600 font-bold text-black py-2 rounded-md transition'
            >
              Send Reset Link
            </button>
          </>
        )}
      </form>
    </div>
  );
}