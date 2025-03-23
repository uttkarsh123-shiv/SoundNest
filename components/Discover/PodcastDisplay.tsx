import React from 'react';
import GridPodcastCard from '@/components/PodcastCard/GridPodcastCard';
import ListPodcastCard from '@/components/PodcastCard/ListPodcastCard';
import { PodcastProps } from '@/types';

interface PodcastDisplayProps {
  filteredPodcasts: PodcastProps[];
  viewMode: 'grid' | 'list';
  loadMorePodcasts?: () => void;
  showLessPodcasts?: () => void;
  hasMorePodcasts?: boolean;
  canShowLess?: boolean;
  totalPodcasts?: number;
  visibleCount?: number;
  selectedFilters?: {
    categories: string[];
    languages: string[];
  };
}

const PodcastDisplay = ({ 
  filteredPodcasts, 
  viewMode,
  loadMorePodcasts,
  showLessPodcasts,
  hasMorePodcasts,
  canShowLess,
  totalPodcasts,
  visibleCount,
  selectedFilters
}: PodcastDisplayProps) => {
  return (
    <>
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

      {/* Show More/Less buttons */}
      <div className="flex justify-center mt-8 gap-4">
        {hasMorePodcasts && loadMorePodcasts && (
          <button 
            onClick={loadMorePodcasts}
            className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-full transition-all duration-300 flex items-center gap-2"
          >
            Show More
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        )}
        
        {canShowLess && showLessPodcasts && (
          <button 
            onClick={showLessPodcasts}
            className="bg-white-1/10 hover:bg-white-1/20 text-white py-2 px-6 rounded-full transition-all duration-300 flex items-center gap-2"
          >
            Show Less
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </button>
        )}
      </div>
      
      {/* Podcast count display */}
      {totalPodcasts !== undefined && visibleCount !== undefined && (
        <div className="text-center text-white-2 text-sm mt-6 bg-white-1/5 py-3 px-4 rounded-lg inline-block mx-auto">
          Showing {visibleCount} of {totalPodcasts} {totalPodcasts === 1 ? 'podcast' : 'podcasts'}
          {selectedFilters && (selectedFilters.categories.length > 0 || selectedFilters.languages.length > 0) && ' with selected filters'}
        </div>
      )}
    </>
  );
};

export default PodcastDisplay;