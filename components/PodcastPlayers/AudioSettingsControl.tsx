"use client";
import { Volume2, VolumeX, Gauge } from "lucide-react";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface AudioSettingsControlProps {
    // Volume props
    isMuted: boolean;
    toggleMute: () => void;
    volume: number;
    handleVolumeChange: (value: number[]) => void;
    // Playback speed props
    playbackRate: number;
    handlePlaybackRateChange: (rate: number) => void;
    // Common props
    variant?: "compact" | "fullscreen";
    className?: string;
}

const AudioSettingsControl = ({
    isMuted,
    toggleMute,
    volume,
    handleVolumeChange,
    playbackRate,
    handlePlaybackRateChange,
    variant = "compact",
    className,
}: AudioSettingsControlProps) => {
    const isFullscreen = variant === "fullscreen";
    const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

    return (
        <div className={cn("flex items-center gap-4", className)}>
            {/* Volume Control */}
            <div className={cn("flex items-center gap-2")}>
                <button
                    onClick={toggleMute}
                    className={cn(
                        "text-white hover:text-primary transition-colors",
                        isFullscreen && "hover:text-orange-1"
                    )}
                    title="Toggle Mute (M)"
                >
                    {isMuted ? (
                        <VolumeX className={cn("h-5 w-5", isFullscreen && "h-6 w-6")} stroke="white" />
                    ) : (
                        <Volume2 className={cn("h-5 w-5", isFullscreen && "h-6 w-6")} stroke="white" />
                    )}
                </button>
                <Slider
                    defaultValue={[1]}
                    max={1}
                    step={0.1}
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    className={cn("w-20", isFullscreen && "w-24")}
                />
            </div>

            {/* Playback Speed Control */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className={cn(
                            "text-white hover:text-primary transition-colors",
                            isFullscreen && "hover:text-orange-1"
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
        </div>
    );
};

export default AudioSettingsControl;