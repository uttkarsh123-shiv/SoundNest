import { PodcastProps } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Headphones, Heart, ArrowRight, Play } from "lucide-react";

interface LatestPodcastsProps {
    latestPodcasts: PodcastProps[] | undefined;
}

const LatestPodcasts = ({ latestPodcasts }: LatestPodcastsProps) => {
    const router = useRouter();

    function formatAudioDuration(duration: number): string {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);

        const formattedHours = hours < 10 ? `0${hours}:` : `${hours}:`;
        const formattedMinutes = minutes < 10 ? `0${minutes}:` : `${minutes}:`;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

        return formattedHours + formattedMinutes + formattedSeconds;
    }

    return (
        <section className="flex flex-col gap-5 mt-12">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-1/10 p-3 rounded-xl">
                        <Clock size={28} className="text-orange-1" />
                    </div>
                    <h1 className="text-2xl font-bold text-white-1">Latest Podcasts</h1>
                </div>
                <Link
                    href="/discover?filter=latest"
                    className="flex items-center gap-2 text-16 font-semibold text-orange-1 hover:text-orange-2 transition group"
                >
                    See all
                    <ArrowRight size={20} className="text-orange-1 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </header>
            <div className="flex flex-col gap-6">
                {latestPodcasts ? (
                    latestPodcasts.map(({ _id, podcastTitle, imageUrl, views, audioDuration, author, likeCount }, index) => (
                        <div
                            key={_id}
                            onClick={() => router.push(`/podcasts/${_id}`)}
                            className="flex cursor-pointer items-center hover:bg-white-1/5 rounded-lg p-3 transition group"
                        >
                            <span className="inline-block text-center w-8 text-sm font-medium text-orange-1">
                                {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <div className="flex flex-col size-full gap-3">
                                <div className="flex justify-between items-center">
                                    <figure className="flex items-center gap-3">
                                        <div className="relative">
                                            <Image
                                                src={imageUrl!}
                                                alt={podcastTitle}
                                                width={64}
                                                height={64}
                                                className="aspect-square rounded-lg"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-orange-1/80 rounded-full p-2">
                                                    <Play size={16} className="fill-black text-black" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-16 font-semibold text-white-1 text-wrap w-[200px] max-sm:w-[100px] max-sm:truncate group-hover:text-orange-1 transition-colors">
                                                {podcastTitle}
                                            </h2>
                                            <p className="text-14 text-white-2">{author}</p>
                                        </div>
                                    </figure>
                                    <div className="flex items-center gap-6">
                                        <figure className="flex gap-2 items-center">
                                            <Headphones size={20} className="text-white-2 group-hover:text-orange-1 transition-colors" />
                                            <span className="text-14 font-medium text-white-1">{views}</span>
                                        </figure>
                                        <figure className="flex gap-2 items-center">
                                            <Heart size={20} className="text-white-2 group-hover:text-orange-1 transition-colors" />
                                            <span className="text-14 font-medium text-white-1">{likeCount || 0}</span>
                                        </figure>
                                        <figure className="flex gap-2 items-center max-sm:hidden">
                                            <Clock size={20} className="text-white-2 group-hover:text-orange-1 transition-colors" />
                                            <span className="text-14 font-medium text-white-1">{formatAudioDuration(audioDuration)}</span>
                                        </figure>
                                    </div>
                                </div>
                                <hr className="border-gray-800" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col gap-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="flex items-center p-3 bg-white-1/5 rounded-lg">
                                <div className="w-8 text-center">
                                    <div className="h-5 w-5 bg-orange-1/20 rounded animate-pulse mx-auto" />
                                </div>
                                <div className="flex-1 ml-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-white-1/10 rounded-lg animate-pulse" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-5 bg-white-1/10 rounded animate-pulse w-3/4" />
                                            <div className="h-4 bg-white-1/10 rounded animate-pulse w-1/2" />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="h-4 w-16 bg-white-1/10 rounded animate-pulse" />
                                            <div className="h-4 w-16 bg-white-1/10 rounded animate-pulse" />
                                            <div className="h-4 w-24 bg-white-1/10 rounded animate-pulse max-sm:hidden" />
                                        </div>
                                    </div>
                                    <div className="mt-3 h-px bg-gray-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LatestPodcasts;