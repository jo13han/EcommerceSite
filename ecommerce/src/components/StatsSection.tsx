"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Stat {
    icon: string;
    value: string;
    label: string;
    highlight?: boolean;
}

interface StatsSectionProps {
    stats: Stat[];
    className?: string;
}

function useCountUp(target: number, duration = 1200) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = target;
        if (start === end) return;
        const increment = end / (duration / 16);
        let current = start;
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return count;
}

export default function StatsSection({ stats, className = "" }: StatsSectionProps) {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 ${className}`}>
            {stats.map((stat, i) => {
                const target = Number(stat.value.replace(/[^\d.]/g, ""));
                const count = useCountUp(target, 1200 + i * 200);
                const suffix = stat.value.includes('k') ? 'k' : '';
                return (
                    <div
                        key={i}
                        className={`flex flex-col items-center justify-center rounded-lg border p-8 text-center text-black ${
                            stat.highlight
                                ? "bg-[#DB4444] border-[#DB4444]"
                                : "bg-white text-black border-gray-200"
                        }`}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-300">
                                <span
                                    className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${
                                        stat.highlight ? "bg-white" : "bg-black"
                                    }`}
                                >
                                    <Image
                                        src={stat.icon}
                                        alt="icon"
                                        width={32}
                                        height={32}
                                        className={stat.highlight ? "" : "filter invert brightness-0"}
                                    />
                                </span>
                            </span>
                        </div>
                        <div
                            className={`text-3xl font-bold mb-2 ${
                                stat.highlight ? "text-white" : "text-black"
                            }`}
                        >
                            {count}
                            {suffix}
                        </div>
                        <div
                            className={`text-base font-medium ${
                                stat.highlight ? "text-white" : "text-black"
                            }`}
                        >
                            {stat.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
} 