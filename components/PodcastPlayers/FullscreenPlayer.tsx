"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Slider } from "../ui/slider";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Gauge,
    Repeat,
    SkipBack,
    SkipForward,
    Heart,
    Share2,
    X
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/formatTime";
import { Dialog, DialogContent } from "../ui/dialog";
import PodcastInfo from "./PodcastInfo";

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
        podcastId?: string;
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
    const playerRef = useRef<HTMLDivElement>(null);
    const [isRealFullscreen, setIsRealFullscreen] = useState(false);

    useEffect(() => {
        setSeekValue((currentTime / duration) * 100 || 0);
    }, [currentTime, duration]);

    const handleSeek = (value: number[]) => {
        const newTime = (value[0] / 100) * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const enterFullscreen = () => {
        if (playerRef.current && !document.fullscreenElement) {
            playerRef.current.requestFullscreen().then(() => {
                setIsRealFullscreen(true);
            }).catch(err => {
                console.error("Couldn't enter fullscreen mode:", err);
            });
        }
    };

    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().then(() => {
                setIsRealFullscreen(false);
            }).catch(err => {
                console.error("Couldn't exit fullscreen mode:", err);
            });
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsRealFullscreen(!!document.fullscreenElement);
            if (!document.fullscreenElement && isRealFullscreen) {
                // User exited fullscreen using browser controls
                onClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.code === "Escape") {
                exitFullscreen();
                onClose();
            } else if (e.code === "Space") {
                e.preventDefault();
                togglePlayPause();
            } else if (e.code === "ArrowLeft") {
                rewind();
            } else if (e.code === "ArrowRight") {
                forward();
            } else if (e.code === "KeyM") {
                toggleMute();
            } else if (e.code === "KeyL") {
                toggleLoop();
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, isRealFullscreen, onClose, togglePlayPause, rewind, forward, toggleMute, toggleLoop]);

    // Enter fullscreen when the component is opened
    useEffect(() => {
        if (isOpen && !isRealFullscreen) {
            // Small delay to ensure the dialog is rendered
            const timer = setTimeout(() => {
                enterFullscreen();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isRealFullscreen]);

    // Handle closing
    const handleClose = () => {
        exitFullscreen();
        onClose();
    };

    if (!isOpen || !audioDetails) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-full w-full h-full p-0 border-0 bg-transparent" ref={playerRef}>
                <div className="flex flex-col h-screen w-screen">
                    {/* Background with blur and gradient */}
                    <div className="absolute inset-0 z-0">
                        <div className="relative w-full h-full">
                            <Image
                                src={audioDetails.imageUrl || "/icons/logo.png"}
                                alt="background"
                                fill
                                className="object-cover opacity-30"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90 backdrop-blur-2xl" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full p-4 md:p-8 lg:p-12">
                        {/* Header with close button */}
                        <div className="flex justify-between items-center mb-4 md:mb-8">
                            <div className="flex items-center gap-2">
                                <div className="bg-orange-1/20 p-2 rounded-full">
                                    <Gauge className="h-5 w-5 text-orange-1" />
                                </div>
                                <h2 className="text-xl font-bold text-white-1">Now Playing</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="rounded-full p-2 text-white-1 hover:bg-gray-800/50 transition-colors"
                                title="Exit Fullscreen (Esc)"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Main content */}
                        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 py-4">
                            {/* Left side - Album art and info for mobile */}
                            <div className="md:hidden w-full flex flex-col items-center gap-6">
                                <PodcastInfo
                                    title={audioDetails.title}
                                    author={audioDetails.author}
                                    imageUrl={audioDetails.imageUrl}
                                    podcastId={audioDetails.podcastId}
                                    variant="fullscreen"
                                    showLink={false}
                                    className="flex flex-col items-center"
                                />
                            </div>
                            
                            {/* Left side - Album art for desktop */}
                            <div className="hidden md:block">
                                <PodcastInfo
                                    title={audioDetails.title}
                                    author={audioDetails.author}
                                    imageUrl={audioDetails.imageUrl}
                                    podcastId={audioDetails.podcastId}
                                    variant="fullscreen"
                                    showLink={false}
                                    className="flex-col items-center"
                                    titleClassName="hidden"
                                    authorClassName="hidden"
                                />
                            </div>
                        
                            {/* Right side - Controls and info */}
                            <div className="flex flex-col items-center md:items-start max-w-xl w-full gap-8">
                                {/* Podcast info - only visible on desktop */}
                                <div className="hidden md:block text-left w-full">
                                    <h1 className="text-3xl font-bold text-white-1 mb-2 line-clamp-2">{audioDetails.title}</h1>
                                    <p className="text-xl text-gray-400">{audioDetails.author}</p>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full">
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

                                {/* Main Controls */}
                                <div className="flex items-center justify-center gap-8 w-full">
                                    <button
                                        className="rounded-full p-3 text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors"
                                        onClick={rewind}
                                        title="Rewind 5s (Left Arrow)"
                                    >
                                        <SkipBack className="h-8 w-8" stroke="white" />
                                    </button>

                                    <button
                                        className="rounded-full bg-orange-1 p-5 text-white hover:bg-orange-1/90 transition-colors"
                                        onClick={togglePlayPause}
                                        title="Play/Pause (Space)"
                                    >
                                        {isPlaying ? (
                                            <Pause className="h-10 w-10" stroke="white" />
                                        ) : (
                                            <Play className="h-10 w-10 ml-1" stroke="white" />
                                        )}
                                    </button>

                                    <button
                                        className="rounded-full p-3 text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors"
                                        onClick={forward}
                                        title="Forward 5s (Right Arrow)"
                                    >
                                        <SkipForward className="h-8 w-8" stroke="white" />
                                    </button>
                                </div>

                                {/* Additional controls */}
                                <div className="flex items-center justify-between w-full mt-4">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={toggleLoop}
                                            className={cn(
                                                "rounded-full p-2 hover:bg-gray-800/50 transition-colors",
                                                isLooping ? "text-orange-1" : "text-white-1 hover:text-white"
                                            )}
                                            title="Toggle Loop (L)"
                                        >
                                            <Repeat className="h-6 w-6" />
                                        </button>

                                        <button
                                            className="rounded-full p-2 text-white-1 hover:bg-gray-800/50 hover:text-orange-1 transition-colors"
                                            title="Like Podcast"
                                        >
                                            <Heart className="h-6 w-6" />
                                        </button>

                                        <button
                                            className="rounded-full p-2 text-white-1 hover:bg-gray-800/50 hover:text-orange-1 transition-colors"
                                            title="Share Podcast"
                                        >
                                            <Share2 className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={toggleMute}
                                                className="text-white hover:text-orange-1 transition-colors"
                                                title="Toggle Mute (M)"
                                            >
                                                {isMuted ? (
                                                    <VolumeX className="h-6 w-6" stroke="white" />
                                                ) : (
                                                    <Volume2 className="h-6 w-6" stroke="white" />
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
                                                <button className="text-white hover:text-orange-1 transition-colors" title="Playback Speed">
                                                    <Gauge className="h-6 w-6" stroke="white" />
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

                        {/* Footer with keyboard shortcuts */}
                        <div className="mt-auto pt-4 text-center text-gray-500 text-xs">
                            <p>Keyboard shortcuts: Space (Play/Pause), ← (Rewind), → (Forward), M (Mute), L (Loop), Esc (Exit)</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FullscreenPlayer;