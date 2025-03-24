"use client";
import { Gauge } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PlaybackSpeedControlProps {
    playbackRate: number;
    handlePlaybackRateChange: (rate: number) => void;
    variant?: "compact" | "fullscreen";
    className?: string;
}

const PlaybackSpeedControl = ({
    playbackRate,
    handlePlaybackRateChange,
    variant = "compact",
    className,
}: PlaybackSpeedControlProps) => {
    const isFullscreen = variant === "fullscreen";
    const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "text-white hover:text-primary transition-colors",
                        isFullscreen && "hover:text-orange-1",
                        className
                    )}
                    title="Playback Speed"
                >
                    <Gauge className={cn("h-5 w-5", isFullscreen && "h-6 w-6")} stroke="white" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {speedOptions.map((rate) => (
                    <DropdownMenuItem
                        key={rate}
                        onClick={() => handlePlaybackRateChange(rate)}
                        className={cn(
                            "cursor-pointer text-gray-600 bg-black-3 hover:bg-black-2",
                            playbackRate === rate && (isFullscreen ? "text-white-1" : "text-[#ffffff]")
                        )}
                    >
                        {rate}x
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PlaybackSpeedControl;