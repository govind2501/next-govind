'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null); // null = logged out
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/property?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/property');
    }
  };

  return (
    <nav className='fixed top-0 left-0 w-full z-50 bg-orange-900 text-white shadow-md'>
      <div className='max-w-6xl mx-auto px-3 py-2 flex flex-col gap-2'>

        {/* Row 1: Logo on the left, Menu links + Theme toggle on the right */}
        <div className='flex items-center justify-between gap-3'>
          <Link href="/" className='text-base sm:text-lg font-bold shrink-0'>
            🏠 Trade My Property
          </Link>

          <div className='flex items-center gap-3 text-xs sm:text-sm overflow-x-auto whitespace-nowrap scrollbar-hide'>

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
                      Admin
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
                  className='bg-orange-600 px-2 py-1 rounded-md font-bold text-black hover:bg-orange-700 shrink-0'
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
                  className='bg-orange-600 px-2 py-1 rounded-md font-bold text-black hover:bg-orange-700 shrink-0'
                >
                  Signup
                </Link>
              </>
            )}

            <ThemeToggle />

          </div>
        </div>

        {/* Row 2: Search bar - sits right below the logo */}
        <form onSubmit={handleSearch} className='w-full sm:w-64'>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search properties..."
            className='w-full px-3 py-1.5 rounded-md text-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400'
          />
        </form>

      </div>
    </nav>
  );
}