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
            <div className="relative z-[9999]">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <button
                            className={cn(
                                "text-white hover:text-primary transition-colors relative",
                                isFullscreen && "hover:text-orange-1"
                            )}
                            title="Playback Speed"
                        >
                            <Gauge className={cn("h-5 w-5", isFullscreen && "h-6 w-6")} stroke="white" />
                            <span className="absolute -bottom-2 -right-2 text-[8px] bg-orange-1 text-white rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                                {playbackRate}x
                            </span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        className="z-[9999] bg-black border border-gray-700 shadow-lg rounded-md p-1 min-w-[80px] mt-2"
                        align="end"
                        sideOffset={5}
                        forceMount
                        style={{ 
                            backgroundColor: "#1b1f29",
                            color: "white"
                        }}
                    >
                        {speedOptions.map((rate) => (
                            <DropdownMenuItem
                                key={rate}
                                onClick={() => handlePlaybackRateChange(rate)}
                                className={cn(
                                    "cursor-pointer text-gray-300 hover:bg-gray-800 focus:bg-gray-800 focus:text-white rounded px-3 py-2 text-sm",
                                    playbackRate === rate && "text-orange-1 font-medium bg-gray-900"
                                )}
                            >
                                {rate}x
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default AudioSettingsControl;