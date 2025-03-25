"use client";
import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface FullscreenSpeedControlProps {
    playbackRate: number;
    handlePlaybackRateChange: (rate: number) => void;
}

const FullscreenSpeedControl = ({
    playbackRate,
    handlePlaybackRateChange,
}: FullscreenSpeedControlProps) => {
    const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center gap-1 text-gray-400 hover:text-orange-1 transition-colors"
                title="Playback Speed"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Gauge className="h-6 w-6" stroke="white" />
                <span className="text-sm">
                    {playbackRate}x
                </span>
            </button>

            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 bg-black-2 border border-white-1/10 rounded-md shadow-lg overflow-hidden z-[999999]">
                    <div className="flex flex-col">
                        {speedOptions.map((rate) => (
                            <button
                                key={rate}
                                onClick={() => {
                                    handlePlaybackRateChange(rate);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "cursor-pointer text-gray-300 hover:bg-gray-800 focus:bg-gray-800 focus:text-white px-4 py-2 text-sm text-left whitespace-nowrap",
                                    playbackRate === rate && "text-orange-1 font-medium bg-gray-900"
                                )}
                            >
                                {rate}x
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FullscreenSpeedControl;