"use client";

import { useQuery} from "convex/react";
import Image from "next/image";
import { useState } from "react";
import { Headphones, Heart, Star, User, Mic, Calendar, Play, Share2 } from "lucide-react";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/providers/AudioProvider";
import { useToast } from "@/components/ui/use-toast";
import { PodcastProps } from "@/types";

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
  const { setAudio } = useAudio();
  const { toast } = useToast();
  const [randomPodcast, setRandomPodcast] = useState<PodcastProps | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  if (!user || !podcastsData) return <LoaderSpinner />;

  // Calculate total views, likes, and average rating
  const totalViews = podcastsData.podcasts.reduce((sum, podcast) => sum + (podcast.views || 0), 0);
  const totalLikes = podcastsData.podcasts.reduce((sum, podcast) => sum + (podcast.likeCount || 0), 0);
  const averageRating = podcastsData.podcasts.length > 0
    ? (podcastsData.podcasts.reduce((sum, podcast) => sum + (podcast.averageRating || 0), 0) / podcastsData.podcasts.length).toFixed(1)
    : "0.0";

  // Play random podcast function
  const playRandomPodcast = () => {
    if (podcastsData.podcasts.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * podcastsData.podcasts.length);
    const podcast = podcastsData.podcasts[randomIndex];
    
    setRandomPodcast(podcast);
    setAudio({
      title: podcast.podcastTitle || "",
      audioUrl: podcast.audioUrl || "",
      imageUrl: podcast.imageUrl || "",
      author: podcast.author || "",
      podcastId: podcast._id,
    });

    toast({
      title: "Now Playing",
      description: `${podcast.podcastTitle} by ${podcast.author}`,
      duration: 3000,
    });
  };

  // Share profile function
  const shareProfile = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.name}'s Podcast Profile`,
          text: `Check out ${user?.name}'s podcasts on PodTales!`,
          url: url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Profile link copied to clipboard",
        duration: 3000,
      });
    }
  };

  // Sort podcasts based on selection
  const sortedPodcasts = [...podcastsData.podcasts].sort((a, b) => {
    if (sortBy === 'latest') {
      return (b._creationTime || 0) - (a._creationTime || 0);
    } else {
      return (b.views || 0) - (a.views || 0);
    }
  });

  return (
    <section className="mt-9 flex flex-col">
      {/* Profile Header */}
      <div className="relative w-full rounded-2xl overflow-hidden mb-8 shadow-lg">
        {/* Banner Background */}
        <div className="h-56 bg-gradient-to-r from-orange-1/30 via-purple-600/30 to-blue-600/20 relative">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 sm:px-8 pb-8 -mt-24 flex flex-col md:flex-row md:items-end gap-8">
          {/* Profile Image */}
          <div className="relative z-10">
            <div className="size-36 sm:size-40 rounded-full border-4 border-black shadow-xl overflow-hidden bg-white-1/10">
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
          <div className="flex flex-col md:flex-1 mt-3 md:mt-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-white-1 drop-shadow-sm tracking-tight">{user?.name || "Podcaster"}</h1>
            <p className="text-white-2 mt-3 flex flex-wrap items-center gap-3 text-sm sm:text-base">
              <span className="flex items-center gap-2">
                <Mic size={16} className="text-orange-1" />
                <span className="font-medium">{podcastsData.podcasts.length} {podcastsData.podcasts.length === 1 ? 'Podcast' : 'Podcasts'}</span>
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-orange-1" />
                <span>Joined {new Date(user?._creationTime || Date.now()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</span>
              </span>
            </p>
            
            {/* Bio section */}
            {user?.bio && (
              <p className="text-white-2 mt-4 text-sm sm:text-base max-w-2xl">
                {user.bio}
              </p>
            )}
          </div>

          {/* Stats Cards - Desktop */}
          <div className="hidden md:flex gap-4">
            <StatCard icon={<Headphones size={20} />} value={totalViews.toLocaleString()} label="Total Views" />
            <StatCard icon={<Heart size={20} />} value={totalLikes.toLocaleString()} label="Total Likes" />
            <StatCard icon={<Star size={20} />} value={averageRating} label="Avg Rating" />
          </div>
        </div>

        {/* Stats Cards - Mobile */}
        <div className="flex md:hidden gap-4 px-6 mt-4 overflow-x-auto pb-4 snap-x">
          <StatCard icon={<Headphones size={20} />} value={totalViews.toLocaleString()} label="Total Views" />
          <StatCard icon={<Heart size={20} />} value={totalLikes.toLocaleString()} label="Total Likes" />
          <StatCard icon={<Star size={20} />} value={averageRating} label="Avg Rating" />
        </div>
      </div>

      {/* Action buttons - Moved outside of profile banner */}
      <div className="flex flex-wrap gap-3 mb-8">
        {podcastsData.podcasts.length > 0 && (
          <Button 
            onClick={playRandomPodcast}
            className="bg-orange-1 hover:bg-orange-1/90 text-white-1 flex items-center gap-2"
          >
            <Play size={16} />
            Play Random Podcast
          </Button>
        )}
        
        <Button 
          onClick={shareProfile}
          className="bg-white-1/10 hover:bg-white-1/20 text-white-1 flex items-center gap-2 border border-white-1/20"
        >
          <Share2 size={16} />
          Share Profile
        </Button>
      </div>

      {/* Podcasts Section */}
      <section className="mt-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-orange-1/10 p-3 rounded-xl">
              <Mic size={28} className="text-orange-1" />
            </div>
            <h1 className="text-2xl font-bold text-white-1">All Podcasts</h1>
          </div>
          
          {/* Sort options */}
          {podcastsData.podcasts.length > 1 && (
            <div className="flex gap-2">
              <Button 
                variant={sortBy === 'latest' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSortBy('latest')}
                className={sortBy === 'latest' ? 'bg-orange-1 text-white-1' : 'text-white-2'}
              >
                Latest
              </Button>
              <Button 
                variant={sortBy === 'popular' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSortBy('popular')}
                className={sortBy === 'popular' ? 'bg-orange-1 text-white-1' : 'text-white-2'}
              >
                Popular
              </Button>
            </div>
          )}
        </div>

        {podcastsData && podcastsData.podcasts.length > 0 ? (
          <div className="podcast_grid gap-6">
            {sortedPodcasts.map((podcast) => (
              <div key={podcast._id} className="group transition-all duration-300 hover:scale-[1.02]">
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
  <div className="bg-white-1/5 rounded-xl p-3 flex flex-col items-center min-w-24 border border-white-1/10 hover:bg-white-1/10 transition-colors">
    <div className="text-orange-1 mb-1">{icon}</div>
    <div className="text-xl font-bold text-white-1">{value}</div>
    <div className="text-xs text-white-2">{label}</div>
  </div>
);

export default ProfilePage;
