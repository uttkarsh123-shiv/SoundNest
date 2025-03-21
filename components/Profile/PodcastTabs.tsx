import { Star, Clock } from "lucide-react";
import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs";
import PodcastSection from "@/components/Profile/PodcastSection";
import EmptyState from "@/components/EmptyState";
import { useState } from "react";

interface PodcastTabsProps {
    popularPodcasts: any[];
    recentPodcasts: any[];
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

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (onTabChange) onTabChange(value);
    };

    // Determine which podcasts to display based on active tab
    const currentPodcasts = activeTab === "popular" ? popularPodcasts : recentPodcasts;
    const title = activeTab === "popular" ? "Popular Podcasts" : "Recent Podcasts";
    const icon = activeTab === "popular" ? 
        <Star size={28} className="text-orange-1" /> : 
        <Clock size={28} className="text-orange-1" />;

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
            </Tabs>
        </div>
    );
};

export default PodcastTabs;