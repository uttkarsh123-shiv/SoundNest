import PodcastCard from '@/components/PodcastCard/GridPodcastCard';
import EmptyState from '@/components/EmptyState';
import { Id } from '@/convex/_generated/dataModel';

interface SimilarPodcastsProps {
  similarPodcasts: Array<{
    _id: Id<"podcasts">;
    podcastTitle: string;
    podcastDescription: string;
    imageUrl: string | null;
  }> | undefined;
}

const SimilarPodcasts = ({ similarPodcasts }: SimilarPodcastsProps) => {
  return (
    <section className="mt-12 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
        <h2 className="text-24 font-bold text-white-1">Similar Podcasts</h2>
      </div>

      {similarPodcasts && similarPodcasts.length > 0 ? (
        <div className="podcast_grid">
          {similarPodcasts.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
            <div key={_id} className="transform transition-all duration-300 hover:-translate-y-2">
              <PodcastCard
                imgUrl={imageUrl as string}
                title={podcastTitle}
                description={podcastDescription}
                podcastId={_id}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-black-1/30 p-8 rounded-xl border border-gray-800">
          <EmptyState
            title="No similar podcasts found"
            buttonLink="/discover"
            buttonText="Discover more podcasts"
          />
        </div>
      )}
    </section>
  );
};

export default SimilarPodcasts;