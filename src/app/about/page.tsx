'use client'

import React, { useState } from 'react';
import TermsContent from '@/components/TermsContent';

export default function AboutPage() {
  const [language, setLanguage] = useState<"en" | "hi">("en");

  return (
    <div className='min-h-screen px-4 py-12'>
      <div className='max-w-3xl mx-auto bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-xl p-6 sm:p-10'>

        <div className='flex justify-between items-start flex-wrap gap-3 mb-6'>
          <h1 className='text-3xl font-bold text-orange-900 dark:text-orange-300'>
            {language === "en" ? "About Trade My Property" : "Trade My Property के बारे में"}
          </h1>
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className='text-sm font-semibold text-orange-700 dark:text-orange-300 border border-orange-400 dark:border-orange-500 rounded-md px-3 py-1 hover:bg-orange-50 dark:hover:bg-slate-700'
          >
            {language === "en" ? "हिंदी में पढ़ें" : "Read in English"}
          </button>
        </div>

        {language === "en" ? (
          <div className='flex flex-col gap-4'>
            <p className='text-gray-700 dark:text-gray-200 leading-relaxed'>
              Trade My Property is a real estate platform built for buyers, sellers, and
              renters across India. Whether you're looking to sell land, list a house, rent
              out a shop, or find your next property, we make it easy to connect directly
              with the right people — no middlemen involved.
            </p>

            <p className='text-gray-700 dark:text-gray-200 leading-relaxed'>
              Every listing on our platform is reviewed by our admin team before it goes
              live, so you can browse with confidence. We cover every state and district in
              India, and our district-based subscription plans mean you only pay for the
              areas that matter to you.
            </p>

            <p className='text-gray-700 dark:text-gray-200 leading-relaxed'>
              If you're a buyer, you can also post your own property requirement and let
              sellers reach out to you directly.
            </p>

            <h2 className='text-xl font-bold text-orange-900 dark:text-orange-300 mt-4'>
              Our Mission
            </h2>
            <p className='text-gray-700 dark:text-gray-200 leading-relaxed'>
              To make property buying, selling, and renting simple, transparent, and
              accessible for everyone in India — from big cities to small towns and villages.
            </p>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            <p className='text-gray-700 dark:text-gray-200 leading-relaxed'>
              Trade My Property एक रियल एस्टेट प्लेटफ़ॉर्म है जो पूरे भारत में खरीदारों,
              विक्रेताओं और किराए पर लेने वालों के लिए बनाया गया है। चाहे आप ज़मीन बेचना
              चाहते हों, घर लिस्ट करना चाहते हों, दुकान किराए पर देना चाहते हों या अपनी अगली
              प्रॉपर्टी ढूंढना चाहते हों, हम सही लोगों से सीधे जुड़ना आसान बनाते हैं — इसमें
              कोई बिचौलिया शामिल नहीं होता।
            </p>

            <p className='text-gray-700 dark:text-gray-200 leading-relaxed'>
              हमारे प्लेटफ़ॉर्म पर हर लिस्टिंग को लाइव होने से पहले हमारी एडमिन टीम रिव्यू
              करती है, ताकि आप भरोसे के साथ ब्राउज़ कर सकें। हम भारत के हर राज्य और ज़िले
              को कवर करते हैं, और हमारे ज़िले-आधारित सब्सक्रिप्शन प्लान का मतलब है कि आप
              सिर्फ़ उन इलाकों के लिए पैसे देते हैं जो आपके काम के हैं।
            </p>

            <p className='text-gray-700 dark:text-gray-200 leading-relaxed'>
              यदि आप एक खरीदार हैं, तो आप अपनी खुद की प्रॉपर्टी की आवश्यकता भी पोस्ट कर
              सकते हैं और विक्रेता सीधे आपसे संपर्क कर सकते हैं।
            </p>

            <h2 className='text-xl font-bold text-orange-900 dark:text-orange-300 mt-4'>
              हमारा मिशन
            </h2>
            <p className='text-gray-700 dark:text-gray-200 leading-relaxed'>
              भारत में सभी के लिए प्रॉपर्टी खरीदना, बेचना और किराए पर लेना सरल, पारदर्शी
              और सुलभ बनाना — बड़े शहरों से लेकर छोटे कस्बों और गांवों तक।
            </p>
          </div>
        )}

        <hr className='my-8 border-gray-300 dark:border-gray-600' />

        <h2 className='text-2xl font-bold text-orange-900 dark:text-orange-300 mb-4'>
          {language === "en" ? "Terms & Conditions" : "नियम और शर्तें"}
        </h2>

        <TermsContent language={language} />

      </div>
    </div>
  );
}