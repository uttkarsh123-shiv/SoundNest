import { Star, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PodcastSection from "@/components/Profile/PodcastSection";
import EmptyState from "@/components/EmptyState";
import { useState, useEffect } from "react";
import { PodcastProps } from "@/types";
import ShowMoreLessButtons from "@/components/ShowMoreLessButtons";
import PodcastCountDisplay from "@/components/PodcastCountDisplay";

interface PodcastTabsProps {
    popularPodcasts: PodcastProps[];
    recentPodcasts: PodcastProps[];
    isOwnProfile: boolean;
    onTabChange?: (value: string) => void;
}

const PodcastTabs = ({
    popularPodcasts,
    recentPodcasts,
    isOwnProfile,
    onTabChange
}: PodcastTabsProps) => {
    const [activeTab, setActiveTab] = useState("popular");
    const [visiblePodcasts, setVisiblePodcasts] = useState(3); // Initially show 3 podcasts
    const initialPodcastCount = 3; // Define a constant for the initial count
    
    // Reset visible podcasts when tab changes - moved outside of conditional
    useEffect(() => {
        setVisiblePodcasts(initialPodcastCount);
    }, [activeTab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (onTabChange) onTabChange(value);
    };

    // Load more podcasts
    const loadMorePodcasts = () => {
        setVisiblePodcasts(prev => prev + 3);
    };

    // Show less podcasts
    const showLessPodcasts = () => {
        setVisiblePodcasts(initialPodcastCount);
    };

    // Determine which podcasts to display based on active tab
    const allPodcasts = activeTab === "popular" ? popularPodcasts : recentPodcasts;
    const currentPodcasts = allPodcasts.slice(0, visiblePodcasts);
    const title = activeTab === "popular" ? "Popular Podcasts" : "Recent Podcasts";
    const icon = activeTab === "popular" ? 
        <Star size={28} className="text-orange-1" /> : 
        <Clock size={28} className="text-orange-1" />;

    // Determine if we can show more or less
    const hasMorePodcasts = allPodcasts.length > visiblePodcasts;
    const canShowLess = visiblePodcasts > initialPodcastCount;

    // If both arrays are empty, show a single empty state
    if (popularPodcasts.length === 0 && recentPodcasts.length === 0) {
        return (
            <section className="my-8">
                <EmptyState
                    title={"No Podcasts created yet"}
                    buttonLink={isOwnProfile ? "/create-podcast" : undefined}
                    buttonText="Create Podcast"
                />
            </section>
        );
    }

    return (
        <div className="mb-10">
            <Tabs defaultValue="popular" onValueChange={handleTabChange}>
                <div className="bg-black/20 p-1.5 rounded-lg shadow-inner backdrop-blur-sm inline-flex mb-6">
                    <TabsList className="bg-transparent border-0 p-0">
                        <TabsTrigger
                            value="popular"
                            className="px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all duration-200 data-[state=active]:bg-orange-1 data-[state=active]:text-black data-[state=active]:shadow-md data-[state=inactive]:text-white-2 data-[state=inactive]:hover:bg-white-1/10"
                        >
                            <Star size={15} />
                            Popular
                        </TabsTrigger>
                        <TabsTrigger
                            value="recent"
                            className="px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all duration-200 data-[state=active]:bg-orange-1 data-[state=active]:text-black data-[state=active]:shadow-md data-[state=inactive]:text-white-2 data-[state=inactive]:hover:bg-white-1/10"
                        >
                            <Clock size={15} />
                            Recent
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Single PodcastSection that changes based on active tab */}
                <PodcastSection
                    title={title}
                    icon={icon}
                    podcasts={currentPodcasts}
                />

                {/* Show More/Less buttons */}
                {allPodcasts.length > initialPodcastCount && (
                    <ShowMoreLessButtons
                        loadMoreHandler={loadMorePodcasts}
                        showLessHandler={showLessPodcasts}
                        hasMore={hasMorePodcasts}
                        canShowLess={canShowLess}
                    />
                )}

                {/* Podcast count display */}
                {allPodcasts.length > 0 && (
                    <div className="flex justify-center mt-4">
                        <PodcastCountDisplay
                            visibleCount={Math.min(visiblePodcasts, allPodcasts.length)}
                            totalCount={allPodcasts.length}
                        />
                    </div>
                )}
            </Tabs>
        </div>
    );
};

export default PodcastTabs;