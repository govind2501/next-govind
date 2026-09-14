'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const CLOUDINARY_CLOUD_NAME = "w2vtxqrq";
const CLOUDINARY_UPLOAD_PRESET = "property_video_upload";

export default function EditPropertyClient({ property }: { property: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [images, setImages] = useState<string[]>(property.images || []);
  const [video, setVideo] = useState<string>(property.video || "");
  const [contactPhone, setContactPhone] = useState(property.contactPhone || "");
  const [price, setPrice] = useState(property.price || "");
  const [priceUnit, setPriceUnit] = useState(property.priceUnit || "Total");

  const [imageError, setImageError] = useState("");
  const MAX_IMAGE_SIZE_KB = 120;
  const MAX_IMAGES = 120;
  const MAX_VIDEO_SIZE_MB = 90;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setImageError("");

    if (images.length >= MAX_IMAGES) {
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
      setImages((prev) => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
      toast.error(`Video must be smaller than ${MAX_VIDEO_SIZE_MB}MB`);
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploadingVideo(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.secure_url) {
        setVideo(data.secure_url);
        toast.success("Video uploaded successfully");
      } else {
        toast.error("Video upload failed");
      }
    } catch (error) {
      toast.error("Video upload failed");
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactPhone || !price) {
      toast.error("Please fill phone and price");
      return;
    }

    try {
      setLoading(true);
      await axios.patch(`/api/property/${property._id}/edit`, {
        images,
        video,
        contactPhone,
        price,
        priceUnit,
      });
      toast.success("Property updated! Waiting for admin re-approval.");
      router.push(`/property/${property._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700';
  const labelClass = 'block mb-1 dark:text-gray-200';

  return (
    <div className='min-h-screen flex items-center justify-center py-8 px-4'>
      <div className='w-full max-w-2xl p-6 sm:p-8 rounded-2xl shadow-xl bg-white/95 dark:bg-slate-800/95 text-orange-900 dark:text-orange-300'>
        <form onSubmit={onSubmit} className='flex flex-col gap-4'>
          <h1 className='text-2xl font-bold text-center'>Edit Property</h1>
          <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
            You can update Photos, Video, Phone and Price. Location cannot be changed.
          </p>
          <hr className='border-gray-300 dark:border-gray-600' />

          <div className='flex gap-4'>
            <div className='flex-1'>
              <label className={labelClass} htmlFor="price">Price (₹)</label>
              <input
                id="price"
                type="number"
                className={inputClass}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className='flex-1'>
              <label className={labelClass} htmlFor="priceUnit">Price Unit</label>
              <select
                id="priceUnit"
                className={inputClass}
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
              >
                <option value="Total">Total</option>
                <option value="PerMonth">Per Month</option>
                <option value="PerSqft">Per Sqft</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="contactPhone">Contact Phone</label>
            <input
              id="contactPhone"
              type="tel"
              className={inputClass}
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>
              Photos (max {MAX_IMAGES}, each under {MAX_IMAGE_SIZE_KB}KB)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={images.length >= MAX_IMAGES}
              className='w-full p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white bg-white dark:bg-slate-700'
            />
            {imageError && (
              <p className='text-red-600 dark:text-red-400 text-sm mt-1'>{imageError}</p>
            )}

            {images.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-3'>
                {images.map((img, index) => (
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

          <div>
            <label className={labelClass}>
              Property Video (optional, max {MAX_VIDEO_SIZE_MB}MB)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              disabled={uploadingVideo}
              className='w-full p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white bg-white dark:bg-slate-700'
            />
            {uploadingVideo && (
              <p className='text-blue-600 dark:text-blue-400 text-sm mt-1'>Uploading video...</p>
            )}

            {video && !uploadingVideo && (
              <div className='mt-3 relative w-fit'>
                <video src={video} controls className='w-64 rounded-md border border-gray-400 dark:border-gray-600' />
                <button
                  type="button"
                  onClick={() => setVideo("")}
                  className='absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs font-bold'
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || uploadingVideo}
            className='w-full text-xl bg-orange-600 font-bold text-black py-2 rounded-md transition mt-2'
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/property/${property._id}`)}
            className='w-full text-base bg-white dark:bg-slate-700 border-2 border-orange-600 text-orange-900 dark:text-orange-300 font-bold py-2 rounded-md hover:bg-orange-50 dark:hover:bg-slate-600 transition'
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}