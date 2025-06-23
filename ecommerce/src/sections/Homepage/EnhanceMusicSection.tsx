'use client';
import { useState, useEffect } from "react";
import Image from "next/image";

interface TimerCircleProps {
  value: string;
  label: string;
}

const TimerCircle = ({ value, label }: TimerCircleProps) => (
  <div className="bg-white rounded-full h-16 w-16 flex flex-col items-center justify-center">
    <span className="text-black font-bold text-lg">{value}</span>
    <span className="text-black text-xs">{label}</span>
  </div>
);

const EnhanceMusicSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 23,
    minutes: 59,
    seconds: 35
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        // Decrease seconds
        let newSeconds = prevTime.seconds - 1;
        let newMinutes = prevTime.minutes;
        let newHours = prevTime.hours;
        let newDays = prevTime.days;

        // Handle seconds rollover
        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }

        // Handle minutes rollover
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        // Handle hours rollover
        if (newHours < 0) {
          newHours = 23;
          newDays -= 1;
        }

        // If timer is complete, reset to default values
        if (newDays < 0) {
          return { days: 5, hours: 23, minutes: 59, seconds: 35 };
        }

        return {
          days: newDays,
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Format numbers to always show two digits
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="w-full mt-16 pt-10">
      <div className="container mx-auto px-4">
        <div className="bg-black rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
          
            <div className="p-8 md:p-12 md:w-1/2">
              <p className="text-[#00FF66] text-sm font-semibold">Categories</p>
              <h2 className="text-white text-3xl md:text-4xl font-medium mt-4 mb-6">
                Enhance Your Music Experience
              </h2>
              
      
              <div className="flex gap-4 my-6">
                <TimerCircle value={formatNumber(timeLeft.hours)} label="Hours" />
                <TimerCircle value={formatNumber(timeLeft.days)} label="Days" />
                <TimerCircle value={formatNumber(timeLeft.minutes)} label="Minutes" />
                <TimerCircle value={formatNumber(timeLeft.seconds)} label="Seconds" />
              </div>
              

              <button className="bg-[#00FF66] text-white px-8 py-3 rounded-md mt-6 hover:bg-green-500 transition-colors cursor-pointer">
                Buy Now!
              </button>
            </div>
            
      
            <div className="md:w-1/2 flex items-center justify-center relative">
              <div 
                className="absolute inset-0 rounded-lg opacity-50" 
                style={{ background: 'radial-gradient(circle, white 0%, black 80%)' }}
              ></div>
              <div className="relative z-10">
                <Image src="/images/JBLboombox.png" alt="Boombox" width={450} height={400} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhanceMusicSection;
