'use client';

import UserAvatar from '@/components/ui/UserAvatar';
import React from 'react'
import Header from '@/components/Sidebars/RightSidebar/Header';
import Carousel from '@/components/Sidebars/RightSidebar/Carousel';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/providers/AudioProvider';
import { cn } from '@/lib/utils';
import { TopPodcastersProps } from '@/types';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useAuthModal } from '@/providers/AuthProvider';
import Link from 'next/link';

const RightSidebar = () => {
    const { user, isSignedIn } = useAuth();
    const { openModal } = useAuthModal();
    const topPodcasters = useQuery(api.users.getTopUsers);
    const isLoading = topPodcasters === undefined;
    const slides = (topPodcasters as TopPodcastersProps[] | undefined)?.filter(item => item.totalPodcasts > 0);
    const router = useRouter();
    const { audio } = useAudio();

    return (
        <section className={cn('right_sidebar h-[calc(100vh-1px)]', {
            'h-[calc(100vh-80px)]': audio?.audioUrl
        })}>

            {/* Profile / Sign In */}
            {isSignedIn ? (
                <Link href={`/profile/${user?.id}`} className="flex items-center justify-between group hover:bg-white-1/5 rounded-lg px-2 py-2 transition-all duration-150">
                    <div className="flex items-center gap-3">
                        <UserAvatar name={user?.name || ''} imageUrl={user?.imageUrl} size={32} />
                        <div className="flex flex-col">
                            <span className="text-[13px] font-semibold text-white-1 truncate max-w-[130px]">{user?.name}</span>
                            <span className="text-[11px] text-white-3">View profile</span>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-white-3 group-hover:text-white-1 transition-colors" />
                </Link>
            ) : (
                <div className="rounded-lg bg-black-5 p-4 flex flex-col gap-3 border border-white-1/5">
                    <p className="text-[12px] font-bold text-white-1 uppercase tracking-widest">Preview SoundNest</p>
                    <p className="text-[11px] text-white-3 leading-relaxed">Sign up to get unlimited podcasts and more.</p>
                    <div className="flex flex-col gap-2 mt-1">
                        <button onClick={() => openModal('signup')} className="w-full text-center text-[12px] font-bold bg-green-1 text-black rounded-full py-2 hover:bg-green-2 transition-all">
                            Sign up free
                        </button>
                        <button onClick={() => openModal('login')} className="w-full text-center text-[12px] font-semibold text-white-2 border border-white-1/20 rounded-full py-2 hover:border-white-1/40 hover:text-white-1 transition-all">
                            Log in
                        </button>
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="border-t border-white-1/5 my-1" />

            {/* Fans Like You */}
            <section className="flex flex-col gap-3">
                <Header headerTitle="Fans Like You" />
                {isLoading ? (
                    <div className="h-32 rounded-lg bg-white-1/5 animate-pulse" />
                ) : !slides || slides.length === 0 ? (
                    <p className="text-[12px] text-white-3 italic">No fans data yet</p>
                ) : (
                    <Carousel fansLikeDetail={slides} />
                )}
            </section>

            {/* Divider */}
            <div className="border-t border-white-1/5 my-1" />

            {/* Top Podcasters */}
            <section className="flex flex-col gap-3">
                <Header headerTitle="Top Podcasters" />
                {isLoading ? (
                    <div className="flex flex-col gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3 px-2 py-2">
                                <div className="w-9 h-9 rounded-full bg-white-1/5 animate-pulse flex-shrink-0" />
                                <div className="flex-1 h-4 bg-white-1/5 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : !slides || slides.length === 0 ? (
                    <p className="text-[12px] text-white-3 italic">No podcasters yet</p>
                ) : (
                    <div className="flex flex-col">
                        {slides.slice(0, 4).map((podcaster: TopPodcastersProps) => (
                            <div
                                key={podcaster._id}
                                className="flex cursor-pointer justify-between items-center hover:bg-white-1/5 px-2 py-2 rounded-md transition-all duration-150 group"
                                onClick={() => router.push(`/profile/${podcaster._id}`)}
                            >
                                <div className="flex items-center gap-3">
                                    <UserAvatar name={podcaster.name} imageUrl={podcaster.imageUrl} size={36} />
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-semibold text-white-1 truncate max-w-[110px] group-hover:text-green-1 transition-colors">{podcaster.name}</span>
                                        <span className="text-[11px] text-white-3">{podcaster.totalPodcasts} {podcaster.totalPodcasts > 1 ? "podcasts" : "podcast"}</span>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-white-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </section>
    )
}

export default RightSidebar
