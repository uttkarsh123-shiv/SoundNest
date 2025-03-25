"use client";
import { useState } from "react";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { User, UserCheck, Users, Search, TrendingUp } from "lucide-react";

import { api } from "@/convex/_generated/api";
import LoaderSpinner from "@/components/LoaderSpinner";
import EmptyState from "@/components/EmptyState";

const Community = () => {
  const { userId } = useAuth();
  const [activeTab, setActiveTab] = useState<"followers" | "following" | "topPodcasters">("topPodcasters");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch followers and following
  const followers = useQuery(api.follows.getFollowers, userId ? { userId } : "skip");
  const following = useQuery(api.follows.getFollowing, userId ? { userId } : "skip");
  
  // Fetch top users
  const topUsers = useQuery(api.users.getTopUsers);

  // Filter based on search query
  const getFilteredUsers = () => {
    if (activeTab === "followers") {
      return followers?.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (activeTab === "following") {
      return following?.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      return topUsers?.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
  };

  const filteredUsers = getFilteredUsers();

  if (!userId && (activeTab === "followers" || activeTab === "following")) {
    return (
      <EmptyState
        title="Authentication Required"
        description="Please sign in to view your connections"
        icon={<Users size={48} className="text-orange-1" />}
      />
    );
  }

  if ((activeTab === "followers" && followers === undefined) || 
      (activeTab === "following" && following === undefined) ||
      (activeTab === "topPodcasters" && topUsers === undefined)) {
    return <LoaderSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white-1">Community</h1>
        <div className="flex bg-black-1/50 rounded-full p-1">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "topPodcasters"
                ? "bg-orange-1 text-white-1"
                : "text-white-2 hover:text-white-1"
              }`}
            onClick={() => setActiveTab("topPodcasters")}
          >
            <TrendingUp size={16} />
            Top Podcasters
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "followers"
                ? "bg-orange-1 text-white-1"
                : "text-white-2 hover:text-white-1"
            }`}
            onClick={() => setActiveTab("followers")}
          >
            <User size={16} />
            Followers {followers?.length > 0 && `(${followers.length})`}
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "following"
                ? "bg-orange-1 text-white-1"
                : "text-white-2 hover:text-white-1"
            }`}
            onClick={() => setActiveTab("following")}
          >
            <UserCheck size={16} />
            Following {following?.length > 0 && `(${following.length})`}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-white-3" />
        </div>
        <input
          type="text"
          placeholder={`Search ${activeTab === "topPodcasters" ? "top podcasters" : activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-black-1/30 border border-gray-800 rounded-xl text-white-1 placeholder-white-3 focus:outline-none focus:border-orange-1/50"
        />
      </div>

      {/* Users list */}
      {filteredUsers && filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((user) => (
            <Link
              key={user.clerkId}
              href={`/profile/${user.clerkId}`}
              className="bg-black-1/30 border border-gray-800 rounded-xl p-4 transition-all hover:bg-black-1/50 flex items-center gap-4"
            >
              {/* User avatar */}
              <div className="flex-shrink-0">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.name}
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-14 h-14 bg-black-1/50 rounded-full flex items-center justify-center">
                    <User size={24} className="text-orange-1" />
                  </div>
                )}
              </div>

              {/* User info */}
              <div className="flex-1">
                <h3 className="font-semibold text-white-1 text-lg flex items-center gap-1">
                  {user.name}
                  {activeTab === "topPodcasters" && user.isVerified && (
                    <Image 
                      src="/icons/verified.svg"
                      alt="Verified"
                      width={16}
                      height={16}
                      className="inline-block"
                      title="Verified Podcaster"
                    />
                  )}
                </h3>
                {activeTab === "topPodcasters" ? (
                  <div className="flex flex-col">
                    <p className="text-white-3 text-sm">
                      {user.totalPodcasts} podcasts • {user.followersCount || 0} followers
                    </p>
                    {user.averageRating > 0 && (
                      <p className="text-orange-1 text-sm">
                        Rating: {user.averageRating.toFixed(1)} ★
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-white-3 text-sm">
                    {new Date(user.followedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            activeTab === "topPodcasters" 
              ? "No top podcasters found" 
              : `No ${activeTab} found`
          }
          description={
            searchQuery
              ? `No results found for "${searchQuery}"`
              : activeTab === "followers"
              ? "You don't have any followers yet"
              : activeTab === "following"
              ? "You're not following anyone yet"
              : "No top podcasters available at the moment"
          }
          icon={
            activeTab === "followers" ? (
              <User size={48} className="text-orange-1" />
            ) : activeTab === "following" ? (
              <UserCheck size={48} className="text-orange-1" />
            ) : (
              <TrendingUp size={48} className="text-orange-1" />
            )
          }
        />
      )}
    </div>
  );
};

export default Community;
