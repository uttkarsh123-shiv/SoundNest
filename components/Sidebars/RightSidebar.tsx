'use client';

import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Header from '@/components/Header';
import Carousel from '@/components/Carousel';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/providers/AudioProvider';
import { cn } from '@/lib/utils';
import { TopPodcastersProps } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const RightSidebar = () => {
    const { user } = useUser();
    // Fix: The useQuery hook doesn't return an object with data, isLoading, error properties
    // Instead it directly returns the data, and we can check for undefined
    const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);
    const isLoading = topPodcasters === undefined;
    const slides = topPodcasters?.filter((item: TopPodcastersProps) => item.totalPodcasts > 0);
    const router = useRouter();
    const { audio } = useAudio();

    return (
        <section className={cn('right_sidebar h-[calc(100vh-5px)]', {
            'h-[calc(100vh-80px)]': audio?.audioUrl
        })}>
            <SignedIn>
                <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-7">
                    <UserButton />
                    <div className="flex w-full items-center justify-between">
                        <h1 className="text-16 truncate font-semibold text-white-1">{user?.firstName} {user?.lastName}</h1>
                        <Image
                            src="/icons/right-arrow.svg"
                            alt="arrow"
                            width={24}
                            height={24}
                            className="transition-transform duration-300 hover:translate-x-1 group-hover:translate-x-1"
                        />
                    </div>
                </Link>
            </SignedIn>
            
            {/* Fans Like You Section */}
            <section className="w-full">
                <Header headerTitle="Fans Like You" />
                {isLoading ? (
                    <div className="flex gap-4 py-2 w-full">
                        <Skeleton className="h-16 w-20 rounded-lg" />
                        <Skeleton className="h-16 w-20 rounded-lg" />
                        <Skeleton className="h-16 w-20 rounded-lg" />
                    </div>
                ) : !slides || slides.length === 0 ? (
                    <p className="text-sm text-white-3 italic py-2">No fans data available</p>
                ) : (
                    <div className="w-full">
                        <Carousel fansLikeDetail={slides} />
                    </div>
                )}
            </section>
            
            {/* Top Podcasters Section */}
            <section className="flex flex-col gap-2 pt-7">
                <Header headerTitle="Top Podcasters" />
                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Skeleton className="h-11 w-11 rounded-lg" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        ))}
                    </div>
                ) : !slides || slides.length === 0 ? (
                    <p className="text-sm text-white-3 italic py-2">No top podcasters available</p>
                ) : (
                    <div className="flex flex-col gap-1">
                        {slides.slice(0, 3).map((podcaster: TopPodcastersProps) => (
                            <div 
                                key={podcaster._id} 
                                className="flex cursor-pointer justify-between hover:bg-black-2/50 p-2 rounded-lg transition-colors" 
                                onClick={() => router.push(`/profile/${podcaster.clerkId}`)}
                            >
                                <figure className="flex items-center gap-2">
                                    <Image
                                        src={podcaster.imageUrl}
                                        alt={podcaster.name}
                                        width={44}
                                        height={44}
                                        className="aspect-square rounded-lg object-cover"
                                    />
                                    <h2 className="text-14 font-semibold text-white-1">{podcaster.name}</h2>
                                </figure>
                                <div className="flex items-center">
                                    <p className="text-12 font-normal text-white-1">{podcaster.totalPodcasts}&nbsp;&nbsp;{podcaster.totalPodcasts > 1 ? "podcasts" : "podcast"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </section>
    )
}

export default RightSidebar