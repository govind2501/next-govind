'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';

// This function does the actual fetching - React Query calls it for us
const fetchUser = async () => {
  const response = await axios.get("/api/users/me");
  return response.data.data;
};

export default function Navbar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // React Query handles loading, caching, and error state automatically.
  // "user" key means: if any other component asks for this same data,
  // it gets the cached result instead of firing a new request.
  const { data: user, isLoading: loading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false, // don't retry if not logged in (401) - that's an expected case, not a network error
  });

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully");
      // Tell React Query the "user" data is now stale/gone, so every
      // component using it (Navbar, Dashboard, etc.) refreshes immediately
      queryClient.setQueryData(["user"], null);
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

        {/* Row 1: Logo on the left, Menu links in the middle, Logout in the far corner */}
        <div className='flex items-center justify-between gap-3'>
          <Link href="/" className='text-base sm:text-lg font-bold shrink-0'>
            🏠 Trade My Property
          </Link>

          <div className='flex items-center gap-3 text-xs sm:text-sm overflow-x-auto whitespace-nowrap scrollbar-hide flex-1 justify-end'>

            <Link href="/property" className='hover:text-orange-300'>
              Browse Properties
            </Link>

            <Link href="/about" className='hover:text-orange-300'>
              About
            </Link>

            <Link href="/contact" className='hover:text-orange-300'>
              Contact
            </Link>

            <Link href="/property/add" className='hover:text-orange-300'>
              Add Property
            </Link>

            <Link href="/dashboard" className='hover:text-orange-300'>
              Dashboard
            </Link>

            {/* Admin links - only show when the logged-in user is an Admin */}
            {!loading && user && user.isAdmin && (
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

            {/* Login and Signup - always visible */}
            <Link href="/login" className='hover:text-orange-300'>
              Login Page
            </Link>
            <Link
              href="/signup"
              className='bg-orange-600 px-2 py-1 rounded-md font-bold text-black hover:bg-orange-700 shrink-0'
            >
              Signup
            </Link>

          </div>

          {/* Logout button - only shown when a user is actually logged in */}
          {!loading && user && (
            <button
              onClick={handleLogout}
              className='bg-orange-600 px-2 py-1 rounded-md font-bold text-black hover:bg-orange-700 shrink-0'
            >
              Logout
            </button>
          )}
        </div>

        {/* Row 2: Search bar on the left, WhatsApp share + Dark mode toggle pinned to the far right */}
        <div className='flex items-center gap-2'>
          <form onSubmit={handleSearch} className='flex-1 min-w-0 sm:w-64 sm:flex-none'>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties..."
              className='w-full px-3 py-1.5 rounded-md text-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400'
            />
          </form>

          <div className='flex items-center gap-2 ml-auto'>
            {/* Share the whole website on WhatsApp - always visible */}
            <a href="https://wa.me/?text=Check%20out%20Trade%20My%20Property%20%E2%80%94%20Buy%2C%20Sell%20%26%20Rent%20properties%20across%20India%3A%20https%3A%2F%2Fwww.trademyproperty.co.in" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full w-7 h-7 shrink-0" title="Share on WhatsApp">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.72.45 3.4 1.32 4.87L2.05 22l5.36-1.41a9.87 9.87 0 0 0 4.63 1.18h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.24 8.23zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.36-.77-1.86-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01a.9.9 0 0 0-.66.31c-.23.24-.86.85-.86 2.07s.89 2.4 1.01 2.56c.13.17 1.75 2.68 4.25 3.75.59.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28z"/>
              </svg>
            </a>

            <ThemeToggle />
          </div>
        </div>

      </div>
    </nav>
  );
}