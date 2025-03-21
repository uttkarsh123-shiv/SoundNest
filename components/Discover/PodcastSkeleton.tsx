import React from 'react';

interface PodcastSkeletonProps {
  viewMode: 'grid' | 'list';
}

const PodcastSkeleton = ({ viewMode }: PodcastSkeletonProps) => {
  return (
    <div className={viewMode === 'grid' ? "podcast_grid" : "flex flex-col gap-4"}>
      {[...Array(6)].map((_, index) => (
        <div key={index} className={`bg-white-1/5 rounded-xl overflow-hidden border border-white-1/10 shadow-md ${viewMode === 'list' ? "flex" : ""}`}>
          <div className={`${viewMode === 'grid' ? "w-full aspect-square" : "w-[120px] h-[120px]"} bg-white-1/10 animate-pulse relative`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white-1/5 to-transparent"></div>
          </div>
          <div className="p-5 space-y-3 flex-1">
            <div className="h-5 bg-white-1/10 rounded-md animate-pulse w-4/5" />
            <div className="h-4 bg-white-1/10 rounded-md animate-pulse w-full" />
            <div className="h-4 bg-white-1/10 rounded-md animate-pulse w-3/5" />
            <div className="flex justify-between pt-2">
              <div className="h-4 bg-white-1/10 rounded-md animate-pulse w-[40px]" />
              <div className="h-4 bg-white-1/10 rounded-md animate-pulse w-[40px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PodcastSkeleton;