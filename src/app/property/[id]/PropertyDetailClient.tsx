'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PropertyDetailClient({
  property,
  hasAccess,
  isOwner,
}: {
  property: any;
  hasAccess: boolean;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);

  const isBuyer = property.listingType === "BuyerRequirement";

  const handleWhatsAppShare = () => {
    const priceText = `₹${Number(property.price).toLocaleString('en-IN')}${
      property.priceUnit === "PerMonth" ? " /month" : property.priceUnit === "PerSqft" ? " /sqft" : ""
    }`;
    const pageUrl = typeof window !== "undefined" ? window.location.href : "";
    const message = `Check out this property on Trade My Property:\n\n${property.title || property.propertyType}\n${priceText}\n${property.district}, ${property.state}\n\n${pageUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className='min-h-screen px-3 sm:px-4 py-6 sm:py-8'>
      <div className='max-w-3xl mx-auto bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl overflow-hidden'>

        {isOwner && property.status === "Pending" && (
          <div className='bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-200 text-center text-sm font-semibold py-2 px-3'>
            ⏳ This listing is pending admin re-approval after your recent edit.
          </div>
        )}

        <div className='h-56 sm:h-72 bg-gray-300 dark:bg-gray-600 flex items-center justify-center'>
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[selectedImage]}
              alt={property.title || "Property photo"}
              className='w-full h-full object-cover'
            />
          ) : (
            <span className='text-gray-500 dark:text-gray-300'>No Image Available</span>
          )}
        </div>

        {property.images && property.images.length > 1 && (
          <div className='flex gap-2 p-3 overflow-x-auto bg-gray-100 dark:bg-slate-700'>
            {property.images.map((img: string, index: number) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 shrink-0 ${
                  selectedImage === index ? "border-orange-600" : "border-transparent"
                }`}
              />
            ))}
          </div>
        )}

        {property.video && (
          <div className='p-3 bg-gray-100 dark:bg-slate-700'>
            <video
              src={property.video}
              controls
              className='w-full rounded-md max-h-72'
            />
          </div>
        )}

        <div className='p-4 sm:p-6'>
          <div className='flex justify-between items-start flex-wrap gap-2'>
            <h1 className='text-xl sm:text-2xl font-bold text-orange-900 dark:text-orange-300'>{property.title}</h1>
            <span className='text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400'>
              ₹{Number(property.price).toLocaleString('en-IN')}
              {property.priceUnit === "PerMonth" && " /month"}
              {property.priceUnit === "PerSqft" && " /sqft"}
            </span>
          </div>

          {isOwner && (
            <button
              onClick={() => router.push(`/property/${property._id}/edit`)}
              className='mt-2 text-sm bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-full hover:bg-blue-700 transition'
            >
              ✏️ Edit Property
            </button>
          )}

          <p className='text-gray-600 dark:text-gray-300 mt-1'>
            {property.city ? `${property.city}, ` : ""}{property.district}, {property.state}
          </p>

          <div className='flex justify-between items-center flex-wrap gap-3 mt-3'>
            <div className='flex gap-3'>
              <span className='text-sm bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-200 px-3 py-1 rounded-full font-semibold'>
                {property.transactionType === "Sell" ? "For Sale" : "For Rent"}
              </span>
              <span className='text-sm bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200 px-3 py-1 rounded-full font-semibold'>
                {property.propertyType}
              </span>
            </div>

            <button
              onClick={handleWhatsAppShare}
              className='flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold px-4 py-2 rounded-full transition text-sm'
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.72.45 3.4 1.32 4.87L2.05 22l5.36-1.41a9.87 9.87 0 0 0 4.63 1.18h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.24 8.23zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.36-.77-1.86-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01a.9.9 0 0 0-.66.31c-.23.24-.86.85-.86 2.07s.89 2.4 1.01 2.56c.13.17 1.75 2.68 4.25 3.75.59.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28z"/>
              </svg>
              Share
            </button>
          </div>

          <div className='mt-5'>
            <h2 className='text-lg font-bold text-orange-900 dark:text-orange-300 mb-1'>Description</h2>
            <p className='text-gray-700 dark:text-gray-200'>{property.description}</p>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 text-gray-700 dark:text-gray-200'>
            {property.area ? (
              <div><span className='font-semibold'>Area:</span> {property.area} sqft</div>
            ) : null}
            {property.bedrooms ? (
              <div><span className='font-semibold'>Bedrooms:</span> {property.bedrooms}</div>
            ) : null}
            {property.bathrooms ? (
              <div><span className='font-semibold'>Bathrooms:</span> {property.bathrooms}</div>
            ) : null}
          </div>

          <div className='mt-6 border-t border-gray-300 dark:border-gray-600 pt-4'>
            <h2 className='text-lg font-bold text-orange-900 dark:text-orange-300 mb-2'>Contact Details</h2>

            {hasAccess ? (
              <>
                <p className='text-gray-700 dark:text-gray-200'>
                  Posted by: <span className='font-semibold'>{property.ownerName}</span>
                </p>
                {property.contactPhone ? (
                  <p className='text-gray-700 dark:text-gray-200'>Phone: {property.contactPhone}</p>
                ) : null}
                {property.address ? (
                  <p className='text-gray-700 dark:text-gray-200 mt-2'>
                    <span className='font-semibold'>Address:</span> {property.address}
                  </p>
                ) : null}
              </>
            ) : (
              <div className='bg-orange-50 dark:bg-slate-700 border border-orange-300 dark:border-orange-500 rounded-md p-4 text-center'>
                <p className='text-orange-900 dark:text-orange-200 font-semibold mb-3'>
                  🔒 A subscription for {property.district} district is required
                  to view the owner's contact number and full address.
                </p>
                <button
                  onClick={() => router.push(`/subscription/subscribe?state=${encodeURIComponent(property.state)}&district=${encodeURIComponent(property.district)}`)}
                  className='bg-orange-600 text-black font-bold px-6 py-2 rounded-md hover:bg-orange-700 transition'
                >
                  Unlock Details
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/property")}
            className='mt-6 w-full bg-orange-600 text-black font-bold py-2 rounded-md hover:bg-orange-700 transition'
          >
            ← Back to Listings
          </button>
        </div>
      </div>
    </div>
  );
}