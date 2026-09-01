import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='fixed bottom-0 left-0 w-full z-50 bg-orange-900 text-orange-100 py-3'>
      <div className='max-w-6xl mx-auto px-4 flex flex-col gap-2'>

        <div className='flex flex-col sm:flex-row justify-between items-center gap-2'>
          <p className='text-sm'>
            © {new Date().getFullYear()} Trade My Property. All rights reserved.
          </p>
          <div className='flex flex-wrap gap-4 text-sm'>
            <Link href="/about" className='hover:text-white'>About</Link>
            <Link href="/contact" className='hover:text-white'>Contact</Link>
            <Link href="/terms" className='hover:text-white'>Terms & Conditions</Link>
            <Link href="/privacy" className='hover:text-white'>Privacy Policy</Link>
            <Link href="/refund-policy" className='hover:text-white'>Refund Policy</Link>
          </div>
        </div>

        {/* Legal business entity info - required for payment gateway compliance */}
        <p className='text-xs text-orange-200 text-center sm:text-left border-t border-orange-800 pt-2'>
          Trade My Property is operated by SHUBHAM SHIKHAR JEWELLERS, 0, Jhugiya Bazar, Sadar, Gorakhpur, Uttar Pradesh, 273013
        </p>

      </div>
    </footer>
  );
}