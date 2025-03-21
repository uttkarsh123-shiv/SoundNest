import React from 'react';
import GridPodcastCard from '@/components/PodcastCard/GridPodcastCard';
import ListPodcastCard from '@/components/PodcastCard/ListPodcastCard';
import { Doc } from '@/convex/_generated/dataModel';

interface PodcastDisplayProps {
  filteredPodcasts: Doc<"podcasts">[];
  viewMode: 'grid' | 'list';
}

const PodcastDisplay = ({ filteredPodcasts, viewMode }: PodcastDisplayProps) => {
  return (
    <div className={viewMode === 'grid' ? "podcast_grid" : "flex flex-col gap-4"}>
      {filteredPodcasts.map((podcast, index) => (
        <div key={podcast._id}>
          {viewMode === 'grid' ? (
            <GridPodcastCard
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
          ) : (
            <ListPodcastCard
              _id={podcast._id}
              podcastTitle={podcast.podcastTitle}
              imageUrl={podcast.imageUrl || ''}
              views={podcast.views}
              audioDuration={podcast.audioDuration || 0}
              author={podcast.author || 'Unknown Author'}
              likeCount={podcast.likeCount}
              index={index}
              podcastType={podcast.podcastType}
              language={podcast.language}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PodcastDisplay;