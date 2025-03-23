"use client";

import { useQuery, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import LoaderSpinner from "@/components/LoaderSpinner";
import { api } from "@/convex/_generated/api";
import { useAudio } from "@/providers/AudioProvider";
import { useToast } from "@/components/ui/use-toast";
import PodcastTabs from "@/components/Profile/PodcastTabs";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileActionButtons from "@/components/Profile/ProfileActionButtons";
import FeaturedPodcast from "@/components/Profile/FeaturedPodcast";
import ProfileAbout from "@/components/Profile/ProfileAbout";
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
  const [isFollowing, setIsFollowing] = useState(false);
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
  // Sort podcasts for tabs
  const popularPodcasts = [...podcastsData.podcasts]
    .sort((a, b) => (b.views || 0) - (a.views || 0));

  const recentPodcasts = [...podcastsData.podcasts]
    .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0));

  return (
    <section className="mt-9 flex flex-col">
      {/* Profile Header */}
      <ProfileHeader
        user={user}
        podcastsData={podcastsData}
        totalViews={totalViews}
        totalLikes={totalLikes}
        averageRating={averageRating}
        isFollowing={isFollowing}
        followersCount={followersCount}
        followingCount={followingCount}
      />

      {/* Action buttons */}
      <ProfileActionButtons
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        hasPodcasts={podcastsData.podcasts.length > 0}
        toggleFollow={toggleFollow}
        playRandomPodcast={playRandomPodcast}
        shareProfile={shareProfile}
        clerkId={params.profileId}
        userName={user?.name || ""}
        userBio={user?.bio || ""}
        userWebsite={user?.website || ""}
        userSocialLinks={user?.socialLinks || []}
      />

      {/* Featured Podcast Section */}
      <FeaturedPodcast podcast={featuredPodcast} setAudio={setAudio} />

      {/* Tabbed Content Section */}
      <PodcastTabs
        popularPodcasts={popularPodcasts}
        recentPodcasts={recentPodcasts}
        isOwnProfile={isOwnProfile}
      />

      {/* About Section */}
      <ProfileAbout user={user} isOwnProfile={isOwnProfile} />
    </section>
  );
};

export default ProfilePage;