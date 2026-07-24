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
    listingType: "Sell",  // "Sell" or "BuyerRequirement"
    title: "",
    description: "",
    propertyType: "",     // Land / House / Shop
    transactionType: "",  // Sell / Rent
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

  const [imageError, setImageError] = useState("");

  // Districts state - selected state ke hisaab se update hoga
  const [districtList, setDistrictList] = useState<string[]>([]);

  const allStates = Object.keys(statesDistricts);

  const isBuyerRequirement = property.listingType === "BuyerRequirement";

  // Jab bhi state change ho, uske districts load karo
  useEffect(() => {
    if (property.state && (statesDistricts as any)[property.state]) {
      setDistrictList((statesDistricts as any)[property.state]);
    } else {
      setDistrictList([]);
    }
    // State change hote hi purana district reset kar do
    setProperty((prev) => ({ ...prev, district: "" }));
  }, [property.state]);


  const MAX_IMAGE_SIZE_KB = 120;
  const MAX_IMAGES = 120;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageError("");

    if (property.images.length >= MAX_IMAGES) {
      setImageError(`Zyada se zyada ${MAX_IMAGES} photos hi upload kar sakte hain`);
      return;
    }

    const file = files[0];
    const fileSizeKB = file.size / 1024;

    if (fileSizeKB > MAX_IMAGE_SIZE_KB) {
      setImageError(
        `"${file.name}" ka size ${fileSizeKB.toFixed(1)}KB hai. Photo ${MAX_IMAGE_SIZE_KB}KB se chhoti honi chahiye.`
      );
      e.target.value = ""; // input reset karna
      return;
    }

    // File ko base64 me convert karke images array me daalna
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setProperty((prev) => ({
        ...prev,
        images: [...prev.images, base64String],
      }));
    };
    reader.readAsDataURL(file);

    e.target.value = ""; // taaki same file dobara select ki ja sake
  };

  const removeImage = (index: number) => {
    setProperty((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sell listing ke liye title/description bhi zaroori hain
    if (!isBuyerRequirement && (!property.title || !property.description)) {
      toast.error("Please fill title and description");
      return;
    }

    // Ye fields dono listingType me hamesha zaroori hain
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

  return (
    <div className='min-h-screen flex items-center justify-center py-8'>
      <div className='w-full max-w-2xl p-8 rounded-lg shadow-md bg-slate-300 text-orange-900'>

        <form onSubmit={onSubmit} className='flex flex-col gap-4'>

          <h1 className='text-2xl font-bold text-center'>
            {loading ? "Submitting..." : "Add Property"}
          </h1>
          <hr />

          {/* Listing Type Toggle - Sell ya Buyer Requirement */}
          <div>
            <label className='block mb-1'>Aap kya karna chahte hain?</label>
            <div className='flex gap-4'>
              <button
                type="button"
                onClick={() => setProperty({ ...property, listingType: "Sell" })}
                className={`flex-1 p-2 rounded-md font-semibold border-2 ${property.listingType === "Sell"
                    ? "bg-orange-600 text-black border-orange-700"
                    : "bg-white text-gray-700 border-gray-400"
                  }`}
              >
                Property Bechna Hai (Sell)
              </button>
              <button
                type="button"
                onClick={() => setProperty({ ...property, listingType: "BuyerRequirement" })}
                className={`flex-1 p-2 rounded-md font-semibold border-2 ${property.listingType === "BuyerRequirement"
                    ? "bg-orange-600 text-black border-orange-700"
                    : "bg-white text-gray-700 border-gray-400"
                  }`}
              >
                Mujhe Property Chahiye (Buyer)
              </button>
            </div>
          </div>

          {/* Title & Description - sirf Sell listing ke liye */}
          {!isBuyerRequirement && (
            <>
              <div>
                <label className='block mb-1' htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  className='w-full p-2 border border-gray-500 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-700'
                  placeholder='e.g. 2BHK Flat for Sale in Lucknow'
                  value={property.title}
                  onChange={(e) => setProperty({ ...property, title: e.target.value })}
                />
              </div>

              <div>
                <label className='block mb-1' htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className='w-full p-2 border border-gray-500 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-700'
                  placeholder='Property ke baare me detail likhein'
                  rows={3}
                  value={property.description}
                  onChange={(e) => setProperty({ ...property, description: e.target.value })}
                />
              </div>
            </>
          )}

          {/* Message - sirf Buyer Requirement ke liye */}
          {isBuyerRequirement && (
            <div>
              <label className='block mb-1' htmlFor="description">Aapka Message</label>
              <textarea
                id="description"
                className='w-full p-2 border border-gray-500 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-700'
                placeholder='e.g. Mujhe Lucknow ke Gomti Nagar area me 2BHK flat chahiye, budget 25 lakh tak'
                rows={3}
                value={property.description}
                onChange={(e) => setProperty({ ...property, description: e.target.value })}
              />
            </div>
          )}

          {/* Property Type & Transaction Type */}
          <div className='flex gap-4'>
            <div className='flex-1'>
              <label className='block mb-1' htmlFor="propertyType">Property Type</label>
              <select
                id="propertyType"
                className='w-full p-2 border border-gray-500 rounded-md text-black'
                value={property.propertyType}
                onChange={(e) => setProperty({ ...property, propertyType: e.target.value })}
              >
                <option value="">Select Type</option>
                <option value="Land">Jamin (Land)</option>
                <option value="House">Makan (House)</option>
                <option value="Shop">Dukan (Shop)</option>
              </select>
            </div>

            <div className='flex-1'>
              <label className='block mb-1' htmlFor="transactionType">For</label>
              <select
                id="transactionType"
                className='w-full p-2 border border-gray-500 rounded-md text-black'
                value={property.transactionType}
                onChange={(e) => setProperty({ ...property, transactionType: e.target.value })}
              >
                <option value="">Select</option>
                <option value="Sell">
                  {isBuyerRequirement ? "Khareedna (Buy)" : "Bikri (Sell)"}
                </option>
                <option value="Rent">Kiraya (Rent)</option>
              </select>
            </div>
          </div>

          {/* Price & Price Unit */}
          <div className='flex gap-4'>
            <div className='flex-1'>
              <label className='block mb-1' htmlFor="price">
                {isBuyerRequirement ? "Budget (₹)" : "Price (₹)"}
              </label>
              <input
                id="price"
                type="number"
                className='w-full p-2 border border-gray-500 rounded-md text-black'
                placeholder='e.g. 2500000'
                value={property.price}
                onChange={(e) => setProperty({ ...property, price: e.target.value })}
              />
            </div>
            {!isBuyerRequirement && (
              <div className='flex-1'>
                <label className='block mb-1' htmlFor="priceUnit">Price Unit</label>
                <select
                  id="priceUnit"
                  className='w-full p-2 border border-gray-500 rounded-md text-black'
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

          {/* State & District - Cascading Dropdown */}
          <div className='flex gap-4'>
            <div className='flex-1'>
              <label className='block mb-1' htmlFor="state">State</label>
              <select
                id="state"
                className='w-full p-2 border border-gray-500 rounded-md text-black'
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
              <label className='block mb-1' htmlFor="district">
                {isBuyerRequirement ? "Property lene ki District" : "District"}
              </label>
              <select
                id="district"
                className='w-full p-2 border border-gray-500 rounded-md text-black'
                value={property.district}
                onChange={(e) => setProperty({ ...property, district: e.target.value })}
                disabled={!property.state}
              >
                <option value="">
                  {property.state ? "Select District" : "Pehle State chunein"}
                </option>
                {districtList.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ye saare fields sirf Sell listing ke liye dikhenge */}
          {!isBuyerRequirement && (
            <>
              {/* City & Pincode */}
              <div className='flex gap-4'>
                <div className='flex-1'>
                  <label className='block mb-1' htmlFor="city">City / Locality</label>
                  <input
                    id="city"
                    type="text"
                    className='w-full p-2 border border-gray-500 rounded-md text-black'
                    placeholder='e.g. Gomti Nagar'
                    value={property.city}
                    onChange={(e) => setProperty({ ...property, city: e.target.value })}
                  />
                </div>
                <div className='flex-1'>
                  <label className='block mb-1' htmlFor="pincode">Pincode</label>
                  <input
                    id="pincode"
                    type="text"
                    className='w-full p-2 border border-gray-500 rounded-md text-black'
                    placeholder='e.g. 226010'
                    value={property.pincode}
                    onChange={(e) => setProperty({ ...property, pincode: e.target.value })}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className='block mb-1' htmlFor="address">Full Address</label>
                <input
                  id="address"
                  type="text"
                  className='w-full p-2 border border-gray-500 rounded-md text-black'
                  placeholder='Poora pata likhein'
                  value={property.address}
                  onChange={(e) => setProperty({ ...property, address: e.target.value })}
                />
              </div>

              {/* Area, Bedrooms, Bathrooms */}
              <div className='flex gap-4'>
                <div className='flex-1'>
                  <label className='block mb-1' htmlFor="area">Area (sqft)</label>
                  <input
                    id="area"
                    type="number"
                    className='w-full p-2 border border-gray-500 rounded-md text-black'
                    value={property.area}
                    onChange={(e) => setProperty({ ...property, area: e.target.value })}
                  />
                </div>
                <div className='flex-1'>
                  <label className='block mb-1' htmlFor="bedrooms">Bedrooms</label>
                  <input
                    id="bedrooms"
                    type="number"
                    className='w-full p-2 border border-gray-500 rounded-md text-black'
                    value={property.bedrooms}
                    onChange={(e) => setProperty({ ...property, bedrooms: e.target.value })}
                  />
                </div>
                <div className='flex-1'>
                  <label className='block mb-1' htmlFor="bathrooms">Bathrooms</label>
                  <input
                    id="bathrooms"
                    type="number"
                    className='w-full p-2 border border-gray-500 rounded-md text-black'
                    value={property.bathrooms}
                    onChange={(e) => setProperty({ ...property, bathrooms: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}
          {/* Owner Name, Email, Phone - dono listingType me kaam ki hai */}
          <div>
            <label className='block mb-1' htmlFor="ownerName">Aapka Naam</label>
            <input
              id="ownerName"
              type="text"
              className='w-full p-2 border border-gray-500 rounded-md text-black'
              placeholder='e.g. Govind Verma'
              value={property.ownerName}
              onChange={(e) => setProperty({ ...property, ownerName: e.target.value })}
            />
          </div>

          <div className='flex gap-4'>
            <div className='flex-1'>
              <label className='block mb-1' htmlFor="ownerEmail">Email (optional)</label>
              <input
                id="ownerEmail"
                type="email"
                className='w-full p-2 border border-gray-500 rounded-md text-black'
                placeholder='e.g. govind@example.com'
                value={property.ownerEmail}
                onChange={(e) => setProperty({ ...property, ownerEmail: e.target.value })}
              />
            </div>
            <div className='flex-1'>
              <label className='block mb-1' htmlFor="contactPhone">Contact Phone</label>
              <input
                id="contactPhone"
                type="tel"
                className='w-full p-2 border border-gray-500 rounded-md text-black'
                placeholder='e.g. 9876543210'
                value={property.contactPhone}
                onChange={(e) => setProperty({ ...property, contactPhone: e.target.value })}
              />
            </div>
          </div>

          {/* Image Upload - max 5 photos, each under 5KB */}
          <div>
            <label className='block mb-1'>
              Photos (max {MAX_IMAGES}, har photo {MAX_IMAGE_SIZE_KB}KB se chhoti)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={property.images.length >= MAX_IMAGES}
              className='w-full p-2 border border-gray-500 rounded-md text-black bg-white'
            />
            {imageError && (
              <p className='text-red-600 text-sm mt-1'>{imageError}</p>
            )}

            {/* Preview thumbnails */}
            {property.images.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-3'>
                {property.images.map((img, index) => (
                  <div key={index} className='relative'>
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className='w-20 h-20 object-cover rounded-md border border-gray-400'
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

          {/* Subscribe button - agar customer ke pass is district ki subscription nahi hai */}
          <button
            type="button"
            onClick={() =>
              router.push(
                `/subscription/subscribe?state=${encodeURIComponent(property.state)}&district=${encodeURIComponent(property.district)}`
              )
            }
            className='w-full text-base bg-white border-2 border-orange-600 text-orange-900 font-bold py-2 rounded-md hover:bg-orange-50 transition'
          >
            🔓 Subscribe karein is District ke liye
          </button>

        </form>
      </div>
    </div>
  );
}