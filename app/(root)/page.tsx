"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FeaturedPodcasts from "@/components/Home/FeaturedPodcasts";
import PodcastSection from "@/components/Home/PodcastSection";
import LatestPodcasts from "@/components/Home/LatestPodcasts";
import { TrendingUp, Star } from "lucide-react";

const Home = () => {
  const latestPodcasts = useQuery(api.podcasts.getFilteredPodcasts, { type: 'latest' })?.slice(0, 3);
  const featuredPodcasts = useQuery(api.podcasts.getFilteredPodcasts, { type: 'popular' })?.slice(0, 2);
  const trendingPodcasts = useQuery(api.podcasts.getFilteredPodcasts, { type: 'trending' })?.slice(0, 3);
  const topRatedPodcasts = useQuery(api.podcasts.getFilteredPodcasts, { type: 'topRated' })?.slice(0, 3);

  return (
    <div className="mt-5 flex flex-col md:overflow-hidden">
      {/* Featured Podcasts */}
      <FeaturedPodcasts featuredPodcasts={featuredPodcasts} />

      {/* Trending */}
      <PodcastSection
        title="Trending Podcasts"
        icon={<TrendingUp size={28} className="text-orange-1" />}
        podcasts={trendingPodcasts}
        filterType="trending"
      />

      {/* Top Rated */}
      <PodcastSection
        title="Top Rated Podcasts"
        icon={<Star size={28} className="text-orange-1" />}
        podcasts={topRatedPodcasts}
        filterType="topRated"
      />

      {/* Latest */}
      <LatestPodcasts latestPodcasts={latestPodcasts} />
    </div>
  );
};

export default Home;
