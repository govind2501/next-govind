'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill name, email and message");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/contact", form);
      toast.success(response.data.message || "Message sent!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen px-4 py-12'>
      <div className='max-w-xl mx-auto bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-6 sm:p-8'>

        <h1 className='text-2xl sm:text-3xl font-bold text-orange-900 dark:text-orange-300 mb-2 text-center'>
          Contact Us
        </h1>
        <p className='text-gray-600 dark:text-gray-300 text-center mb-6'>
          Have a question or need help? Send us a message and we'll respond soon.
        </p>

        <form onSubmit={onSubmit} className='flex flex-col gap-4'>

          <div>
            <label className='block mb-1 text-gray-800 dark:text-gray-200' htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className='w-full p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700'
              placeholder='Your name'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className='block mb-1 text-gray-800 dark:text-gray-200' htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className='w-full p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700'
              placeholder='you@example.com'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className='block mb-1 text-gray-800 dark:text-gray-200' htmlFor="phone">Phone (optional)</label>
            <input
              id="phone"
              type="tel"
              className='w-full p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700'
              placeholder='9876543210'
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label className='block mb-1 text-gray-800 dark:text-gray-200' htmlFor="message">Message</label>
            <textarea
              id="message"
              rows={4}
              className='w-full p-2 border border-gray-500 dark:border-gray-600 rounded-md text-black dark:text-white dark:bg-slate-700'
              placeholder='How can we help you?'
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className='w-full bg-orange-600 text-black font-bold py-3 rounded-md hover:bg-orange-700 transition disabled:opacity-50'
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

        </form>
      </div>
    </div>
  );
}