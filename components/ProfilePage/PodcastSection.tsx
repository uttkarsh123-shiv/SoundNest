import PodcastCard from "@/components/PodcastCard";

interface PodcastSectionProps {
    title: string;
    icon: React.ReactNode;
    podcasts: any[];
    emptyStateMessage: string;
    useAnimation?: boolean;
}

const PodcastSection = ({
    title,
    icon,
    podcasts,
    useAnimation = false,
}: PodcastSectionProps) => {
    return (
        <section className="flex flex-col gap-5">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-1/10 p-3 rounded-xl">
                    {icon}
                </div>
                <h1 className="text-2xl font-bold text-white-1">{title}</h1>
            </div>

            <div className="podcast_grid gap-6">
                {podcasts.length > 0 && (
                    podcasts.map((podcast, index) => (
                        <div
                            key={podcast._id}
                            className="group transition-all duration-300 hover:scale-[1.02]"
                            style={
                                useAnimation
                                    ? {
                                        animationDelay: `${index * 0.1}s`,
                                        animation: 'fadeIn 0.5s ease-in-out forwards',
                                        opacity: 0
                                    }
                                    : undefined
                            }
                        >
                            <PodcastCard
                                imgUrl={podcast.imageUrl!}
                                title={podcast.podcastTitle!}
                                description={podcast.podcastDescription}
                                podcastId={podcast._id}
                                views={podcast.views}
                                likes={podcast.likeCount || 0}
                                rating={podcast.averageRating}
                            />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default PodcastSection;