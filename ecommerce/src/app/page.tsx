'use client';
import Sidebar from '@/sections/Homepage/Sidebar';
import HeroSection from '@/sections/Homepage/HeroSection';
import FlashSalesSection from '@/sections/Homepage/FlashSalesSection';
import BestSellingSection from '@/sections/Homepage/BestSellingSection';
import EnhanceMusicSection from '@/sections/Homepage/EnhanceMusicSection';
import ProductShowcaseSection from '@/sections/Homepage/ProductShowcaseSection';
import NewArrivalSection from '@/sections/Homepage/NewArrivalSection';

export default function Home() {
  return (
    <div className="w-full bg-white">
      {/* Main content */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-0 md:gap-8 items-stretch md:items-start px-2 md:px-4 py-6">
        <Sidebar />
        <HeroSection />
      </div>
      
      <FlashSalesSection />
      <BestSellingSection />
      <EnhanceMusicSection />
      <ProductShowcaseSection />
      <NewArrivalSection />
    </div>
  );
}
