import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, Headphones, Star, Clock } from 'lucide-react';
import { podcastTypes, languageOptions } from '@/constants/PodcastFields';
import { Doc } from '@/convex/_generated/dataModel';

interface PodcastDisplayProps {
  filteredPodcasts: Doc<"podcasts">[];
  viewMode: 'grid' | 'list';
}

const PodcastDisplay = ({ filteredPodcasts, viewMode }: PodcastDisplayProps) => {
  const router = useRouter();

  return (
    <div className={viewMode === 'grid' ? "podcast_grid" : "flex flex-col gap-4"}>
      {filteredPodcasts.map((podcast) => (
        <div
          key={podcast._id}
          onClick={() => router.push(`/podcasts/${podcast._id}`)}
          className={`bg-white-1/5 rounded-xl overflow-hidden cursor-pointer hover:bg-white-1/10 transition-all ${viewMode === 'list' ? "flex" : ""}`}
        >
          <div className={`relative ${viewMode === 'grid' ? "w-full aspect-square" : "min-w-[120px] h-[120px]"}`}>
            <Image
              src={podcast.imageUrl!}
              alt={podcast.podcastTitle}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4 flex-1">
            <h3 className="text-white-1 font-bold truncate">{podcast.podcastTitle}</h3>
            <p className={`text-white-2 text-sm mt-1 ${viewMode === 'grid' ? "line-clamp-2 min-h-[40px]" : "line-clamp-1"}`}>
              {podcast.podcastDescription}
            </p>

            {podcast.podcastType && (
              <span className="inline-block bg-orange-1/20 text-orange-1 text-xs px-2 py-1 rounded-full mt-2">
                {podcastTypes.find(c => c.value === podcast.podcastType)?.label || podcast.podcastType}
              </span>
            )}
            
            {/* Display language badge if available */}
            {podcast.language && (
              <span className="inline-flex items-center bg-white-1/10 text-white-2 text-xs px-2 py-1 rounded-full mt-2 ml-2">
                {languageOptions.find(l => l.value === podcast.language)?.label || podcast.language}
              </span>
            )}

            <div className="flex justify-between mt-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Heart size={14} className="text-white-3" />
                  <span className="text-xs text-white-2">{podcast.likeCount || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Headphones size={14} className="text-white-3" />
                  <span className="text-xs text-white-2">{podcast.views || 0}</span>
                </div>
                {podcast.averageRating && (
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-white-3" />
                    <span className="text-xs text-white-2">
                      {podcast.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              {podcast.audioDuration !== undefined && (
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-white-3" />
                  <span className="text-xs text-white-2">
                    {Math.floor(podcast.audioDuration / 60) > 0
                      ? `${Math.floor(podcast.audioDuration / 60)} min`
                      : `${Math.round(podcast.audioDuration)} sec`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PodcastDisplay;