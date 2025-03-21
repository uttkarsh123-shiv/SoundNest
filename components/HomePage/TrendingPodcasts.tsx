import { PodcastProps } from "@/types";
import PodcastCard from "@/components/PodcastCard";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import PodcastCardSkeleton from "../PodcastCardSkeleton";

interface TrendingPodcastsProps {
    trendingPodcasts: PodcastProps[] | undefined;
}

const TrendingPodcasts = ({ trendingPodcasts }: TrendingPodcastsProps) => {
    return (
        <section className="flex flex-col gap-5 mt-12">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-1/10 p-3 rounded-xl">
                        <TrendingUp size={28} className="text-orange-1" />
                    </div>
                    <h1 className="text-2xl font-bold text-white-1">Trending Podcasts</h1>
                </div>
                <Link
                    href="/discover?filter=trending"
                    className="flex items-center gap-2 text-16 font-semibold text-orange-1 hover:text-orange-2 transition group"
                >
                    See all
                    <ArrowRight size={20} className="text-orange-1 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </header>
            <div className="podcast_grid">
                {trendingPodcasts ? (
                    trendingPodcasts.map(({ _id, podcastTitle, podcastDescription, imageUrl, views, likeCount, averageRating }) => (
                        <PodcastCard
                            key={_id}
                            imgUrl={imageUrl as string}
                            title={podcastTitle}
                            description={podcastDescription}
                            podcastId={_id}
                            views={views}
                            likes={likeCount || 0}
                            rating={averageRating}
                        />
                    ))
                ) : (
                    <>
                        {[...Array(3)].map(() => (
                            <PodcastCardSkeleton/>
                        ))}
                    </>
                )}
            </div>
        </section>
    );
};

export default TrendingPodcasts;