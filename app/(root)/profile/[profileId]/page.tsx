"use client";

import { useQuery, useMutation } from "convex/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Headphones, Heart, Star, User, Mic, Calendar, Play, Share2, Globe, Clock, Award, Users, Link, Twitter, Instagram, Youtube, Facebook, Linkedin, Github } from "lucide-react";
// Removed QrCode from imports since it's not being used

import { useAuth } from "@clerk/nextjs";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/providers/AudioProvider";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Near the top of the file, add the useRouter import if it's not already there
import { useRouter } from "next/navigation";

import ProfileEditModal from "@/components/ProfileEditModal";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  const router = useRouter(); // Add this line to get the router
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, {
    authorId: params.profileId,
  });
  // Fetch popular podcasts using the getFilteredPodcasts query
  const popularPodcastsData = useQuery(api.podcasts.getFilteredPodcasts, {
    type: "popular",
  });
  // Fetch recent podcasts using the getFilteredPodcasts query
  const recentPodcastsData = useQuery(api.podcasts.getFilteredPodcasts, {
    type: "latest",
  });

  // Add follow-related queries and mutations with proper error handling
  const isUserFollowing = useQuery(api.follows.isFollowing,
    { followingId: params.profileId }
  );

  const followersCount = useQuery(api.follows.getFollowersCount, {
    userId: params.profileId,
  });

  const followingCount = useQuery(api.follows.getFollowingCount, {
    userId: params.profileId,
  });

  const followUser = useMutation(api.follows.followUser);
  const unfollowUser = useMutation(api.follows.unfollowUser);

  const { setAudio } = useAudio();
  const { toast } = useToast();
  // Removed randomPodcast state since it's set but never read
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");
  const { userId } = useAuth();

  // Update isFollowing state when the query result changes
  useEffect(() => {
    if (isUserFollowing !== undefined) {
      setIsFollowing(isUserFollowing);
    }
  }, [isUserFollowing]);

  if (!user || !podcastsData || !popularPodcastsData || !recentPodcastsData) return <LoaderSpinner />;

  // Check if the profile being viewed is the current user's profile
  const isOwnProfile = userId === params.profileId;

  // Calculate total views, likes, and average rating
  const totalViews = podcastsData.podcasts.reduce((sum, podcast) => sum + (podcast.views || 0), 0);
  const totalLikes = podcastsData.podcasts.reduce((sum, podcast) => sum + (podcast.likeCount || 0), 0);
  const averageRating = podcastsData.podcasts.length > 0
    ? (podcastsData.podcasts.reduce((sum, podcast) => sum + (podcast.averageRating || 0), 0) / podcastsData.podcasts.length).toFixed(1)
    : "0.0";

  // Get featured podcast from popularPodcastsData (most viewed)
  const featuredPodcast = popularPodcastsData.length > 0
    ? popularPodcastsData.filter(podcast => podcast.authorId === params.profileId)[0]
    : null;

  // Play random podcast function
  const playRandomPodcast = () => {
    if (podcastsData.podcasts.length === 0) return;

    const randomIndex = Math.floor(Math.random() * podcastsData.podcasts.length);
    const podcast = podcastsData.podcasts[randomIndex];

    // Removed setRandomPodcast since the state isn't used elsewhere
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

  // Share profile function - simplified
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
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Profile link copied to clipboard",
        duration: 3000,
      });
    }
  };

  // Updated Follow/Unfollow function without notifications
  const toggleFollow = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to follow creators",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      if (isFollowing) {
        await unfollowUser({ followingId: params.profileId });
        setIsFollowing(false);
      } else {
        await followUser({ followingId: params.profileId });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  const popularPodcasts = [...podcastsData.podcasts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))

  const recentPodcasts = [...podcastsData.podcasts]
    .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0))

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
            <div className="size-36 sm:size-40 rounded-full border-4 border-black shadow-xl overflow-hidden bg-white-1/10 group">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.name || "Profile"}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <User size={48} className="text-white-1" />
                </div>
              )}
            </div>
            {podcastsData.podcasts.length > 0 && (
              <Badge className="absolute bottom-1 right-1 bg-orange-1 text-white-1 px-2 py-1 text-xs">
                Creator
              </Badge>
            )}
          </div>

          {/* Profile Details */}
          <div className="flex flex-col md:flex-1 mt-3 md:mt-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-bold text-white-1 drop-shadow-sm tracking-tight">{user?.name || "Podcaster"}</h1>
              {isFollowing && (
                <Badge variant="outline" className="border-orange-1 text-orange-1">
                  Following
                </Badge>
              )}
            </div>

            <p className="text-white-2 mt-3 flex flex-wrap items-center gap-3 text-sm sm:text-base">
              <span className="flex items-center gap-2">
                <Mic size={16} className="text-orange-1" />
                <span className="font-medium">{podcastsData.podcasts.length} {podcastsData.podcasts.length === 1 ? 'Podcast' : 'Podcasts'}</span>
              </span>
              {/* Followers count - removed clickable behavior */}
              {followersCount !== undefined && (
                <span className="flex items-center gap-2">
                  <User size={16} className="text-orange-1" />
                  <span>{followersCount} {followersCount === 1 ? 'Follower' : 'Followers'}</span>
                </span>
              )}
              {/* Following count - removed clickable behavior */}
              {followingCount !== undefined && (
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-orange-1" />
                  <span>{followingCount} Following</span>
                </span>
              )}
            </p>
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

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        {!isOwnProfile && (
          <Button
            onClick={toggleFollow}
            className={`${isFollowing
              ? 'bg-white-1/5 hover:bg-white-1/10 text-white-1 border border-white-1/10'
              : 'bg-gradient-to-r from-orange-1 to-orange-600 hover:opacity-90 text-black font-medium'} 
              flex items-center gap-2 px-5 py-2.5 rounded-full shadow-md transition-all duration-200`}
          >
            {isFollowing ? (
              <>
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-1 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-1"></span>
                </span>
                Following
              </>
            ) : (
              <>
                <Heart size={16} className={isFollowing ? "text-orange-1" : ""} />
                Follow
              </>
            )}
          </Button>
        )}

        {podcastsData.podcasts.length > 0 && (
          <Button
            onClick={playRandomPodcast}
            className="bg-black-1/50 hover:bg-black-1/70 text-white-1 flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-800"
          >
            <Play size={16} className="text-orange-1" />
            <span>Play Random</span>
          </Button>
        )}

        {isOwnProfile && (
          <ProfileEditModal
            clerkId={params.profileId}
            initialName={user?.name || ""}
            initialBio={user?.bio || ""}
            initialWebsite={user?.website || ""}
            initialSocialLinks={user?.socialLinks || []}
          />
        )}

        <Button
          onClick={shareProfile}
          className="bg-black-1/50 hover:bg-black-1/70 text-white-1 flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-800"
        >
          <Share2 size={16} className="text-orange-1" />
          <span>Share Profile</span>
        </Button>
      </div>

      {/* Featured Podcast Section */}
      {featuredPodcast && (
        <section className="my-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-1/10 p-2 rounded-lg">
              <Award size={20} className="text-orange-1" />
            </div>
            <h2 className="text-xl font-bold text-white-1">Featured Podcast</h2>
          </div>

          <div className="bg-white-1/5 rounded-xl p-4 border border-white-1/10">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 lg:w-1/4 aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={featuredPodcast.imageUrl || '/placeholder.png'}
                  alt={featuredPodcast.podcastTitle || 'Featured Podcast'}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <Button
                  className="absolute bottom-3 left-3 bg-orange-1 hover:bg-orange-1/90 rounded-full size-12 flex items-center justify-center p-0"
                  onClick={() => {
                    setAudio({
                      title: featuredPodcast.podcastTitle || "",
                      audioUrl: featuredPodcast.audioUrl || "",
                      imageUrl: featuredPodcast.imageUrl || "",
                      author: featuredPodcast.author || "",
                      podcastId: featuredPodcast._id,
                    });
                  }}
                >
                  <Play size={24} className="ml-1" />
                </Button>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white-1 mb-2">{featuredPodcast.podcastTitle || 'Featured Podcast'}</h3>
                <p className="text-white-2 text-sm mb-4 line-clamp-3">
                  {featuredPodcast.podcastDescription || 'No description available'}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-white-2">
                  <div className="flex items-center gap-1">
                    <Headphones size={16} className="text-orange-1" />
                    <span>{featuredPodcast.views?.toLocaleString() || 0} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={16} className="text-orange-1" />
                    <span>{featuredPodcast.likeCount?.toLocaleString() || 0} likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-orange-1" />
                    <span>{featuredPodcast.averageRating || 0} rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-orange-1" />
                    <span>{new Date(featuredPodcast._creationTime).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    className="bg-orange-1 hover:bg-orange-1/90 text-white-1"
                    onClick={() => {
                      setAudio({
                        title: featuredPodcast.podcastTitle || "",
                        audioUrl: featuredPodcast.audioUrl || "",
                        imageUrl: featuredPodcast.imageUrl || "",
                        author: featuredPodcast.author || "",
                        podcastId: featuredPodcast._id,
                      });
                    }}
                  >
                    <Play size={16} className="mr-2" /> Play Now
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white-1/20 text-white-1 hover:bg-white-1/10"
                    onClick={() => {
                      router.push(`/podcasts/${featuredPodcast._id}`);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tabbed Content Section - Only show if there are podcasts */}
      {podcastsData.podcasts.length > 0 ? (
        <Tabs defaultValue="popular" className="mb-10" onValueChange={setActiveTab}>
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

          <TabsContent value="popular" className="mt-0">
            <section className="flex flex-col gap-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-1/10 p-3 rounded-xl">
                  <Star size={28} className="text-orange-1" />
                </div>
                <h1 className="text-2xl font-bold text-white-1">Popular Podcasts</h1>
              </div>

              {popularPodcasts.length > 0 ? (
                <div className="podcast_grid gap-6">
                  {popularPodcasts.map((podcast) => (
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
                  title="No popular podcasts found"
                />
              )}
            </section>
          </TabsContent>

          <TabsContent value="recent" className="mt-0">
            <section className="flex flex-col gap-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-1/10 p-3 rounded-xl">
                  <Clock size={28} className="text-orange-1" />
                </div>
                <h1 className="text-2xl font-bold text-white-1">Recent Podcasts</h1>
              </div>

              {recentPodcasts.length > 0 ? (
                <div className="podcast_grid gap-6">
                  {recentPodcasts.map((podcast, index) => (
                    <div
                      key={podcast._id}
                      className="group transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: 'fadeIn 0.5s ease-in-out forwards',
                        opacity: 0
                      }}
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
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No recent podcasts found"
                />
              )}
            </section>
          </TabsContent>
        </Tabs>
      ) : (
        <section className="my-8">
          <EmptyState
            title={"No Podcasts created yet"}
            buttonLink={isOwnProfile ? "/create-podcast" : undefined}
            buttonText="Create Podcast"
          />
        </section>
      )}

      {/* About Section */}
      <section className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-orange-1/10 p-3 rounded-xl">
            <User size={28} className="text-orange-1" />
          </div>
          <h1 className="text-2xl font-bold text-white-1">About {user?.name}</h1>
        </div>

        <div className="bg-white-1/5 rounded-xl p-6 border border-white-1/10">
          {/* Bio */}
          {user?.bio ? (
            <p className="text-white-2 mb-6">{user.bio}</p>
          ) : (
            isOwnProfile && (
              <p className="text-white-3 italic mb-6">Add a bio to tell others about yourself.</p>
            )
          )}

          {/* Joining Date */}
          <div className="flex items-center gap-2 mb-6 text-white-2">
            <Calendar size={18} className="text-orange-1" />
            <span>Joined {user?._creationTime ? new Date(user._creationTime).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric',
              day: 'numeric'
            }) : 'recently'}</span>
          </div>

          {/* Website and Social Links */}
          <div className="flex flex-wrap gap-4">
            {user?.website && (
              <a
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full hover:bg-white-1/10 transition-colors"
              >
                <Globe size={18} className="text-orange-1" />
                <span className="text-white-2">Website</span>
              </a>
            )}

            {user?.socialLinks && user.socialLinks.length > 0 && user.socialLinks.map((link, index) => {
              // Get appropriate icon based on platform
              const getSocialIcon = (platform: string) => {
                switch (platform.toLowerCase()) {
                  case 'twitter': return <Twitter size={18} className="text-orange-1" />;
                  case 'instagram': return <Instagram size={18} className="text-orange-1" />;
                  case 'youtube': return <Youtube size={18} className="text-orange-1" />;
                  case 'facebook': return <Facebook size={18} className="text-orange-1" />;
                  case 'linkedin': return <Linkedin size={18} className="text-orange-1" />;
                  case 'github': return <Github size={18} className="text-orange-1" />;
                  default: return <Link size={18} className="text-orange-1" />;
                }
              };

              return (
                <a
                  key={index}
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full hover:bg-white-1/10 transition-colors"
                >
                  {getSocialIcon(link.platform)}
                  <span className="text-white-2">{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</span>
                </a>
              );
            })}

            {(!user?.website && (!user?.socialLinks || user.socialLinks.length === 0)) && isOwnProfile && (
              <p className="text-white-3 italic">Add your website and social links to help others connect with you.</p>
            )}
          </div>
        </div>
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