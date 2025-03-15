"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import { Headphones, Heart, Star, User, Mic, Calendar } from "lucide-react";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import { api } from "@/convex/_generated/api";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, {
    authorId: params.profileId,
  });

  if (!user || !podcastsData) return <LoaderSpinner />;

  // Calculate total views, likes, and average rating
  const totalViews = podcastsData.podcasts.reduce((sum, podcast) => sum + (podcast.views || 0), 0);
  const totalLikes = podcastsData.podcasts.reduce((sum, podcast) => sum + (podcast.likeCount || 0), 0);
  const averageRating = podcastsData.podcasts.length > 0 
    ? (podcastsData.podcasts.reduce((sum, podcast) => sum + (podcast.averageRating || 0), 0) / podcastsData.podcasts.length).toFixed(1)
    : "0.0";

  return (
    <section className="mt-9 flex flex-col">
      {/* Profile Header */}
      <div className="relative w-full rounded-2xl overflow-hidden mb-8">
        {/* Banner Background */}
        <div className="h-48 bg-gradient-to-r from-orange-1/30 to-purple-600/30 relative">
          {/* Removing the noise.png reference that's causing 404 error */}
          {/* Adding a CSS-based noise texture instead */}
          <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
               }}>
          </div>
        </div>
        
        {/* Rest of the component remains unchanged */}
        {/* Profile Info */}
        <div className="relative px-6 pb-6 -mt-20 flex flex-col md:flex-row md:items-end gap-6">
          {/* Profile Image */}
          <div className="relative z-10">
            <div className="size-36 rounded-full border-4 border-black overflow-hidden bg-white-1/10">
              {user?.imageUrl ? (
                <Image 
                  src={user.imageUrl} 
                  alt={user.name || "Profile"} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <User size={48} className="text-white-1" />
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="flex flex-col md:flex-1">
            <h1 className="text-3xl font-bold text-white-1">{user?.name || "Podcaster"}</h1>
            <p className="text-white-2 mt-1 flex items-center gap-2">
              <Mic size={16} className="text-orange-1" />
              {podcastsData.podcasts.length} {podcastsData.podcasts.length === 1 ? 'Podcast' : 'Podcasts'}
              <span className="mx-2">•</span>
              <Calendar size={16} className="text-orange-1" />
              Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          
          {/* Stats Cards - Desktop */}
          <div className="hidden md:flex gap-4">
            <StatCard icon={<Headphones size={20} />} value={totalViews.toString()} label="Total Views" />
            <StatCard icon={<Heart size={20} />} value={totalLikes.toString()} label="Total Likes" />
            <StatCard icon={<Star size={20} />} value={averageRating} label="Avg Rating" />
          </div>
        </div>
        
        {/* Stats Cards - Mobile */}
        <div className="flex md:hidden gap-3 px-6 mt-4 overflow-x-auto pb-2">
          <StatCard icon={<Headphones size={20} />} value={totalViews.toString()} label="Total Views" />
          <StatCard icon={<Heart size={20} />} value={totalLikes.toString()} label="Total Likes" />
          <StatCard icon={<Star size={20} />} value={averageRating} label="Avg Rating" />
        </div>
      </div>

      {/* Podcasts Section */}
      <section className="mt-6 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="bg-orange-1/10 p-3 rounded-xl">
            <Mic size={28} className="text-orange-1" />
          </div>
          <h1 className="text-2xl font-bold text-white-1">All Podcasts</h1>
        </div>
        
        {podcastsData && podcastsData.podcasts.length > 0 ? (
          <div className="podcast_grid">
            {podcastsData.podcasts.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                imgUrl={podcast.imageUrl!}
                title={podcast.podcastTitle!}
                description={podcast.podcastDescription}
                podcastId={podcast._id}
                views={podcast.views}
                likes={podcast.likeCount || 0}
                rating={podcast.averageRating}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No podcasts found"
            buttonLink="/create-podcast"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  );
};

// Stat Card Component
const StatCard = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
  <div className="bg-white-1/5 rounded-xl p-3 flex flex-col items-center min-w-24 border border-white-1/10">
    <div className="text-orange-1 mb-1">{icon}</div>
    <div className="text-xl font-bold text-white-1">{value}</div>
    <div className="text-xs text-white-2">{label}</div>
  </div>
);

export default ProfilePage;
