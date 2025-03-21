import { PodcastProps } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Headphones, Heart, ArrowRight, Play } from "lucide-react";
import LatestPodcastSkeleton from "./Skeleton/LatestPodcastSkeleton";

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
                            className="flex cursor-pointer items-center hover:bg-white-1/5 rounded-lg p-3 transition-all duration-300 group hover:shadow-md hover:shadow-black/20"
                        >
                            <span className="inline-block text-center w-8 text-sm font-medium text-orange-1 group-hover:scale-110 transition-transform">
                                {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <div className="flex flex-col size-full gap-3">
                                <div className="flex justify-between items-center">
                                    <figure className="flex items-center gap-3">
                                        <div className="relative overflow-hidden rounded-lg">
                                            <Image
                                                src={imageUrl!}
                                                alt={podcastTitle}
                                                width={64}
                                                height={64}
                                                className="aspect-square rounded-lg group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <div className="bg-orange-1/80 rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                                    <Play size={16} className="fill-black text-black" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-16 font-semibold text-white-1 text-wrap w-[200px] max-sm:w-[100px] max-sm:truncate group-hover:text-orange-1 transition-colors">
                                                {podcastTitle}
                                            </h2>
                                            <p className="text-14 text-white-2 group-hover:text-white-1 transition-colors">{author}</p>
                                        </div>
                                    </figure>
                                    <div className="flex items-center gap-6">
                                        <figure className="flex gap-2 items-center group-hover:scale-105 transition-transform">
                                            <Headphones size={20} className="text-white-2 group-hover:text-orange-1 transition-colors" />
                                            <span className="text-14 font-medium text-white-1">{views}</span>
                                        </figure>
                                        <figure className="flex gap-2 items-center group-hover:scale-105 transition-transform">
                                            <Heart size={20} className="text-white-2 group-hover:text-orange-1 transition-colors" />
                                            <span className="text-14 font-medium text-white-1">{likeCount || 0}</span>
                                        </figure>
                                        <figure className="flex gap-2 items-center max-sm:hidden group-hover:scale-105 transition-transform">
                                            <Clock size={20} className="text-white-2 group-hover:text-orange-1 transition-colors" />
                                            <span className="text-14 font-medium text-white-1">{formatAudioDuration(audioDuration)}</span>
                                        </figure>
                                    </div>
                                </div>
                                <hr className="border-gray-800 group-hover:border-gray-700 transition-colors" />
                            </div>
                        </div>
                    ))
                ) : (
                    <LatestPodcastSkeleton />
                )}
            </div>
        </section>
    );
};

export default LatestPodcasts;