"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FeaturedPodcasts from "@/components/HomePage/FeaturedPodcasts";
import TrendingPodcasts from "@/components/HomePage/TrendingPodcasts";
import TopRatedPodcasts from "@/components/HomePage/TopRatedPodcasts";
import LatestPodcasts from "@/components/HomePage/LatestPodcasts";

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
      <TrendingPodcasts trendingPodcasts={trendingPodcasts} />

      {/* Top Rated */}
      <TopRatedPodcasts topRatedPodcasts={topRatedPodcasts} />

      {/* Latest */}
      <LatestPodcasts latestPodcasts={latestPodcasts} />
    </div>
  );
};

export default Home;
