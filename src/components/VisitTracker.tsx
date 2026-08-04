'use client'

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';

const HEARTBEAT_INTERVAL_MS = 15000; // send a heartbeat every 15 seconds
const INACTIVITY_THRESHOLD_MS = 40000; // show feedback popup after 40 seconds of no activity
const CHECK_INTERVAL_MS = 5000; // check for inactivity every 5 seconds

const FEEDBACK_REASONS = [
  "Could not understand the price",
  "Could not find the right property",
  "Website is slow",
  "Subscribing felt difficult",
  "Other",
];

// Get (or create) a unique ID for this browser, stored in localStorage
function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("visitorId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitorId", id);
  }
  return id;
}

export default function VisitTracker() {
  const pathname = usePathname();

  const visitIdRef = useRef<string | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const feedbackShownRef = useRef<boolean>(false);

  const [showFeedback, setShowFeedback] = useState(false);
  const [reason, setReason] = useState(FEEDBACK_REASONS[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Start a new visit record whenever the page (pathname) changes
  useEffect(() => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    feedbackShownRef.current = false;
    setShowFeedback(false);
    setSubmitted(false);
    lastActivityRef.current = Date.now();

    const startVisit = async () => {
      try {
        const response = await axios.post("/api/tracking/start", {
          visitorId,
          page: pathname,
        });
        visitIdRef.current = response.data.visitId;
      } catch (error) {
        // Tracking failures should never disturb the user experience
        visitIdRef.current = null;
      }
    };

    startVisit();

    // Heartbeat - tells the backend the visitor is still here
    const heartbeatInterval = setInterval(async () => {
      if (!visitIdRef.current) return;
      try {
        await axios.post("/api/tracking/heartbeat", {
          visitId: visitIdRef.current,
        });
      } catch (error) {
        // Ignore heartbeat failures silently
      }
    }, HEARTBEAT_INTERVAL_MS);

    // Track user activity (mouse, scroll, keyboard, touch)
    const markActive = () => {
      lastActivityRef.current = Date.now();
    };
    window.addEventListener("mousemove", markActive);
    window.addEventListener("scroll", markActive);
    window.addEventListener("keydown", markActive);
    window.addEventListener("touchstart", markActive);
    window.addEventListener("click", markActive);

    // Check periodically whether the user has been inactive too long
    const inactivityInterval = setInterval(() => {
      const idleFor = Date.now() - lastActivityRef.current;
      if (idleFor >= INACTIVITY_THRESHOLD_MS && !feedbackShownRef.current) {
        feedbackShownRef.current = true;
        setShowFeedback(true);
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(inactivityInterval);
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("scroll", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("touchstart", markActive);
      window.removeEventListener("click", markActive);
    };
  }, [pathname]);

  const handleSubmitFeedback = async () => {
    const visitorId = getVisitorId();
    try {
      setSubmitting(true);
      await axios.post("/api/tracking/feedback", {
        visitorId,
        page: pathname,
        reason,
        message,
      });
      setSubmitted(true);
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    } catch (error) {
      // Fail quietly - this is a non-critical feature
      setShowFeedback(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDismiss = () => {
    setShowFeedback(false);
  };

  if (!showFeedback) return null;

  return (
    <div className='fixed bottom-4 right-4 z-50 w-80 bg-white border border-orange-300 rounded-lg shadow-xl p-4'>
      {submitted ? (
        <p className='text-green-700 font-semibold text-center py-4'>
          Thank you for your feedback!
        </p>
      ) : (
        <>
          <div className='flex justify-between items-start mb-2'>
            <h3 className='font-bold text-orange-900'>Having trouble finding something?</h3>
            <button
              onClick={handleDismiss}
              className='text-gray-400 hover:text-gray-600 font-bold text-lg leading-none'
            >
              ✕
            </button>
          </div>

          <p className='text-sm text-gray-600 mb-3'>
            Let us know what's not working so we can improve.
          </p>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className='w-full p-2 border border-gray-400 rounded-md text-black text-sm mb-2'
          >
            {FEEDBACK_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Anything else you'd like to add? (optional)"
            rows={2}
            className='w-full p-2 border border-gray-400 rounded-md text-black text-sm mb-3'
          />

          <div className='flex gap-2'>
            <button
              onClick={handleSubmitFeedback}
              disabled={submitting}
              className='flex-1 bg-orange-600 text-black font-bold py-2 rounded-md text-sm disabled:opacity-50'
            >
              {submitting ? "Sending..." : "Send Feedback"}
            </button>
            <button
              onClick={handleDismiss}
              className='px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600'
            >
              No thanks
            </button>
          </div>
        </>
      )}
    </div>
  );
}