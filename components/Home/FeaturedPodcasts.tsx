"use client";
import { useEffect, useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Headphones, Heart, Play, Star } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { PodcastProps } from '@/types';
import FeaturedSkeleton from './FeaturedSkeleton';
import CarouselDots from '../ui/CarouselDots';
import UserImage from '../ui/UserImage';

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
        return <div className="hidden md:block"><FeaturedSkeleton /></div>;
    }

    return (
        <section className="relative w-full h-[300px] hidden md:block">
            <div
                className="overflow-hidden rounded-xl"
                ref={emblaRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="flex">
                    {featuredPodcasts.map((podcast) => (
                        <div key={podcast._id} className="relative w-full flex-[0_0_100%]">
                            <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
                                <UserImage
                                    imageUrl={podcast.imageUrl!}
                                    title={podcast.podcastTitle}
                                    blurred={true}
                                    overlay={true}
                                />
                                {/* stronger gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

                                <div className="relative h-full flex items-end p-6">
                                    <div className="w-full space-y-3">
                                        {/* Author Info */}
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={podcast.authorImageUrl!}
                                                alt={podcast.author}
                                                width={28}
                                                height={28}
                                                className="rounded-full border border-green-1/60 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/profile/${podcast.authorId}`);
                                                }}
                                            />
                                            <span className="text-white-2 text-xs font-medium tracking-wide uppercase">{podcast.author}</span>
                                        </div>

                                        {/* Title */}
                                        <h1 className="text-2xl font-heading font-bold text-white-1 line-clamp-1 leading-tight">
                                            {podcast.podcastTitle}
                                        </h1>

                                        {/* Description */}
                                        <p className="text-white-3 text-xs line-clamp-1 max-w-2xl leading-relaxed">
                                            {podcast.podcastDescription}
                                        </p>

                                        {/* Actions and Stats */}
                                        <div className="flex items-center gap-4 pt-1">
                                            <button
                                                onClick={() => router.push(`/podcasts/${podcast._id}`)}
                                                className="bg-green-1 text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-green-2 transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
                                            >
                                                <Play size={14} className="fill-black" />
                                                Listen Now
                                            </button>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 text-white-3 text-xs">
                                                    <Headphones size={13} />
                                                    <span>{podcast.views}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-white-3 text-xs">
                                                    <Heart size={13} />
                                                    <span>{podcast.likeCount || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-white-3 text-xs">
                                                    <Star size={13} />
                                                    <span>{podcast?.averageRating ? Number(podcast.averageRating).toFixed(1) : "0.0"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-3">
                <CarouselDots
                    totalSlides={featuredPodcasts.length}
                    selectedIndex={selectedIndex}
                    onDotClick={(index) => emblaApi?.scrollTo(index)}
                />
            </div>
        </section>
    );
};

export default FeaturedPodcasts;