'use client'

import React, { useState } from 'react';
import RefundPolicyContent from '@/components/RefundPolicyContent';

export default function RefundPolicyPage() {
  const [language, setLanguage] = useState<"en" | "hi">("en");

  return (
    <div className='min-h-screen px-4 py-12 bg-slate-100'>
      <div className='max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-10'>

        <div className='flex justify-between items-start flex-wrap gap-3 mb-6'>
          <h1 className='text-3xl font-bold text-orange-900'>
            Refund & Cancellation Policy
          </h1>
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className='text-sm font-semibold text-orange-700 border border-orange-400 rounded-md px-3 py-1 hover:bg-orange-50'
          >
            {language === "en" ? "हिंदी में पढ़ें" : "Read in English"}
          </button>
        </div>

        <RefundPolicyContent language={language} />

      </div>
    </div>
  );
}