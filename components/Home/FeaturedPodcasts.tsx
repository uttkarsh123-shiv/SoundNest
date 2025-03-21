"use client";
import { useEffect, useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Headphones, Heart, Play, Star } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { PodcastProps } from '@/types';
import FeaturedSkeleton from './Skeleton/FeaturedSkeleton';

interface FeaturedPodcastsProps {
    featuredPodcasts: PodcastProps[] | undefined;
}

const FeaturedPodcasts = ({ featuredPodcasts }: FeaturedPodcastsProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const router = useRouter();

    // Add auto-scroll functionality
    useEffect(() => {
        if (!emblaApi) return;

        let autoplay: NodeJS.Timeout | null = null;
        
        const startAutoplay = () => {
            autoplay = setInterval(() => {
                emblaApi.scrollNext();
            }, 4000);
        };
        
        const stopAutoplay = () => {
            if (autoplay) {
                clearInterval(autoplay);
                autoplay = null;
            }
        };
        
        if (!isPaused) {
            startAutoplay();
        }

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        emblaApi.on('select', onSelect);

        // Cleanup interval and event listener on unmount
        return () => {
            stopAutoplay();
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, isPaused]);

    if (!featuredPodcasts || featuredPodcasts.length === 0) {
        return <FeaturedSkeleton />;
    }

    return (
        <section className="relative w-full h-[300px]">
            <div 
                className="overflow-hidden rounded-2xl" 
                ref={emblaRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="flex">
                    {featuredPodcasts.map((podcast) => (
                        <div key={podcast._id} className="relative w-full flex-[0_0_100%]">
                            <div className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-lg">
                                <div className="absolute inset-0">
                                    <Image
                                        src={podcast.imageUrl!}
                                        alt={podcast.podcastTitle}
                                        fill
                                        className="object-cover opacity-60 blur-[1px]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50" />
                                </div>
                                <div className="relative h-full flex flex-col justify-end p-6 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={podcast.authorImageUrl!}
                                            alt={podcast.author}
                                            width={40}
                                            height={40}
                                            className="rounded-full border-2 border-orange-1/50 cursor-pointer hover:border-white-1 hover:scale-105 transition-all duration-200"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/profile/${podcast.authorId}`);
                                            }}
                                        />
                                        <span className="text-white-1 font-medium">{podcast.author}</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-white-1 drop-shadow-md">{podcast.podcastTitle}</h1>
                                    <p className="text-white-2 line-clamp-2 backdrop-blur-sm bg-black/20 p-1.5 rounded-md">{podcast.podcastDescription}</p>
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => router.push(`/podcasts/${podcast._id}`)}
                                            className="bg-orange-1 text-black px-6 py-2 rounded-full font-semibold hover:bg-orange-2 transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-orange-1/20 hover:scale-105 active:scale-95"
                                        >
                                            <Play size={18} className="fill-black" />
                                            Listen Now
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <Headphones size={20} className="text-white-1" />
                                            <span className="text-white-1">{podcast.views}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Heart size={20} className="text-white-1" />
                                            <span className="text-white-1">{podcast.likeCount || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Star size={20} className="text-white-1" />
                                            <span className="text-white-1">{podcast?.averageRating || "0.0"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between mt-4">
                {/* Carousel Controls - Only dots for navigation */}
                <div className="flex justify-center w-full mt-4">
                    {featuredPodcasts.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => emblaApi?.scrollTo(index)}
                            className={`w-3 h-3 rounded-full transition-all mx-1 ${index === selectedIndex
                                    ? 'bg-orange-1 scale-125'
                                    : 'bg-[white] hover:bg-white/50'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedPodcasts;