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
        <section className="relative w-full h-[340px] hidden md:block">
            <div
                className="overflow-hidden rounded-lg"
                ref={emblaRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="flex">
                    {featuredPodcasts.map((podcast) => (
                        <div key={podcast._id} className="relative w-full flex-[0_0_100%]">
                            <div className="relative w-full h-[340px] rounded-lg overflow-hidden border border-white-1/10 bg-black-2">
                                <UserImage
                                    imageUrl={podcast.imageUrl!}
                                    title={podcast.podcastTitle}
                                    blurred={true}
                                    overlay={true}
                                />
                                <div className="relative h-full flex items-end p-8">
                                    <div className="w-full space-y-4">
                                        {/* Author Info */}
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={podcast.authorImageUrl!}
                                                alt={podcast.author}
                                                width={36}
                                                height={36}
                                                className="rounded-full border-2 border-blue-1/40 cursor-pointer hover:border-blue-1 transition-all duration-200"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/profile/${podcast.authorId}`);
                                                }}
                                            />
                                            <span className="text-white-1 font-medium text-sm">{podcast.author}</span>
                                        </div>

                                        {/* Title */}
                                        <h1 className="text-3xl font-heading font-bold text-white-1 drop-shadow-lg line-clamp-2 leading-tight">
                                            {podcast.podcastTitle}
                                        </h1>

                                        {/* Description */}
                                        <p className="text-white-2 text-sm line-clamp-2 max-w-3xl leading-relaxed">
                                            {podcast.podcastDescription}
                                        </p>

                                        {/* Actions and Stats */}
                                        <div className="flex items-center justify-between pt-2">
                                            <button
                                                onClick={() => router.push(`/podcasts/${podcast._id}`)}
                                                className="bg-blue-1 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-2 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-blue-1/30 active:scale-[0.98]"
                                            >
                                                <Play size={16} className="fill-white" />
                                                Listen Now
                                            </button>

                                            <div className="flex items-center gap-5">
                                                <div className="flex items-center gap-1.5 bg-black-1/40 backdrop-blur-sm px-3 py-1.5 rounded-md border border-white-1/10">
                                                    <Headphones size={16} className="text-white-2" />
                                                    <span className="text-white-1 text-sm font-medium">{podcast.views}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-black-1/40 backdrop-blur-sm px-3 py-1.5 rounded-md border border-white-1/10">
                                                    <Heart size={16} className="text-white-2" />
                                                    <span className="text-white-1 text-sm font-medium">{podcast.likeCount || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-black-1/40 backdrop-blur-sm px-3 py-1.5 rounded-md border border-white-1/10">
                                                    <Star size={16} className="text-white-2" />
                                                    <span className="text-white-1 text-sm font-medium">
                                                        {podcast?.averageRating ? Number(podcast.averageRating).toFixed(1) : "0.0"}
                                                    </span>
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

            <div className="flex justify-center mt-4">
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