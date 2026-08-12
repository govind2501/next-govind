'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface PageStat {
  _id: string;
  totalVisits: number;
  averageDurationSeconds: number;
  totalDurationSeconds: number;
}

interface FeedbackItem {
  _id: string;
  user: { username: string; email: string } | null;
  visitorId: string;
  page: string;
  reason: string;
  message: string;
  createdAt: string;
}

export default function AnalyticsClient({
  initialStats,
  initialFeedbackList,
}: {
  initialStats: PageStat[];
  initialFeedbackList: FeedbackItem[];
}) {
  const router = useRouter();
  const [stats, setStats] = useState<PageStat[]>(initialStats);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(initialFeedbackList);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingPage, setDeletingPage] = useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN");
  };

  const handleDeleteStats = async (page: string) => {
    try {
      setDeletingPage(page);
      await axios.delete(`/api/admin/analytics?page=${encodeURIComponent(page)}`);
      toast.success("Visit data deleted");
      setStats((prev) => prev.filter((stat) => stat._id !== page));
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not delete visit data");
    } finally {
      setDeletingPage(null);
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    try {
      setDeletingId(feedbackId);
      await axios.delete(`/api/admin/feedback/${feedbackId}`);
      toast.success("Feedback deleted");
      setFeedbackList((prev) => prev.filter((fb) => fb._id !== feedbackId));
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not delete feedback");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className='min-h-screen p-6'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl font-bold text-white drop-shadow-md mb-6'>
          Visitor Analytics & Feedback
        </h1>

        {/* Page-wise Stats */}
        <h2 className='text-lg font-bold text-white drop-shadow-md mb-3'>Page Visit Statistics</h2>
        <div className='overflow-x-auto bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl mb-8'>
          <table className='w-full text-left text-sm border-collapse'>
            <thead>
              <tr className='bg-orange-800'>
                <th className='p-3 text-white font-bold border border-orange-900'>Page</th>
                <th className='p-3 text-white font-bold border border-orange-900'>Total Visits</th>
                <th className='p-3 text-white font-bold border border-orange-900'>Average Time Spent</th>
                <th className='p-3 text-white font-bold border border-orange-900'>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat, index) => (
                <tr key={stat._id} className={index % 2 === 0 ? "bg-yellow-50 dark:bg-slate-700" : "bg-white dark:bg-slate-800"}>
                  <td className='p-3 text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600'>{stat._id}</td>
                  <td className='p-3 text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600'>{stat.totalVisits}</td>
                  <td className='p-3 text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600'>
                    {formatDuration(stat.averageDurationSeconds)}
                  </td>
                  <td className='p-3 border border-gray-300 dark:border-gray-600'>
                    <button
                      onClick={() => handleDeleteStats(stat._id)}
                      disabled={deletingPage === stat._id}
                      className='text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs font-bold border border-red-300 dark:border-red-500 rounded px-2 py-1 disabled:opacity-50'
                    >
                      {deletingPage === stat._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {stats.length === 0 && (
          <div className='bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-6 text-center mb-8'>
            <p className='text-gray-500 dark:text-gray-400'>No visit data yet</p>
          </div>
        )}

        {/* Feedback List */}
        <h2 className='text-lg font-bold text-white drop-shadow-md mb-3'>Customer Feedback</h2>
        <div className='flex flex-col gap-3'>
          {feedbackList.map((fb) => (
            <div key={fb._id} className='bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-4'>
              <div className='flex justify-between items-start flex-wrap gap-2'>
                <span className='font-bold text-orange-900 dark:text-orange-300'>{fb.reason}</span>
                <div className='flex items-center gap-3'>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>{formatDate(fb.createdAt)}</span>
                  <button
                    onClick={() => handleDeleteFeedback(fb._id)}
                    disabled={deletingId === fb._id}
                    className='text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs font-bold border border-red-300 dark:border-red-500 rounded px-2 py-1 disabled:opacity-50'
                  >
                    {deletingId === fb._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-300 mt-1'>Page: {fb.page}</p>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                From: {fb.user ? `${fb.user.username} (${fb.user.email})` : "Anonymous visitor"}
              </p>
              {fb.message && (
                <p className='text-gray-800 dark:text-gray-200 mt-2 border-t border-gray-300 dark:border-gray-600 pt-2'>{fb.message}</p>
              )}
            </div>
          ))}
        </div>
        {feedbackList.length === 0 && (
          <div className='bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-6 text-center mt-6'>
            <p className='text-gray-500 dark:text-gray-400'>No feedback yet</p>
          </div>
        )}
      </div>
    </div>
  );
}