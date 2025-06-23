'use client';
import React from 'react';

interface SectionHeaderProps {
  indicator: string;
  title: string;
  children?: React.ReactNode;
}

const SectionHeader = ({ indicator, title, children }: SectionHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div>
        <div className="flex items-center">
          <div className="bg-[#DB4444] h-6 sm:h-8 w-3 sm:w-4 rounded mr-2"></div>
          <p className="text-[#DB4444] font-semibold text-sm sm:text-base">{indicator}</p>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold mt-2 sm:mt-4 text-black">{title}</h2>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );
};

export default SectionHeader;
