'use client';
import Image from "next/image";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const totalSlides = 3; // Number of slides to show
  const autoPlayInterval = 3000; // 3 seconds between slides

  const heroImages = [
    {
      image: "/images/hero/herophone.jpg",
      title: "iPhone 14 Series",
      subtitle: "Up to 10% off Voucher"
    },
    {
      image: "/images/hero/iphone142.jpg",
      title: "iPhone 14 Pro",
      subtitle: "Pro. Beyond."
    },
    {
      image: "/images/hero/iphone143.png",
      title: "iPhone 14 Plus",
      subtitle: "Big and bigger."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isAutoPlaying) {
      timer = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isAutoPlaying, currentSlide]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <div className="flex-1 relative flex items-center">
      <div 
        className="relative w-full h-[300px] md:h-[342px] rounded-md md:rounded-lg overflow-hidden bg-black flex items-center md:border md:border-gray-200"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col md:flex-row items-center w-full h-full p-4 md:p-12 text-white max-w-full">
          <div className="w-full md:w-1/2 flex flex-col justify-center mb-4 md:mb-0">
            <div className="flex items-center gap-2 mb-3 md:mb-4 transition-all duration-700 ease-in-out">
              <Image 
                src="/images/hero/applelogo.png" 
                alt="Apple" 
                width={24} 
                height={24} 
                className="w-5 h-5 md:w-6 md:h-6"
                priority
              />
              <p className="text-sm md:text-base transition-all duration-700 ease-in-out">{heroImages[currentSlide].title}</p>
            </div>
            <h2 className="text-xl md:text-4xl font-bold mb-3 md:mb-4 transition-all duration-700 ease-in-out">{heroImages[currentSlide].subtitle}</h2>
            <div className="mt-4 md:mt-6">
              <button className="flex items-center gap-1 hover:opacity-80 transition-opacity text-sm md:text-base">
                <span className="font-medium underline">Shop Now</span>
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-full flex justify-center items-center relative">
            <div className="relative w-[200px] h-[150px] md:w-[400px] md:h-[300px]">
              <Image 
                src={heroImages[currentSlide].image}
                alt={heroImages[currentSlide].title}
                fill
                className="object-contain transition-all duration-700 ease-in-out transform"
                priority
              />
            </div>
            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-1 md:left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-1.5 md:p-2 rounded-full transition-all duration-300 ease-in-out touch-manipulation"
            >
              <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-1 md:right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-1.5 md:p-2 rounded-full transition-all duration-300 ease-in-out touch-manipulation"
            >
              <FiChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
            {/* Slide Indicators */}
            <div className="absolute bottom-2 md:bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 md:gap-2 w-full">
              {[...Array(totalSlides)].map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 md:w-2 md:h-2 rounded-full transition-all duration-300 ease-in-out ${
                    currentSlide === idx ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
