export default function RefundPolicyContent({ language }: { language: "en" | "hi" }) {
  if (language === "en") {
    return (
      <div className='text-gray-700 leading-relaxed flex flex-col gap-4'>
        <p>
          This Refund & Cancellation Policy applies to all subscription payments made on
          Trade My Property.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>1. No Refunds</h2>
        <p>
          All subscription payments (Monthly, Quarterly, or Yearly plans) made to unlock
          contact details in a district or to post property listings are{" "}
          <strong>final and non-refundable</strong>. This applies regardless of the reason,
          including but not limited to:
        </p>
        <ul className='list-disc list-inside ml-2'>
          <li>Change of mind after subscribing</li>
          <li>Inability to find a suitable property or buyer in the subscribed district</li>
          <li>Dissatisfaction with the number or quality of listings available</li>
          <li>Not using the subscription for the full duration</li>
        </ul>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>2. Subscription Duration</h2>
        <p>
          Once activated, a subscription remains valid for the plan duration selected
          (1 month, 3 months, or 1 year) and cannot be paused, extended, or transferred to
          another district or account.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>3. Failed or Duplicate Payments</h2>
        <p>
          If a payment is deducted from your account but the subscription was not activated
          due to a technical error, please contact us through our Contact Us page with your
          payment details. We will investigate and resolve genuine technical failures, which
          may result in the subscription being activated or the amount being reversed as
          applicable.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>4. Cancellation</h2>
        <p>
          Since subscriptions are activated instantly and provide immediate access to
          district-wise listings and contact details, cancellation requests after activation
          will not be accepted or refunded.
        </p>

        <h2 className='text-lg font-bold text-orange-900 mt-2'>5. Contact Us</h2>
        <p>
          For any payment-related queries or concerns, please reach out through our{" "}
          Contact Us page, and we will respond as soon as possible.
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
        ये Refund & Cancellation Policy Trade My Property पर किए गए सभी subscription payments
        पर लागू होती है।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>1. कोई Refund नहीं</h2>
      <p>
        किसी भी district के contact details देखने या property listing डालने के लिए किया गया
        सभी subscription payment (Monthly, Quarterly, या Yearly plan) <strong>अंतिम और
        non-refundable</strong> होता है। ये किसी भी वजह से लागू होता है, जैसे:
      </p>
      <ul className='list-disc list-inside ml-2'>
        <li>Subscribe करने के बाद इरादा बदल जाना</li>
        <li>Subscribe किए गए district में सही property या buyer न मिलना</li>
        <li>Listings की संख्या या गुणवत्ता से संतुष्ट न होना</li>
        <li>Subscription को पूरी अवधि तक इस्तेमाल न करना</li>
      </ul>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>2. Subscription की अवधि</h2>
      <p>
        Activate होने के बाद, subscription चुनी गई अवधि (1 महीना, 3 महीने, या 1 साल) तक valid
        रहती है, और इसे रोका (pause), बढ़ाया (extend), या किसी दूसरे district/account में
        transfer नहीं किया जा सकता।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>3. Failed या Duplicate Payments</h2>
      <p>
        अगर आपके account से पैसे कट गए हों पर technical error की वजह से subscription activate
        नहीं हुई, तो कृपया अपने payment details के साथ हमारे Contact Us page से संपर्क करें।
        हम genuine technical समस्याओं की जांच करके subscription activate करेंगे या राशि वापस
        करेंगे, जैसा उचित हो।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>4. Cancellation</h2>
      <p>
        चूंकि subscription तुरंत activate हो जाती है और district-wise listings व contact
        details का access तुरंत मिल जाता है, activate होने के बाद cancellation की request
        स्वीकार या refund नहीं की जाएगी।
      </p>

      <h2 className='text-lg font-bold text-orange-900 mt-2'>5. संपर्क करें</h2>
      <p>
        किसी भी payment से जुड़े सवाल या समस्या के लिए, कृपया हमारे Contact Us page से संपर्क
        करें, हम जल्द से जल्द जवाब देंगे।
      </p>

      <p className='mt-4 text-sm text-gray-500'>
        आखिरी बार अपडेट: अगस्त 2026
      </p>
    </div>
  );
}