"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Slider } from "./ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Gauge,
  FastForward,
  Repeat,
  Minimize2,
  SkipBack,
  SkipForward,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";
import { formatTime } from "@/lib/formatTime";
import { Dialog, DialogContent } from "./ui/dialog";

interface FullscreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  togglePlayPause: () => void;
  duration: number;
  currentTime: number;
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  handleVolumeChange: (value: number[]) => void;
  playbackRate: number;
  handlePlaybackRateChange: (rate: number) => void;
  forward: () => void;
  rewind: () => void;
  isLooping: boolean;
  toggleLoop: () => void;
  audioDetails: {
    title: string;
    author: string;
    imageUrl: string;
  } | null;
}

const FullscreenPlayer = ({
  isOpen,
  onClose,
  audioRef,
  isPlaying,
  togglePlayPause,
  duration,
  currentTime,
  isMuted,
  toggleMute,
  volume,
  handleVolumeChange,
  playbackRate,
  handlePlaybackRateChange,
  forward,
  rewind,
  isLooping,
  toggleLoop,
  audioDetails,
}: FullscreenPlayerProps) => {
  const [seekValue, setSeekValue] = useState(0);

  useEffect(() => {
    setSeekValue((currentTime / duration) * 100 || 0);
  }, [currentTime, duration]);

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  if (!isOpen || !audioDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black-1 border-gray-800">
        <div className="flex flex-col h-full">
          {/* Background with blur */}
          <div className="absolute inset-0 z-0">
            <div className="relative w-full h-full">
              <Image
                src={audioDetails.imageUrl || "/icons/logo.png"}
                alt="background"
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-black-1/70 backdrop-blur-xl" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full p-8">
            {/* Header with close button */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white-1">Now Playing</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-white-1 hover:bg-gray-800"
                title="Exit Fullscreen"
              >
                <Minimize2 className="h-5 w-5" />
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {/* Album art */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={audioDetails.imageUrl || "/icons/logo.png"}
                  alt="album-cover"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Podcast info */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white-1 mb-2">{audioDetails.title}</h1>
                <p className="text-lg text-gray-400">{audioDetails.author}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-xl">
                <Slider
                  value={[seekValue]}
                  max={100}
                  step={0.1}
                  onValueChange={(value) => handleSeek(value)}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-8">
                <button
                  className="rounded-full p-3 text-gray-400 hover:bg-gray-800 hover:text-white"
                  onClick={rewind}
                  title="Rewind 5s (Left Arrow)"
                >
                  <SkipBack className="h-6 w-6" stroke="white" />
                </button>

                <button
                  className="rounded-full bg-primary p-4 text-black hover:bg-primary/80"
                  onClick={togglePlayPause}
                  title="Play/Pause (Space)"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" stroke="white" />
                  ) : (
                    <Play className="h-8 w-8" stroke="white" />
                  )}
                </button>

                <button
                  className="rounded-full p-3 text-gray-400 hover:bg-gray-800 hover:text-white"
                  onClick={forward}
                  title="Forward 5s (Right Arrow)"
                >
                  <SkipForward className="h-6 w-6" stroke="white" />
                </button>
              </div>

              {/* Additional controls */}
              <div className="flex items-center gap-8">
                <button
                  onClick={toggleLoop}
                  className={cn(
                    "rounded-full p-2 hover:bg-gray-800",
                    isLooping ? "text-orange-500" : "text-white-1 hover:text-white"
                  )}
                  title="Toggle Loop"
                >
                  <Repeat className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-primary transition-colors"
                    title="Toggle Mute (M)"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" stroke="white" />
                    ) : (
                      <Volume2 className="h-5 w-5" stroke="white" />
                    )}
                  </button>
                  <Slider
                    defaultValue={[1]}
                    max={1}
                    step={0.1}
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-white hover:text-primary transition-colors" title="Playback Speed">
                      <Gauge className="h-5 w-5" stroke="white" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <DropdownMenuItem
                        key={rate}
                        onClick={() => handlePlaybackRateChange(rate)}
                        className={cn(
                          "cursor-pointer text-gray-600 bg-black-3 hover:bg-black-2",
                          playbackRate === rate && "text-white-1"
                        )}
                      >
                        {rate}x
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullscreenPlayer;