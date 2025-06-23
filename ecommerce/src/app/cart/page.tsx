'use client';
import CartSection from '@/sections/Cart/CartSection';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Cart() {
  return (
    <div className={`min-h-screen w-full bg-white ${poppins.className}`}>
      <div className="py-8">
        <CartSection />
      </div>
    </div>
  );
}
