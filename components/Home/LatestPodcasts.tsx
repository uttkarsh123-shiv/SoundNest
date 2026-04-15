import { PodcastProps } from "@/types";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import ListPodcastCard from "@/components/PodcastCard/ListPodcastCard";
import ListPodcastSkeleton from "@/components/PodcastCard/ListPodcastSkeleton";

interface LatestPodcastsProps {
    latestPodcasts: PodcastProps[] | undefined;
}

const LatestPodcasts = ({ latestPodcasts }: LatestPodcastsProps) => {
    return (
        <section className="flex flex-col gap-4 mt-10">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Clock size={22} className="text-green-1" />
                    <h1 className="text-xl font-bold text-white-1 tracking-tight">
                        Latest<span className="hidden md:inline text-white-3 font-normal"> Podcasts</span>
                    </h1>
                </div>
                <Link
                    href="/discover?filter=latest"
                    className="text-sm font-semibold text-green-1 hover:text-green-2 transition flex items-center gap-1 group"
                >
                    See all
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </header>
            <div className="flex flex-col gap-6">
                {latestPodcasts ? (
                    latestPodcasts.map((podcast, index) => (
                        <ListPodcastCard
                            key={podcast._id}
                            _id={podcast._id}
                            podcastTitle={podcast.podcastTitle}
                            imageUrl={podcast.imageUrl!}
                            views={podcast.views}
                            audioDuration={podcast.audioDuration}
                            author={podcast.author}
                            likeCount={podcast.likeCount}
                            index={index}
                        />
                    ))
                ) : (
                    <div className="flex flex-col gap-6">
                            {[...Array(3)].map((_, index) => (
                                <ListPodcastSkeleton key={index} />
                            ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LatestPodcasts;