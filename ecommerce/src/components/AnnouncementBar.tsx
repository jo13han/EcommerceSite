'use client';
import { FiChevronDown } from "react-icons/fi";

interface AnnouncementBarProps {
  message: string;
  language?: string;
}

const AnnouncementBar = ({ message, language = 'English' }: AnnouncementBarProps) => {
  return (
    <>
      <div className="w-full bg-black text-white text-sm py-2 px-4 flex justify-between items-center">
        <p className="text-center flex-1">{message}</p>
        <div className="flex items-center gap-2">
          <span>{language}</span>
          <FiChevronDown className="h-4 w-4" />
        </div>
      </div>
      <div className="w-full h-px bg-gray-300"></div>
    </>
  );
};

export default AnnouncementBar;
