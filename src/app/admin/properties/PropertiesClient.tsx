'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface PropertyType {
  _id: string;
  listingType: string;
  title: string;
  description: string;
  propertyType: string;
  transactionType: string;
  district: string;
  state: string;
  price: number;
  ownerName: string;
  ownerEmail?: string;
  contactPhone: string;
}

export default function PropertiesClient({
  initialProperties,
}: {
  initialProperties: PropertyType[];
}) {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyType[]>(initialProperties);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // For capturing the reason when rejecting
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async (propertyId: string) => {
    try {
      setActionLoadingId(propertyId);
      await axios.post("/api/admin/property/approve", {
        propertyId,
        action: "approve",
      });
      toast.success("Property approved!");
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not approve");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (propertyId: string) => {
    try {
      setActionLoadingId(propertyId);
      await axios.post("/api/admin/property/approve", {
        propertyId,
        action: "reject",
        rejectionReason: rejectReason || "Admin has rejected this listing",
      });
      toast.success("Property rejected");
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      setRejectingId(null);
      setRejectReason("");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not reject");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className='min-h-screen px-4 py-8 bg-slate-100'>
      <div className='max-w-4xl mx-auto'>

        <h1 className='text-3xl font-bold text-orange-900 mb-6 text-center'>
          Admin - Pending Properties
        </h1>

        {properties.length === 0 && (
          <p className='text-center text-gray-600 mt-10'>
            No pending properties. All clear! ✅
          </p>
        )}

    <div className='flex flex-col gap-4'>
      {properties.map((prop) => (
        <div key={prop._id} className='bg-white rounded-lg shadow-md p-5'>
        <div className='flex justify-between items-start'>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-xl font-bold text-orange-900'>
      {prop.listingType === "BuyerRequirement"
        ? `Buyer Requirement — ${prop.propertyType} in ${prop.district}`
        : prop.title}
        </h2>
        {prop.listingType === "BuyerRequirement" && (
        <span className='text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded'>
        {prop.transactionType === "Rent" ? "RENTER" : "BUYER"}
        </span>
        )}
        </div>
        <p className='text-sm text-gray-600 mt-1'>
        {prop.propertyType} •{" "}
        {prop.listingType === "BuyerRequirement"
          ? (prop.transactionType === "Sell" ? "Buy" : prop.transactionType)
          : prop.transactionType}
        {" "}• {prop.district}, {prop.state}
      </p>
      <p className='text-sm text-gray-600'>
        Owner: {prop.ownerName} {prop.ownerEmail && `(${prop.ownerEmail})`} • 📞 {prop.contactPhone}
      </p>
      </div>
      <span className='text-lg font-bold text-green-700'>
      ₹{Number(prop.price).toLocaleString('en-IN')}
      {prop.listingType === "BuyerRequirement" && (
    <span className='block text-xs font-normal text-gray-500 text-right'>Budget</span>
            )}
          </span>
        </div>
      {prop.description && (
      <p className='text-gray-700 mt-3'>{prop.description}</p>
      )}
    {/* Action Buttons */}
    <div className='flex gap-3 mt-4'>
      <button
    onClick={() => handleApprove(prop._id)}
    disabled={actionLoadingId === prop._id}
      className='px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:opacity-50'
      >
        {actionLoadingId === prop._id ? "Processing..." : "✓ Approve"}
      </button>

      <button
        onClick={() => setRejectingId(rejectingId === prop._id ? null : prop._id)}
        disabled={actionLoadingId === prop._id}
        className='px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 disabled:opacity-50'
      >
        ✗ Reject
      </button>
    </div>
     {/* Reject Reason Input */}
    {rejectingId === prop._id && (
      <div className='mt-3 flex gap-2'>
        <input
          type="text"
          placeholder="Enter reason for rejection"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          className='flex-1 p-2 border border-gray-400 rounded-md text-black'
        />
        <button
          onClick={() => handleReject(prop._id)}
          disabled={actionLoadingId === prop._id}
          className='px-4 py-2 bg-red-700 text-white font-bold rounded-md'
        >
          Confirm Reject
        </button>
      </div>
    )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}