'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null); // null = logged out

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/users/me");
      setUser(response.data.data);
    } catch (error) {
      setUser(null); // token nahi hai ya invalid hai
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout ho gaya");
      setUser(null);
      router.push("/login");
    } catch (error: any) {
      toast.error("Logout me error aaya");
    }
  };

  return (
    <nav className='bg-orange-900 text-white px-4 py-3 shadow-md'>
      <div className='max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3'>

        {/* Logo / Home */}
        <Link href="/" className='text-xl font-bold'>
          🏠 next-govind
        </Link>

        {/* Nav Links */}
        <div className='flex flex-wrap items-center gap-4 text-sm sm:text-base'>

          <Link href="/property" className='hover:text-orange-300'>
            Browse Properties
          </Link>

          {!loading && user && (
            <>
              <Link href="/property/add" className='hover:text-orange-300'>
                Add Property
              </Link>

              <Link href="/dashboard" className='hover:text-orange-300'>
                Dashboard
              </Link>

            {/* Admin links - sirf tab dikhenge jab user Admin ho */}
              {user.isAdmin && (
                <>
                  <Link href="/admin/properties" className='hover:text-orange-300 font-semibold text-yellow-300'>
                    Admin Panel
                  </Link>
                  <Link href="/admin/subscriptions" className='hover:text-orange-300 font-semibold text-yellow-300'>
                    Subscriptions
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className='bg-orange-600 px-3 py-1 rounded-md font-bold text-black hover:bg-orange-700'
              >
                Logout
              </button>
            </>
          )}

          {!loading && !user && (
            <>
              <Link href="/login" className='hover:text-orange-300'>
                Login
              </Link>
              <Link
                href="/signup"
                className='bg-orange-600 px-3 py-1 rounded-md font-bold text-black hover:bg-orange-700'
              >
                Signup
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}
