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
      setUser(null); // no token, or it's invalid
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
      toast.success("Logged out successfully");
      setUser(null);
      router.push("/login");
    } catch (error: any) {
      toast.error("Error while logging out");
    }
  };

  return (
    <nav className='bg-orange-900 text-white px-4 py-3 shadow-md'>
      <div className='max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3'>

        {/* Logo / Home */}
        <Link href="/" className='text-xl font-bold'>
          🏠 Trade My Property
        </Link>

        {/* Nav Links */}
        <div className='flex flex-wrap items-center gap-4 text-sm sm:text-base'>

         <Link href="/property" className='hover:text-orange-300'>
            Browse Properties
          </Link>

          <Link href="/about" className='hover:text-orange-300'>
            About
          </Link>

          <Link href="/contact" className='hover:text-orange-300'>
            Contact
          </Link>

          {!loading && user && (
            <>
              <Link href="/property/add" className='hover:text-orange-300'>
                Add Property
              </Link>

              <Link href="/dashboard" className='hover:text-orange-300'>
                Dashboard
              </Link>

       {/* Admin links - only show when the user is an Admin */}
              {user.isAdmin && (
                <>
                  <Link href="/admin/properties" className='hover:text-orange-300 font-semibold text-yellow-300'>
                    Admin Panel
                  </Link>
                  <Link href="/admin/subscriptions" className='hover:text-orange-300 font-semibold text-yellow-300'>
                    Subscriptions
                  </Link>
                  <Link href="/admin/analytics" className='hover:text-orange-300 font-semibold text-yellow-300'>
                    Analytics
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