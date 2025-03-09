'use client'
import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import PodcastCard from '@/components/PodcastCard'
import PodcastDetailPlayer from '@/components/PodcastDetailPlayer'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { useEffect, useState } from 'react'
import { Headphones, Clock, Calendar, Mic2, Layers, Star, MessageCircle } from 'lucide-react'

const PodcastDetails = ({ params: { podcastId } }: { params: { podcastId: Id<'podcasts'> } }) => {
  const { user } = useUser();

  const podcast = useQuery(api.podcasts.getPodcastById, { podcastId }) //To fetch podcast details
  const [hasUpdatedView, setHasUpdatedView] = useState(false);
  const updateViewCount = useMutation(api.podcasts.updatePodcastViews);

  // Rating state
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState(false);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

  // Rating mutation
  const submitRating = useMutation(api.podcasts.ratePodcast);
  const userRatingData = useQuery(api.podcasts.getUserRating, {
    podcastId,
    userId: user?.id
  });

  useEffect(() => {
    // Update the view count only once when the component mounts
    if (!hasUpdatedView && podcast) {
      updateViewCount({ podcastId }).then(() => setHasUpdatedView(true));
    }

    // Set user's previous rating if it exists
    if (userRatingData && userRatingData.rating) {
      setUserRating(userRatingData.rating);
      setHasRated(true);
    }
  }, [podcast, userRatingData]); // Only rerun if dependencies change

  const handleRatingSubmit = async () => {
    if (!user || !userRating) return;

    try {
      await submitRating({
        podcastId,
        userId: user.id,
        rating: userRating
      });
      setHasRated(true);
      setIsRatingSubmitted(true);

      // Reset submission status after showing success message
      setTimeout(() => {
        setIsRatingSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, { podcastId })
  if (!similarPodcasts || !podcast) return <LoaderSpinner />

  const isOwner = user?.id === podcast?.authorId;

  return (
    <section className="flex w-full flex-col">
      {/* Header Section */}
      <header className="mt-9 flex items-center justify-between bg-black-1/30 p-6 rounded-xl border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
          <h1 className="text-24 font-bold text-white-1">
            Currently Playing
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Category */}
          <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
            <Layers size={20} stroke="white" />
            <span className="text-14 font-medium text-white-2 capitalize">{podcast?.podcastType || "storytelling"}</span>
          </div>
          {/* Duration */}
          <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
            <Clock size={20} stroke="white" />
            <span className="text-14 font-medium text-white-2">
              {Math.floor(podcast?.audioDuration / 60)}:{Math.floor(podcast?.audioDuration % 60).toString().padStart(2, '0')}
            </span>
          </div>
          {/* Views */}
          <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
            <Headphones size={20} stroke="white" />
            <span className="text-14 font-medium text-white-2">{podcast?.views} views</span>
          </div>
          {/* Rating */}
          <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
            <Star size={20} stroke="white" fill={podcast?.averageRating ? "orange" : "none"} />
            <span className="text-14 font-medium text-white-2">
              {podcast?.averageRating ? podcast.averageRating.toFixed(1) : "No ratings"}
            </span>
          </div>
        </div>
      </header>

      {/* Player Section */}
      <div className="mt-6">
        <PodcastDetailPlayer
          isOwner={isOwner}
          podcastId={podcast._id}
          {...podcast}
        />
      </div>

      {/* Details Section */}
      <div className="mt-8 space-y-8">
        {/* Description */}
        <div className="bg-black-1/30 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
            <h2 className="text-20 font-bold text-white-1">Description</h2>
          </div>
          <p className="text-16 text-white-2 leading-relaxed">{podcast?.podcastDescription}</p>
        </div>

        {/* Transcription */}
        <div className="bg-black-1/30 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
              <h2 className="text-20 font-bold text-white-1">Transcription</h2>
            </div>
            <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
              <Mic2 size={20} stroke="white" />
              <span className="text-14 font-medium text-white-2">Voice: {podcast?.voiceType}</span>
            </div>
          </div>
          {podcast?.voicePrompt ? (
            <p className="text-16 text-white-2 leading-relaxed whitespace-pre-wrap">{podcast?.voicePrompt}</p>
          ) : (
            <p className="text-16 text-gray-1 leading-relaxed italic">No transcription provided</p>
          )}
        </div>

        {/* Thumbnail Prompt */}
        <div className="bg-black-1/30 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
            <h2 className="text-20 font-bold text-white-1">Thumbnail Details</h2>
          </div>
          {podcast?.imagePrompt ? (
            <p className="text-16 text-white-2 leading-relaxed">{podcast?.imagePrompt}</p>
          ) : (
            <p className="text-16 text-gray-1 leading-relaxed italic">Custom uploaded thumbnail</p>
          )}
        </div>

        {/* Creation Info */}
        <div className="bg-black-1/30 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
            <h2 className="text-20 font-bold text-white-1">Creation Info</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-black-1/50 p-3 rounded-full">
              <Calendar size={20} stroke="white" />
            </div>
            <div>
              <p className="text-14 text-white-3">Created on</p>
              <p className="text-16 font-medium text-white-2">
                {new Date(podcast?._creationTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        {!isOwner && user && (
          <div className="mt-8 bg-black-1/30 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
                <h2 className="text-20 font-bold text-white-1">Rate this Podcast</h2>
              </div>
              {podcast?.ratingCount > 0 && (
                <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
                  <MessageCircle size={18} stroke="white" />
                  <span className="text-14 font-medium text-white-2">{podcast.ratingCount} ratings</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="p-1 transition-transform hover:scale-110"
                    disabled={hasRated}
                  >
                    <Star
                      size={32}
                      className={`transition-colors ${(hoveredRating !== null ? star <= hoveredRating : star <= (userRating || 0))
                        ? "fill-orange-1 text-orange-1"
                        : "text-white-3"
                        }`}
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {!hasRated ? (
                  <button
                    onClick={handleRatingSubmit}
                    disabled={!userRating}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${userRating
                      ? "bg-orange-1 text-black hover:bg-orange-2"
                      : "bg-white-1/10 text-white-3 cursor-not-allowed"
                      }`}
                  >
                    Submit Rating
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg">
                    <span>Thanks for rating!</span>
                  </div>
                )}

                {isRatingSubmitted && (
                  <div className="animate-fadeIn bg-green-500/20 text-green-400 px-4 py-2 rounded-lg">
                    Rating submitted successfully!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Similar Podcasts Section */}
      <section className="mt-12 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
          <h2 className="text-24 font-bold text-white-1">Similar Podcasts</h2>
        </div>

        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className="podcast_grid">
            {similarPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
              <PodcastCard
                key={_id}
                imgUrl={imageUrl as string}
                title={podcastTitle}
                description={podcastDescription}
                podcastId={_id}
              />
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
    </section>
  )
}

export default PodcastDetails