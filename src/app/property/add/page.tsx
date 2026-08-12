'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import statesDistricts from '@/data/statesDistricts.json';

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [property, setProperty] = useState({
    listingType: "Sell",
    title: "",
    description: "",
    propertyType: "",
    transactionType: "Sell",
    price: "",
    priceUnit: "Total",
    state: "",
    district: "",
    city: "",
    address: "",
    pincode: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    ownerName: "",
    ownerEmail: "",
    contactPhone: "",
    images: [] as string[],
  });

  const isBuyerRequirement = property.listingType === "BuyerRequirement";

  const selectMode = (mode: "Sell" | "RentOut" | "Buy" | "WantToRent") => {
    if (mode === "Sell") {
      setProperty((prev) => ({ ...prev, listingType: "Sell", transactionType: "Sell" }));
    } else if (mode === "RentOut") {
      setProperty((prev) => ({ ...prev, listingType: "Sell", transactionType: "Rent" }));
    } else if (mode === "Buy") {
      setProperty((prev) => ({ ...prev, listingType: "BuyerRequirement", transactionType: "Sell" }));
    } else {
      setProperty((prev) => ({ ...prev, listingType: "BuyerRequirement", transactionType: "Rent" }));
    }
  };

  const [imageError, setImageError] = useState("");
  const [districtList, setDistrictList] = useState<string[]>([]);
  const allStates = Object.keys(statesDistricts);

  useEffect(() => {
    if (property.state && (statesDistricts as any)[property.state]) {
      setDistrictList((statesDistricts as any)[property.state]);
    } else {
      setDistrictList([]);
    }
    setProperty((prev) => ({ ...prev, district: "" }));
  }, [property.state]);

  const MAX_IMAGE_SIZE_KB = 120;
  const MAX_IMAGES = 120;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageError("");

    if (property.images.length >= MAX_IMAGES) {
      setImageError(`You can upload a maximum of ${MAX_IMAGES} photos`);
      return;
    }

    const file = files[0];
    const fileSizeKB = file.size / 1024;

    if (fileSizeKB > MAX_IMAGE_SIZE_KB) {
      setImageError(
        `"${file.name}" is ${fileSizeKB.toFixed(1)}KB. Photo must be smaller than ${MAX_IMAGE_SIZE_KB}KB.`
      );
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setProperty((prev) => ({
        ...prev,
        images: [...prev.images, base64String],
      }));
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setProperty((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isBuyerRequirement && (!property.title || !property.description)) {
      toast.error("Please fill title and description");
      return;
    }

    if (!property.propertyType || !property.transactionType || !property.price ||
      !property.state || !property.district || !property.ownerName || !property.contactPhone) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/property/add", property);
      toast.success(response.data.message || "Property listed successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700';
  const labelClass = 'block mb-1 dark:text-gray-200';

  return (
    <div className='min-h-screen flex items-center justify-center py-8 px-4'>
      <div className='w-full max-w-2xl p-6 sm:p-8 rounded-2xl shadow-xl bg-white/95 dark:bg-slate-800/95 text-orange-900 dark:text-orange-300'>

        <form onSubmit={onSubmit} className='flex flex-col gap-4'>

          <h1 className='text-2xl font-bold text-center'>
            {loading ? "Submitting..." : "Add Property"}
          </h1>
          <hr className='border-gray-300 dark:border-gray-600' />

          <div>
            <label className={labelClass}>What would you like to do?</label>
            <div className='grid grid-cols-2 gap-2'>
              <button
                type="button"
                onClick={() => selectMode("Sell")}
                className={`p-2 rounded-md font-semibold border-2 text-sm ${
                  property.listingType === "Sell" && property.transactionType === "Sell"
                    ? "bg-orange-600 text-black border-orange-700"
                    : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-600"
                }`}
              >
                Sell Property
              </button>
              <button
                type="button"
                onClick={() => selectMode("RentOut")}
                className={`p-2 rounded-md font-semibold border-2 text-sm ${
                  property.listingType === "Sell" && property.transactionType === "Rent"
                    ? "bg-orange-600 text-black border-orange-700"
                    : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-600"
                }`}
              >
                Rent Out Property
              </button>
              <button
                type="button"
                onClick={() => selectMode("Buy")}
                className={`p-2 rounded-md font-semibold border-2 text-sm ${
                  property.listingType === "BuyerRequirement" && property.transactionType === "Sell"
                    ? "bg-orange-600 text-black border-orange-700"
                    : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-600"
                }`}
              >
                I Want to Buy Property
              </button>
              <button
                type="button"
                onClick={() => selectMode("WantToRent")}
                className={`p-2 rounded-md font-semibold border-2 text-sm ${
                  property.listingType === "BuyerRequirement" && property.transactionType === "Rent"
                    ? "bg-orange-600 text-black border-orange-700"
                    : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-600"
                }`}
              >
                I Want to Rent
              </button>
            </div>
          </div>

          {!isBuyerRequirement && (
            <>
              <div>
                <label className={labelClass} htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  className={`${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-700`}
                  placeholder='e.g. 2BHK Flat for Sale in Lucknow'
                  value={property.title}
                  onChange={(e) => setProperty({ ...property, title: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className={`${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-700`}
                  placeholder='Enter details about the property'
                  rows={3}
                  value={property.description}
                  onChange={(e) => setProperty({ ...property, description: e.target.value })}
                />
              </div>
            </>
          )}

          {isBuyerRequirement && (
            <div>
              <label className={labelClass} htmlFor="description">Your Message</label>
              <textarea
                id="description"
                className={`${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-700`}
                placeholder='e.g. I need a 2BHK flat in Gomti Nagar, Lucknow, budget up to 25 lakh'
                rows={3}
                value={property.description}
                onChange={(e) => setProperty({ ...property, description: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="propertyType">Property Type</label>
            <select
              id="propertyType"
              className={inputClass}
              value={property.propertyType}
              onChange={(e) => setProperty({ ...property, propertyType: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="Land">Land</option>
              <option value="House">House</option>
              <option value="Shop">Shop</option>
            </select>
          </div>

          <div className='flex gap-4'>
            <div className='flex-1'>
              <label className={labelClass} htmlFor="price">
                {isBuyerRequirement ? "Budget (₹)" : "Price (₹)"}
              </label>
              <input
                id="price"
                type="number"
                className={inputClass}
                placeholder='e.g. 2500000'
                value={property.price}
                onChange={(e) => setProperty({ ...property, price: e.target.value })}
              />
            </div>
            {!isBuyerRequirement && (
              <div className='flex-1'>
                <label className={labelClass} htmlFor="priceUnit">Price Unit</label>
                <select
                  id="priceUnit"
                  className={inputClass}
                  value={property.priceUnit}
                  onChange={(e) => setProperty({ ...property, priceUnit: e.target.value })}
                >
                  <option value="Total">Total</option>
                  <option value="PerMonth">Per Month</option>
                  <option value="PerSqft">Per Sqft</option>
                </select>
              </div>
            )}
          </div>

          <div className='flex gap-4'>
            <div className='flex-1'>
              <label className={labelClass} htmlFor="state">State</label>
              <select
                id="state"
                className={inputClass}
                value={property.state}
                onChange={(e) => setProperty({ ...property, state: e.target.value })}
              >
                <option value="">Select State</option>
                {allStates.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className='flex-1'>
              <label className={labelClass} htmlFor="district">
                {isBuyerRequirement ? "District You Want Property In" : "District"}
              </label>
              <select
                id="district"
                className={inputClass}
                value={property.district}
                onChange={(e) => setProperty({ ...property, district: e.target.value })}
                disabled={!property.state}
              >
                <option value="">
                  {property.state ? "Select District" : "Select State First"}
                </option>
                {districtList.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>

          {!isBuyerRequirement && (
            <>
              <div className='flex gap-4'>
                <div className='flex-1'>
                  <label className={labelClass} htmlFor="city">City / Locality</label>
                  <input
                    id="city"
                    type="text"
                    className={inputClass}
                    placeholder='e.g. Gomti Nagar'
                    value={property.city}
                    onChange={(e) => setProperty({ ...property, city: e.target.value })}
                  />
                </div>
                <div className='flex-1'>
                  <label className={labelClass} htmlFor="pincode">Pincode</label>
                  <input
                    id="pincode"
                    type="text"
                    className={inputClass}
                    placeholder='e.g. 226010'
                    value={property.pincode}
                    onChange={(e) => setProperty({ ...property, pincode: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="address">Full Address</label>
                <input
                  id="address"
                  type="text"
                  className={inputClass}
                  placeholder='Enter full address'
                  value={property.address}
                  onChange={(e) => setProperty({ ...property, address: e.target.value })}
                />
              </div>

              <div className='flex gap-4'>
                <div className='flex-1'>
                  <label className={labelClass} htmlFor="area">Area (sqft)</label>
                  <input
                    id="area"
                    type="number"
                    className={inputClass}
                    value={property.area}
                    onChange={(e) => setProperty({ ...property, area: e.target.value })}
                  />
                </div>
                <div className='flex-1'>
                  <label className={labelClass} htmlFor="bedrooms">Bedrooms</label>
                  <input
                    id="bedrooms"
                    type="number"
                    className={inputClass}
                    value={property.bedrooms}
                    onChange={(e) => setProperty({ ...property, bedrooms: e.target.value })}
                  />
                </div>
                <div className='flex-1'>
                  <label className={labelClass} htmlFor="bathrooms">Bathrooms</label>
                  <input
                    id="bathrooms"
                    type="number"
                    className={inputClass}
                    value={property.bathrooms}
                    onChange={(e) => setProperty({ ...property, bathrooms: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className={labelClass} htmlFor="ownerName">Your Name</label>
            <input
              id="ownerName"
              type="text"
              className={inputClass}
              placeholder='e.g. Govind Verma'
              value={property.ownerName}
              onChange={(e) => setProperty({ ...property, ownerName: e.target.value })}
            />
          </div>

          <div className='flex gap-4'>
            <div className='flex-1'>
              <label className={labelClass} htmlFor="ownerEmail">Email (optional)</label>
              <input
                id="ownerEmail"
                type="email"
                className={inputClass}
                placeholder='e.g. govind@example.com'
                value={property.ownerEmail}
                onChange={(e) => setProperty({ ...property, ownerEmail: e.target.value })}
              />
            </div>
            <div className='flex-1'>
              <label className={labelClass} htmlFor="contactPhone">Contact Phone</label>
              <input
                id="contactPhone"
                type="tel"
                className={inputClass}
                placeholder='e.g. 9876543210'
                value={property.contactPhone}
                onChange={(e) => setProperty({ ...property, contactPhone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Photos (max {MAX_IMAGES}, each photo under {MAX_IMAGE_SIZE_KB}KB)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={property.images.length >= MAX_IMAGES}
              className='w-full p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white bg-white dark:bg-slate-700'
            />
            {imageError && (
              <p className='text-red-600 dark:text-red-400 text-sm mt-1'>{imageError}</p>
            )}

            {property.images.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-3'>
                {property.images.map((img, index) => (
                  <div key={index} className='relative'>
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className='w-20 h-20 object-cover rounded-md border border-gray-400 dark:border-gray-600'
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className='absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs font-bold'
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className='w-full text-xl bg-orange-600 font-bold text-black py-2 rounded-md transition mt-2'
          >
            {loading ? "Submitting..." : isBuyerRequirement ? "Submit Requirement" : "Submit Property"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/subscription/subscribe?state=${encodeURIComponent(property.state)}&district=${encodeURIComponent(property.district)}`
              )
            }
            className='w-full text-base bg-white dark:bg-slate-700 border-2 border-orange-600 text-orange-900 dark:text-orange-300 font-bold py-2 rounded-md hover:bg-orange-50 dark:hover:bg-slate-600 transition'
          >
            🔓 Subscribe for this District
          </button>

        </form>
      </div>
    </div>
  );
}