import React from "react";
import Link from "next/link";
import UserAvatar from "@/components/ui/UserAvatar";

interface UserCardProps {
  user: {
    _id?: string;
    userId?: string;
    name: string;
    imageUrl?: string;
    isVerified?: boolean;
    totalPodcasts?: number;
    followersCount?: number;
    averageRating?: number;
    followedAt?: number;
  };
  activeTab: "followers" | "following" | "topPodcasters";
}

const UserCard = ({ user, activeTab }: UserCardProps) => {
  const profileId = user._id?.toString() || user.userId || '';

  return (
    <Link
      href={`/profile/${profileId}`}
      className="bg-black-5/40 border border-white-1/5 rounded-lg p-3 transition-all hover:bg-black-5 flex items-center gap-3"
    >
      <UserAvatar name={user.name} imageUrl={user.imageUrl} size={44} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-white-1 text-sm truncate">{user.name}</h3>
          {user.isVerified && (
            <span className="text-[9px] font-bold bg-green-1 text-black px-1.5 py-0.5 rounded-full flex-shrink-0">✓</span>
          )}
        </div>
        {activeTab === "topPodcasters" ? (
          <p className="text-white-3 text-xs mt-0.5">
            {user.totalPodcasts} podcasts · {user.followersCount || 0} followers
            {(user.averageRating ?? 0) > 0 && ` · ${user.averageRating!.toFixed(1)} ★`}
          </p>
        ) : (
          <p className="text-white-3 text-xs mt-0.5">
            {user.followedAt && new Date(user.followedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </p>
        )}
      </div>
    </Link>
  );
};

export default UserCard;
