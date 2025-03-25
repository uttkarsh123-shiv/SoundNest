import React from "react";
import { TrendingUp, User, UserCheck } from "lucide-react";

type CommunityTab = "followers" | "following" | "topPodcasters";

interface TabSelectorProps {
  activeTab: CommunityTab;
  setActiveTab: (tab: CommunityTab) => void;
  followersCount?: number;
  followingCount?: number;
}

const TabSelector = ({ 
  activeTab, 
  setActiveTab, 
  followersCount, 
  followingCount 
}: TabSelectorProps) => {
  return (
    <div className="flex bg-black-1/50 rounded-full p-1">
      <button
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
          activeTab === "topPodcasters"
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
        Followers {followersCount > 0 && `(${followersCount})`}
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
        Following {followingCount > 0 && `(${followingCount})`}
      </button>
    </div>
  );
};

export default TabSelector;