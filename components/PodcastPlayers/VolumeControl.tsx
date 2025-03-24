"use client";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils";

interface VolumeControlProps {
    isMuted: boolean;
    toggleMute: () => void;
    volume: number;
    handleVolumeChange: (value: number[]) => void;
    variant?: "compact" | "fullscreen";
    className?: string;
}

const VolumeControl = ({
    isMuted,
    toggleMute,
    volume,
    handleVolumeChange,
    variant = "compact",
    className,
}: VolumeControlProps) => {
    const isFullscreen = variant === "fullscreen";

    return (
        <div className={cn("flex items-center gap-2", className)}>
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
    );
};

export default VolumeControl;