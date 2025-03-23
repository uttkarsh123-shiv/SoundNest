import React from 'react';

interface PodcastCountDisplayProps {
  visibleCount: number;
  totalCount: number;
  selectedFilters?: {
    categories: string[];
    languages: string[];
  };
}

const PodcastCountDisplay = ({
  visibleCount,
  totalCount,
  selectedFilters
}: PodcastCountDisplayProps) => {
  return (
    <div className="text-center text-white-2 text-sm mt-6 bg-white-1/5 py-3 px-4 rounded-lg inline-block mx-auto">
      Showing {visibleCount} of {totalCount} {totalCount === 1 ? 'podcast' : 'podcasts'}
      {selectedFilters && (selectedFilters.categories.length > 0 || selectedFilters.languages.length > 0) && ' with selected filters'}
    </div>
  );
};

export default PodcastCountDisplay;