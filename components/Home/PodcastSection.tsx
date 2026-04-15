import { PodcastProps } from "@/types";
import PodcastCard from "@/components/PodcastCard/GridPodcastCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PodcastCardSkeleton from "../PodcastCard/GridPodcastSkeleton";

interface PodcastSectionProps {
    title: string;
    icon: React.ReactNode;
    podcasts: PodcastProps[] | undefined;
    filterType: string;
}

const PodcastSection = ({ title, icon, podcasts, filterType }: PodcastSectionProps) => {
    // Split the title to separate "Podcasts" from the rest
    const titleParts = title.split(' Podcasts');
    
    return (
        <section className="flex flex-col gap-4 mt-10">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {icon}
                    <h1 className="text-xl font-bold text-white-1 tracking-tight">
                        {titleParts[0]}
                        <span className="hidden md:inline text-white-3 font-normal"> Podcasts</span>
                    </h1>
                </div>
                <Link
                    href={`/discover?filter=${filterType}`}
                    className="text-sm font-semibold text-green-1 hover:text-green-2 transition flex items-center gap-1 group"
                >
                    See all
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </header>
            <div className="podcast_grid">
                {podcasts ? (
                    podcasts.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                        <PodcastCard
                            key={_id}
                            imgUrl={imageUrl as string}
                            title={podcastTitle}
                            description={podcastDescription}
                            podcastId={_id}
                        />
                    ))
                ) : (
                    <>
                        {[...Array(3)].map((_, index) => (
                            <PodcastCardSkeleton key={index} />
                        ))}
                    </>
                )}
            </div>
        </section>
    );
};

export default PodcastSection;