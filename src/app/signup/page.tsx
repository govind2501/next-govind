'use client'
import { Eye, EyeOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation'
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Username check ke liye naye states
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  const onSignup = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user)
      console.log("signup success", response.data);
      toast.success("signup successful");
    } catch (error: any) {
      console.log("Signup failed");
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
     //await router.push("/login");

      await router.push(`/verifyemail?email=${encodeURIComponent(user.email)}`);
  }

  // Overall form validity
  useEffect(() => {
    if (
      user.username.length > 2 &&
      user.email.length > 5 &&
      user.password.length > 5 &&
      usernameStatus === "available"
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user, usernameStatus])

    
  useEffect(() => {
    if (user.username.trim().length < 3) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(`/api/users/checkusername?username=${encodeURIComponent(user.username.trim())}`);
        setUsernameStatus(response.data.available ? "available" : "taken");
      } catch (error) {
        setUsernameStatus("idle");
      }
    }, 500); // 500ms rukega taaki har keystroke par call na ho

    return () => clearTimeout(timer);
  }, [user.username]);

  return (
    <div className=' min-h-screen flex items-center justify-center'>
      <div className=' w-full max-w-md p-8 rounded-lg shadow-md'>

        <form onSubmit={onSignup}
          className='flex flex-col items-center justify-center min-h-screen py-2 bg-slate-300 text-orange-900' >

          <h1>{loading ? "Processing..." : "Signup Page"}</h1>

          <hr />
          <label className='block mb-1' htmlFor="username">username</label>
          <input
            className=' w-full p-2 border border-gray-500 rounded-md mb-1 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-gray-900 text-black'
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder='username'
            type="text" />

          {/* Username status message */}
          <div className='w-full mb-4 h-5 text-sm'>
            {usernameStatus === "checking" && <span className='text-gray-600'>Checking...</span>}
            {usernameStatus === "available" && <span className='text-green-700 font-bold'>✓ User name  is available </span>}
            {usernameStatus === "taken" && <span className='text-red-700 font-bold'>✗  This user name is already have been taken try again </span>}
          </div>

          <div className='flex flex-col items-center justify-center  py-2 bg-slate-300 text-orange-900'>
            <label className="block mb-1" htmlFor="email">Email</label>
            <input
              className=' w-full p-2 border border-gray-500 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-gray-900 text-black'
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder='Enter email'
              type="email" />
          </div>

          <div className='flex flex-col items-center justify-center py-2 bg-slate-300 text-orange-900'>
  <label className='block mb-1' htmlFor="password">password</label>
  <div className='relative w-full'>
    <input
      className='w-full p-2 pr-10 border border-gray-500 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-gray-900 text-black'
      id="password"
      type={showPassword ? "text" : "password"}
      value={user.password}
      onChange={(e) => setUser({ ...user, password: e.target.value })}
      placeholder='password'
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-600'
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
</div>

          <button
            type="submit"
            disabled={buttonDisabled}
            className="w-full text-2xl bg-orange-600 font-bold text-black py-2 rounded-md  transition"
          >
            {buttonDisabled ? "No Signup" : "Signup"}
          </button>
          <Link href="/login">Visit login page </Link>

        </form>
      </div>
    </div>
  )
}