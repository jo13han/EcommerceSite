'use client';
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

interface NavigationArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
  variant?: 'rounded' | 'circular';
  className?: string;
}

const NavigationArrows = ({ 
  onPrevious, 
  onNext, 
  variant = 'rounded',
  className = '' 
}: NavigationArrowsProps) => {
  const baseClasses = variant === 'circular' 
    ? "w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-200 cursor-pointer transition-colors"
    : "w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors";

  return (
    <div className={`flex gap-4 ${className}`}>
      <button 
        className={baseClasses}
        onClick={onPrevious}
        aria-label="Previous"
      >
        <FiArrowLeft className="text-lg text-black" />
      </button>
      <button 
        className={baseClasses}
        onClick={onNext}
        aria-label="Next"
      >
        <FiArrowRight className="text-lg text-black" />
      </button>
    </div>
  );
};

export default NavigationArrows;
