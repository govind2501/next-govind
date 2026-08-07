import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='fixed bottom-0 left-0 w-full z-50 bg-orange-900 text-orange-100 py-6'>
      <div className='max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4'>
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
    </footer>
  );
}