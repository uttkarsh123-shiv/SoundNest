import React from 'react';
import PodcastCard from '@/components/GridPodcastCard';
import { Doc } from '@/convex/_generated/dataModel';

interface PodcastDisplayProps {
  filteredPodcasts: Doc<"podcasts">[];
  viewMode: 'grid' | 'list';
}

const PodcastDisplay = ({ filteredPodcasts, viewMode }: PodcastDisplayProps) => {
  return (
    <div className={viewMode === 'grid' ? "podcast_grid" : "flex flex-col gap-4"}>
      {filteredPodcasts.map((podcast) => (
        <div
          key={podcast._id}
          className={`${viewMode === 'list' ? "flex" : ""}`}
        >
          <PodcastCard
            imgUrl={podcast.imageUrl || ''}
            title={podcast.podcastTitle}
            description={podcast.podcastDescription}
            podcastId={podcast._id}
            views={podcast.views}
            likes={podcast.likeCount}
            rating={podcast.averageRating}
            duration={podcast.audioDuration}
            podcastType={podcast.podcastType}
            language={podcast.language}
          />
        </div>
      ))}
    </div>
  );
};

export default PodcastDisplay;