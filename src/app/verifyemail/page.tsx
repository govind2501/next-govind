'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyemailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const urlEmail = new URLSearchParams(window.location.search).get("email");
    setEmail(urlEmail || "");
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/users/verifyemail', { email, otp });
      toast.success("Email verified successfully!");
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResendLoading(true);
      await axios.post('/api/users/resendotp', { email });
      toast.success("Naya OTP bhej diya gaya");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Kuch galat hua");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-300'>
      <form
        onSubmit={onSubmit}
        className='flex flex-col items-center justify-center py-2 gap-4 text-orange-900 w-full max-w-md p-8'
      >
        <h1 className='text-2xl font-bold'>Verify Email</h1>
        <hr />
        <p className='text-center text-sm'>Aapke email par bheja gaya 6-digit OTP daalein</p>

        <label className='block mb-1 self-start' htmlFor="email">Email</label>
        <input
          className='w-full p-2 border border-gray-500 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-gray-900 text-black'
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Apna email daalein'
          type="email"
        />

        <label className='block mb-1 self-start' htmlFor="otp">OTP</label>
        <input
          className='w-full p-2 border border-gray-500 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-gray-900 text-black tracking-widest text-center text-xl'
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder='______'
          maxLength={6}
          type="text"
        />

        <button
          type="submit"
          disabled={otp.length !== 6 || !email || loading}
          className='w-full text-xl bg-orange-600 font-bold text-black py-2 rounded-md transition'
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          type="button"
          onClick={resendOtp}
          disabled={resendLoading || !email}
          className='underline text-blue-700'
        >
          {resendLoading ? "Sending..." : "Resend OTP"}
        </button>

        <Link href="/login" className='underline text-blue-700'>Go to Login</Link>
      </form>
    </div>
  );
}