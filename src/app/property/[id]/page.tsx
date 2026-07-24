'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/property/${propertyId}`);
      setProperty(response.data.property);
      setHasAccess(response.data.hasAccess);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Property nahi mil payi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-100'>
        <p className='text-orange-900 font-bold text-lg'>Loading...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-100'>
        <p className='text-gray-600 text-lg'>Property nahi mili</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen px-3 sm:px-4 py-6 sm:py-8 bg-slate-100'>
      {/* Image Gallery */}
        <div className='h-56 sm:h-72 bg-gray-300 flex items-center justify-center'>
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[selectedImage]}
              alt={property.title || "Property photo"}
              className='w-full h-full object-cover'
            />
          ) : (
            <span className='text-gray-500'>No Image Available</span>
          )}
        </div>

        {/* Thumbnail strip - sirf tab dikhega jab 1 se zyada photo ho */}
        {property.images && property.images.length > 1 && (
          <div className='flex gap-2 p-3 overflow-x-auto bg-gray-100'>
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

        <div className='p-4 sm:p-6'>
          {/* Title & Price */}
          <div className='flex justify-between items-start flex-wrap gap-2'>
            <h1 className='text-xl sm:text-2xl font-bold text-orange-900'>{property.title}</h1>
            <span className='text-xl sm:text-2xl font-bold text-green-700'>
              ₹{Number(property.price).toLocaleString('en-IN')}
              {property.priceUnit === "PerMonth" && " /month"}
              {property.priceUnit === "PerSqft" && " /sqft"}
            </span>
          </div>

          <p className='text-gray-600 mt-1'>
            {property.city ? `${property.city}, ` : ""}{property.district}, {property.state}
          </p>

          {/* Tags */}
          <div className='flex gap-3 mt-3'>
            <span className='text-sm bg-orange-200 text-orange-900 px-3 py-1 rounded-full font-semibold'>
              {property.transactionType === "Sell" ? "For Sale" : "For Rent"}
            </span>
            <span className='text-sm bg-blue-200 text-blue-900 px-3 py-1 rounded-full font-semibold'>
              {property.propertyType}
            </span>
          </div>

          {/* Description */}
          <div className='mt-5'>
            <h2 className='text-lg font-bold text-orange-900 mb-1'>Description</h2>
            <p className='text-gray-700'>{property.description}</p>
          </div>

          {/* Details Grid */}
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 text-gray-700'>
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

          {/* Contact Details Section - locked or unlocked based on subscription */}
          <div className='mt-6 border-t pt-4'>
            <h2 className='text-lg font-bold text-orange-900 mb-2'>Contact Details</h2>

            {hasAccess ? (
              // Subscription active hai - poori jaankari dikhao
              <>
                <p className='text-gray-700'>
                  Posted by: <span className='font-semibold'>{property.ownerName}</span>
                </p>
                {property.contactPhone ? (
                  <p className='text-gray-700'>Phone: {property.contactPhone}</p>
                ) : null}
                {property.address ? (
                  <p className='text-gray-700 mt-2'>
                    <span className='font-semibold'>Address:</span> {property.address}
                  </p>
                ) : null}
              </>
            ) : (
              // Subscription nahi hai - locked message aur unlock button dikhao
              <div className='bg-orange-50 border border-orange-300 rounded-md p-4 text-center'>
                <p className='text-orange-900 font-semibold mb-3'>
                  🔒 Owner ka contact number aur poora address dekhne ke liye,
                  is district ({property.district}) ki subscription lena zaroori hai.
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
    
  );
}
