export default function PrivacyPolicyContent({ language }: { language: "en" | "hi" }) {
  if (language === "en") {
    return (
      <div className='text-gray-700 leading-relaxed flex flex-col gap-4'>
        <p>
          This Privacy Policy explains how Trade My Property ("we", "us") collects, uses,
          and protects your information when you use our website.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>1. Information We Collect</h2>
        <p>
          When you sign up, we collect your username, email address, and password. When you
          list a property or requirement, we collect your name, contact phone number, email,
          and property details you choose to share. We also collect basic visit information
          (pages viewed, time spent) to improve our website.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>2. How We Use Your Information</h2>
        <p>
          We use your information to create and manage your account, display your property
          listings to subscribed users, send you emails (such as OTP verification, password
          reset, and feedback responses), and improve our platform based on how it is used.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>3. Sharing of Information</h2>
        <p>
          Your contact details (name, phone, email) on a property listing are shown only to
          users who have an active subscription for that property's district. We do not sell
          your personal information to third parties.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>4. Data Security</h2>
        <p>
          We take reasonable measures to protect your data, including encrypted passwords and
          secure database access. However, no method of transmission over the internet is
          100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>5. Cookies and Tracking</h2>
        <p>
          We use basic tracking (via a browser-based identifier) to understand how visitors
          use our website, such as which pages are viewed and how long visitors stay. This
          helps us improve the platform.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>6. Your Choices</h2>
        <p>
          You can update your account information at any time. If you wish to have your
          account or data removed, please contact us through our Contact Us page.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Continued use of the Platform
          after changes are posted constitutes acceptance of the revised policy.
        </p>

        <p className='mt-4 text-sm text-gray-500'>
          Last updated: August 2026
        </p>
      </div>
    );
  }

  return (
    <div className='text-gray-700 leading-relaxed flex flex-col gap-4'>
      <p>
        ये Privacy Policy बताती है कि Trade My Property ("हम") आपकी जानकारी को कैसे collect,
        इस्तेमाल, और सुरक्षित करती है जब आप हमारी website इस्तेमाल करते हैं।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>1. हम कौन सी जानकारी लेते हैं</h2>
      <p>
        Signup करते वक्त हम आपका username, email, और password लेते हैं। जब आप कोई property या
        requirement post करते हैं, तब हम आपका नाम, contact phone, email, और property की डिटेल्स
        लेते हैं जो आप देना चाहें। हम website बेहतर बनाने के लिए basic visit जानकारी (कौन सा
        page देखा, कितनी देर रुके) भी collect करते हैं।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>2. जानकारी का इस्तेमाल कैसे होता है</h2>
      <p>
        हम आपकी जानकारी का इस्तेमाल account बनाने और manage करने, subscribed users को आपकी
        listings दिखाने, आपको emails (जैसे OTP verification, password reset, feedback जवाब)
        भेजने, और platform को बेहतर बनाने के लिए करते हैं।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>3. जानकारी साझा करना</h2>
      <p>
        Property listing पर आपके contact details (नाम, फोन, email) सिर्फ उन्हीं users को दिखते
        हैं जिन्होंने उस district की active subscription ली हो। हम आपकी personal जानकारी किसी
        तीसरे पक्ष को नहीं बेचते।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>4. डेटा सुरक्षा</h2>
      <p>
        हम आपके डेटा को सुरक्षित रखने के लिए उचित कदम उठाते हैं, जैसे encrypted passwords और
        सुरक्षित database access। लेकिन इंटरनेट पर कोई भी तरीका 100% सुरक्षित नहीं होता, इसलिए
        हम पूर्ण सुरक्षा की गारंटी नहीं दे सकते।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>5. Cookies और Tracking</h2>
      <p>
        हम एक browser-based पहचान (identifier) के ज़रिए basic tracking करते हैं, ताकि समझ सकें
        visitors website कैसे इस्तेमाल कर रहे हैं — जैसे कौन से pages देखे गए और कितनी देर रुके।
        इससे platform बेहतर बनाने में मदद मिलती है।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>6. आपके विकल्प</h2>
      <p>
        आप कभी भी अपनी account जानकारी अपडेट कर सकते हैं। अगर आप अपना account या डेटा हटवाना
        चाहते हैं, तो कृपया हमारे Contact Us page के ज़रिए संपर्क करें।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>7. इस Policy में बदलाव</h2>
      <p>
        हम समय-समय पर इस Privacy Policy को अपडेट कर सकते हैं। बदलाव के बाद Platform का इस्तेमाल
        जारी रखने का मतलब है कि आप नई policy से सहमत हैं।
      </p>

      <p className='mt-4 text-sm text-gray-500'>
        आखिरी बार अपडेट: अगस्त 2026
      </p>
    </div>
  );
}