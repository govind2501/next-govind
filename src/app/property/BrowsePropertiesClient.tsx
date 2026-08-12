'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import statesDistricts from '@/data/statesDistricts.json';

interface FiltersType {
  state: string;
  district: string;
  propertyType: string;
  transactionType: string;
  listingType: string;
}

export default function BrowsePropertiesClient({
  properties,
  totalPages,
  currentPage,
  currentFilters,
}: {
  properties: any[];
  totalPages: number;
  currentPage: number;
  currentFilters: FiltersType;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<FiltersType>(currentFilters);
  const [districtList, setDistrictList] = useState<string[]>([]);
  const allStates = Object.keys(statesDistricts);

  useEffect(() => {
    if (filters.state && (statesDistricts as any)[filters.state]) {
      setDistrictList((statesDistricts as any)[filters.state]);
    } else {
      setDistrictList([]);
    }
  }, [filters.state]);

  const applyFilters = (updated: FiltersType, newPage: number = 1) => {
    const query = new URLSearchParams();
    if (updated.state) query.set("state", updated.state);
    if (updated.district) query.set("district", updated.district);
    if (updated.propertyType) query.set("propertyType", updated.propertyType);
    if (updated.transactionType) query.set("transactionType", updated.transactionType);
    if (updated.listingType) query.set("listingType", updated.listingType);
    query.set("page", String(newPage));

    router.push(`${pathname}?${query.toString()}`);
  };

  const updateFilter = (key: keyof FiltersType, value: string) => {
    const updated = { ...filters, [key]: value };
    if (key === "state") updated.district = "";
    setFilters(updated);
    applyFilters(updated, 1);
  };

  const goToPage = (newPage: number) => {
    applyFilters(filters, newPage);
  };

  return (
    <div className='min-h-screen px-3 sm:px-4 py-6 sm:py-8'>
      <div className='max-w-6xl mx-auto'>

        <h1 className='text-2xl sm:text-3xl font-bold text-white drop-shadow-md mb-4 sm:mb-6 text-center'>
          Browse Properties
        </h1>

        <div className='flex justify-center gap-2 mb-4 flex-wrap'>
          <button
            onClick={() => updateFilter("listingType", "")}
            className={`px-4 py-2 rounded-md font-semibold border-2 ${
              filters.listingType === ""
                ? "bg-orange-600 text-black border-orange-700"
                : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => updateFilter("listingType", "Sell")}
            className={`px-4 py-2 rounded-md font-semibold border-2 ${
              filters.listingType === "Sell"
                ? "bg-orange-600 text-black border-orange-700"
                : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-600"
            }`}
          >
            Sellers
          </button>
          <button
            onClick={() => updateFilter("listingType", "BuyerRequirement")}
            className={`px-4 py-2 rounded-md font-semibold border-2 ${
              filters.listingType === "BuyerRequirement"
                ? "bg-orange-600 text-black border-orange-700"
                : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-600"
            }`}
          >
            Buyers
          </button>
          <button
            onClick={() =>
              updateFilter("transactionType", filters.transactionType === "Rent" ? "" : "Rent")
            }
            className={`px-4 py-2 rounded-md font-semibold border-2 ${
              filters.transactionType === "Rent"
                ? "bg-orange-600 text-black border-orange-700"
                : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-600"
            }`}
          >
            Rent
          </button>
        </div>

        <div className='bg-white/95 dark:bg-slate-800/95 p-3 sm:p-4 rounded-2xl shadow-xl mb-6 grid grid-cols-2 md:grid-cols-3 gap-3'>

          <select
            className='p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700 text-sm sm:text-base w-full'
            value={filters.state}
            onChange={(e) => updateFilter("state", e.target.value)}
          >
            <option value="">All States</option>
            {allStates.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <select
            className='p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700 text-sm sm:text-base w-full'
            value={filters.district}
            onChange={(e) => updateFilter("district", e.target.value)}
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
            className='p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700 text-sm sm:text-base w-full'
            value={filters.transactionType}
            onChange={(e) => updateFilter("transactionType", e.target.value)}
          >
            <option value="">All Transactions</option>
            <option value="Sell">Sell</option>
            <option value="Rent">Rent</option>
          </select>

        </div>

        {properties.length === 0 && (
          <div className='bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-6 text-center max-w-md mx-auto'>
            <p className='text-gray-600 dark:text-gray-300'>
              No properties found. Try changing the filters.
            </p>
          </div>
        )}

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {properties.map((prop) => {
            const isBuyer = prop.listingType === "BuyerRequirement";
            const cardTitle = isBuyer
              ? `Buyer Requirement — ${prop.propertyType} in ${prop.district}`
              : prop.title;

            return (
              <div
                key={prop._id}
                className='bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition'
              >
                <div className='h-48 bg-gray-300 dark:bg-gray-600 flex items-center justify-center'>
                  {prop.images && prop.images.length > 0 ? (
                    <img
                      src={prop.images[0]}
                      alt={cardTitle}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <span className='text-gray-500 dark:text-gray-300'>No Image</span>
                  )}
                </div>

                <div className='p-4'>
                  <div className='flex items-center gap-2'>
                    <h2 className='text-lg font-bold text-orange-900 dark:text-orange-300 truncate'>{cardTitle}</h2>
                    {isBuyer && (
                      <span className='text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded shrink-0'>
                        {prop.transactionType === "Rent" ? "RENTER" : "BUYER"}
                      </span>
                    )}
                  </div>

                  <p className='text-sm text-gray-600 dark:text-gray-300 mt-1'>
                    {prop.district}, {prop.state}
                  </p>

                  <div className='flex flex-col xs:flex-row justify-between xs:items-center gap-1 mt-2'>
                    <span className='text-lg sm:text-xl font-bold text-green-700 dark:text-green-400'>
                      ₹{Number(prop.price).toLocaleString('en-IN')}
                      {prop.priceUnit === "PerMonth" && " /month"}
                      {prop.priceUnit === "PerSqft" && " /sqft"}
                      {isBuyer && (
                        <span className='block text-xs font-normal text-gray-500 dark:text-gray-400'>Budget</span>
                      )}
                    </span>
                    <span className='text-xs bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-200 px-2 py-1 rounded-full w-fit'>
                      {isBuyer
                        ? (prop.transactionType === "Sell" ? "Wants to Buy" : "Wants on Rent")
                        : (prop.transactionType === "Sell" ? "For Sale" : "For Rent")}
                    </span>
                  </div>

                  <div className='flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2'>
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

        {totalPages > 1 && (
          <div className='flex flex-wrap justify-center items-center gap-2 mt-8 bg-white/90 dark:bg-slate-800/90 w-fit mx-auto px-4 py-2 rounded-xl shadow-md'>
            <button
              onClick={() => goToPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className='px-3 py-2 text-sm sm:text-base bg-orange-600 text-black font-bold rounded-md disabled:opacity-50'
            >
              Previous
            </button>
            <span className='px-2 text-sm sm:text-base text-orange-900 dark:text-orange-300 font-bold'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
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