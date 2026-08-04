export default function TermsContent({ language }: { language: "en" | "hi" }) {
  if (language === "en") {
    return (
      <div className='text-gray-700 leading-relaxed flex flex-col gap-4'>
        <p>
          By using Trade My Property ("the Platform"), you agree to the following terms:
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>1. Independent Verification</h2>
        <p>
          All property listings, buyer requirements, prices, and contact details on this
          Platform are provided by users. You are solely responsible for independently
          verifying the ownership, legal status, documents, and accuracy of any property
          or requirement before entering into any transaction or agreement.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>2. No Liability</h2>
        <p>
          The Platform and its owner act only as a medium to connect buyers, sellers, and
          renters. We do not own, inspect, verify, or guarantee any property listed on the
          Platform. The Platform owner shall not be held responsible or liable for any
          loss, dispute, fraud, misrepresentation, or damage arising from any transaction,
          communication, or agreement between users.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>3. Admin Approval</h2>
        <p>
          Listings are reviewed by our admin team before being published, but this review
          does not constitute a guarantee of the property's legitimacy, ownership, or
          condition. Admin approval is a basic quality check only, not a verification of
          legal title.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>4. Subscription & Payments</h2>
        <p>
          Subscription payments made on the Platform to unlock district-wise contact
          details or to post listings are <strong>non-refundable</strong> under any
          circumstances, including but not limited to change of mind, inability to find a
          suitable property, or dissatisfaction with listings in a subscribed district.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>5. User Conduct</h2>
        <p>
          Users agree not to post false, misleading, or fraudulent listings. The Platform
          reserves the right to remove any listing or suspend any account found violating
          these terms, without prior notice.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>6. Changes to Terms</h2>
        <p>
          These terms may be updated from time to time. Continued use of the Platform after
          changes are posted constitutes acceptance of the revised terms.
        </p>

        <p className='mt-4 text-sm text-gray-500'>
          Last updated: July 2026
        </p>
      </div>
    );
  }

  return (
    <div className='text-gray-700 leading-relaxed flex flex-col gap-4'>
      <p>
        Trade My Property ("यह वेबसाइट") का इस्तेमाल करके, आप निम्नलिखित शर्तों से सहमत होते हैं:
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>1. स्वयं जांच-पड़ताल करना</h2>
      <p>
        इस वेबसाइट पर मौजूद सभी properties, buyer requirements, कीमतें, और contact details
        users द्वारा खुद डाली जाती हैं। किसी भी सौदे में शामिल होने से पहले property के
        मालिकाना हक, कानूनी स्थिति, दस्तावेज़, और सही जानकारी की जांच करना पूरी तरह
        आपकी अपनी जिम्मेदारी है।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>2. कोई जिम्मेदारी नहीं</h2>
      <p>
        यह वेबसाइट और इसका मालिक सिर्फ खरीदारों, बेचने वालों, और किराए पर देने वालों को
        आपस में जोड़ने का माध्यम है। हम किसी भी property के मालिक नहीं हैं, न ही उसकी जांच
        या गारंटी करते हैं। किसी भी सौदे, बातचीत, या समझौते से होने वाले नुकसान, विवाद,
        धोखाधड़ी, या गलत जानकारी के लिए वेबसाइट का मालिक जिम्मेदार नहीं होगा।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>3. Admin Approval</h2>
      <p>
        Listings को publish होने से पहले हमारी admin team द्वारा देखा जाता है, पर इसका
        मतलब यह नहीं कि property असली है, मालिकाना हक सही है, या हालत अच्छी है। Admin
        approval सिर्फ एक बुनियादी जांच है, कानूनी मालिकाना हक की पुष्टि नहीं।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>4. Subscription और भुगतान</h2>
      <p>
        District-wise contact details देखने या listing डालने के लिए किया गया subscription
        भुगतान किसी भी हालत में <strong>वापस (refund) नहीं</strong> किया जाएगा — चाहे इरादा
        बदल जाए, सही property न मिले, या किसी district की listings से संतुष्टि न हो।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>5. User का व्यवहार</h2>
      <p>
        Users झूठी, भ्रामक, या धोखाधड़ी वाली listings न डालने के लिए सहमत होते हैं। इन
        शर्तों का उल्लंघन करने वाली किसी भी listing या account को बिना पहले से सूचना दिए
        हटाया/निलंबित किया जा सकता है।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>6. शर्तों में बदलाव</h2>
      <p>
        ये शर्तें समय-समय पर अपडेट हो सकती हैं। बदलाव के बाद वेबसाइट का इस्तेमाल जारी
        रखने का मतलब है कि आप नई शर्तों से सहमत हैं।
      </p>

      <p className='mt-4 text-sm text-gray-500'>
        आखिरी बार अपडेट: जुलाई 2026
      </p>
    </div>
  );
}