'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import statesDistricts from '@/data/statesDistricts.json';

export default function BrowsePropertyPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    propertyType: "",
    transactionType: "",
    listingType: "", // "" = All, "Sell" = Seller listings, "BuyerRequirement" = Buyer requirements
  });

  const [districtList, setDistrictList] = useState<string[]>([]);
  const allStates = Object.keys(statesDistricts);

  // State change hone par District list update karna
  useEffect(() => {
    if (filters.state && (statesDistricts as any)[filters.state]) {
      setDistrictList((statesDistricts as any)[filters.state]);
    } else {
      setDistrictList([]);
    }
    setFilters((prev) => ({ ...prev, district: "" }));
  }, [filters.state]);

  // Properties fetch karna - jab bhi filters ya page change ho
  const fetchProperties = async () => {
    try {
      setLoading(true);

      // Sirf wahi filters bhejo jo khali nahi hain
      const params: any = { page };
      if (filters.state) params.state = filters.state;
      if (filters.district) params.district = filters.district;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.transactionType) params.transactionType = filters.transactionType;
      if (filters.listingType) params.listingType = filters.listingType;

      const response = await axios.get("/api/property/all", { params });

      setProperties(response.data.properties);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      console.log("Error fetching properties:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters, page]);

  return (
    <div className='min-h-screen px-3 sm:px-4 py-6 sm:py-8 bg-slate-100'>
      <div className='max-w-6xl mx-auto'>

        <h1 className='text-2xl sm:text-3xl font-bold text-orange-900 mb-4 sm:mb-6 text-center'>
          Browse Properties
        </h1>

        {/* Listing Type Toggle - Sell vs Buyer Requirement vs All */}
        <div className='flex justify-center gap-2 mb-4'>
          <button
            onClick={() => { setFilters({ ...filters, listingType: "" }); setPage(1); }}
            className={`px-4 py-2 rounded-md font-semibold border-2 ${
              filters.listingType === ""
                ? "bg-orange-600 text-black border-orange-700"
                : "bg-white text-gray-700 border-gray-400"
            }`}
          >
            All
          </button>
          <button
            onClick={() => { setFilters({ ...filters, listingType: "Sell" }); setPage(1); }}
            className={`px-4 py-2 rounded-md font-semibold border-2 ${
              filters.listingType === "Sell"
                ? "bg-orange-600 text-black border-orange-700"
                : "bg-white text-gray-700 border-gray-400"
            }`}
          >
            Sellers
          </button>
          <button
            onClick={() => { setFilters({ ...filters, listingType: "BuyerRequirement" }); setPage(1); }}
            className={`px-4 py-2 rounded-md font-semibold border-2 ${
              filters.listingType === "BuyerRequirement"
                ? "bg-orange-600 text-black border-orange-700"
                : "bg-white text-gray-700 border-gray-400"
            }`}
          >
            Buyers
          </button>
        </div>

        {/* Filters - stacks into 2 columns on mobile, 4 on larger screens */}
        <div className='bg-slate-300 p-3 sm:p-4 rounded-lg shadow-md mb-6 grid grid-cols-2 md:grid-cols-4 gap-3'>

          <select
            className='p-2 border border-gray-500 rounded-md text-black text-sm sm:text-base w-full'
            value={filters.state}
            onChange={(e) => { setFilters({ ...filters, state: e.target.value }); setPage(1); }}
          >
            <option value="">All States</option>
            {allStates.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <select
            className='p-2 border border-gray-500 rounded-md text-black text-sm sm:text-base w-full'
            value={filters.district}
            onChange={(e) => { setFilters({ ...filters, district: e.target.value }); setPage(1); }}
            disabled={!filters.state}
          >
            <option value="">
              {filters.state ? "All Districts" : "Select State First"}
            </option>
            {districtList.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>

          <select
            className='p-2 border border-gray-500 rounded-md text-black text-sm sm:text-base w-full'
            value={filters.propertyType}
            onChange={(e) => { setFilters({ ...filters, propertyType: e.target.value }); setPage(1); }}
          >
            <option value="">All Types</option>
            <option value="Land">Land</option>
            <option value="House">House</option>
            <option value="Shop">Shop</option>
          </select>

          <select
            className='p-2 border border-gray-500 rounded-md text-black text-sm sm:text-base w-full'
            value={filters.transactionType}
            onChange={(e) => { setFilters({ ...filters, transactionType: e.target.value }); setPage(1); }}
          >
            <option value="">Sell / Rent</option>
            <option value="Sell">Sell</option>
            <option value="Rent">Rent</option>
          </select>

        </div>

        {/* Loading */}
        {loading && (
          <p className='text-center text-orange-900 font-bold'>Loading properties...</p>
        )}

        {/* No properties found */}
        {!loading && properties.length === 0 && (
          <p className='text-center text-gray-600 mt-10'>
            Koi property nahi mili. Filters change karke dekhein.
          </p>
        )}

        {/* Property Cards Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {properties.map((prop) => {
            const isBuyer = prop.listingType === "BuyerRequirement";
            const cardTitle = isBuyer
              ? `Buyer Requirement — ${prop.propertyType} in ${prop.district}`
              : prop.title;

            return (
              <div
                key={prop._id}
                className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition'
              >
                {/* Image */}
                <div className='h-48 bg-gray-300 flex items-center justify-center'>
                  {prop.images && prop.images.length > 0 ? (
                    <img
                      src={prop.images[0]}
                      alt={cardTitle}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <span className='text-gray-500'>No Image</span>
                  )}
                </div>

                {/* Details */}
                <div className='p-4'>
                  <div className='flex items-center gap-2'>
                    <h2 className='text-lg font-bold text-orange-900 truncate'>{cardTitle}</h2>
                    {isBuyer && (
                      <span className='text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded shrink-0'>
                        BUYER
                      </span>
                    )}
                  </div>

                  <p className='text-sm text-gray-600 mt-1'>
                    {prop.district}, {prop.state}
                  </p>

                  <div className='flex flex-col xs:flex-row justify-between xs:items-center gap-1 mt-2'>
                    <span className='text-lg sm:text-xl font-bold text-green-700'>
                      ₹{Number(prop.price).toLocaleString('en-IN')}
                      {prop.priceUnit === "PerMonth" && " /month"}
                      {prop.priceUnit === "PerSqft" && " /sqft"}
                      {isBuyer && (
                        <span className='block text-xs font-normal text-gray-500'>Budget</span>
                      )}
                    </span>
                    <span className='text-xs bg-orange-200 text-orange-900 px-2 py-1 rounded-full w-fit'>
                      {isBuyer
                        ? (prop.transactionType === "Sell" ? "Wants to Buy" : "Wants on Rent")
                        : (prop.transactionType === "Sell" ? "For Sale" : "For Rent")}
                    </span>
                  </div>

                  <div className='flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-600 mt-2'>
                    <span>{prop.propertyType}</span>
                    {prop.area ? <span>• {prop.area} sqft</span> : null}
                    {prop.bedrooms ? <span>• {prop.bedrooms} BHK</span> : null}
                  </div>

                  <Link
                    href={`/property/${prop._id}`}
                    className='block text-center mt-4 bg-orange-600 text-black font-bold py-2 rounded-md hover:bg-orange-700 transition'
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex flex-wrap justify-center items-center gap-2 mt-8'>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className='px-3 py-2 text-sm sm:text-base bg-orange-600 text-black font-bold rounded-md disabled:opacity-50'
            >
              Previous
            </button>
            <span className='px-2 text-sm sm:text-base text-orange-900 font-bold'>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className='px-3 py-2 text-sm sm:text-base bg-orange-600 text-black font-bold rounded-md disabled:opacity-50'
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}