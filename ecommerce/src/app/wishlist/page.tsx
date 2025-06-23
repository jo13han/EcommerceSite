'use client';
import WishlistSection from '@/sections/Wishlist/WishlistSection';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Wishlist() {
  return (
    <div className={`min-h-screen w-full bg-white ${poppins.className}`}>
      <div className="py-8">
        <WishlistSection />
      </div>
    </div>
  );
}