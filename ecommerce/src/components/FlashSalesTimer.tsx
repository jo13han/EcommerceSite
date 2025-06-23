'use client';
import { useState, useEffect } from 'react';

interface TimerUnitProps {
  value: string;
  label: string;
}

const TimerUnit = ({ value, label }: TimerUnitProps) => (
  <div className="text-center px-2">
    <p className="text-xs mb-1 text-black">{label}</p>
    <div className="flex items-center justify-center">
      <span className="text-4xl font-bold text-black">{value}</span>
    </div>
  </div>
);

const TimerSeparator = () => (
  <span className="text-4xl font-medium text-[#E07575]">:</span>
);

const FlashSalesTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56
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
          return { days: 3, hours: 23, minutes: 19, seconds: 56 };
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
    <div className="flex items-center gap-1">
      <TimerUnit value={formatNumber(timeLeft.days)} label="Days" />
      <TimerSeparator />
      <TimerUnit value={formatNumber(timeLeft.hours)} label="Hours" />
      <TimerSeparator />
      <TimerUnit value={formatNumber(timeLeft.minutes)} label="Minutes" />
      <TimerSeparator />
      <TimerUnit value={formatNumber(timeLeft.seconds)} label="Seconds" />
    </div>
  );
};

export default FlashSalesTimer;
