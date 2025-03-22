'use client'
import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import PodcastCard from '@/components/PodcastCard/GridPodcastCard'
import PodcastDetailPlayer from '@/components/PodcastDetailPlayer'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'  // Add this import
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { useEffect, useState } from 'react'
import { Headphones, Clock, Calendar, Mic2, Layers, Star, MessageCircle, Trash2, ChevronDown, ChevronUp, ChartBar } from 'lucide-react'

const PodcastDetails = ({ params: { podcastId } }: { params: { podcastId: Id<'podcasts'> } }) => {
  const { user } = useUser();

  const podcast = useQuery(api.podcasts.getPodcastById, { podcastId }) //To fetch podcast details
  const [hasUpdatedView, setHasUpdatedView] = useState(false);
  const updateViewCount = useMutation(api.podcasts.updatePodcastViews);

  // Rating state
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState(false);
  const [showRatingAnalysis, setShowRatingAnalysis] = useState(false);

  // Comment state
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  // Rating mutation
  const submitRating = useMutation(api.podcasts.ratePodcast);
  const userRatingData = useQuery(api.podcasts.getUserRating, {
    podcastId,
    userId: user?.id
  });

  // Get rating distribution
  const ratingDistribution = useQuery(api.podcasts.getRatingDistribution, {
    podcastId
  });

  // Comments functionality
  const submitComment = useMutation(api.podcasts.addComment);
  const deleteComment = useMutation(api.podcasts.deleteComment);
  const podcastComments = useQuery(api.podcasts.getPodcastComments, { podcastId });

  useEffect(() => {
    // Add a check to prevent multiple view count updates
    if (!hasUpdatedView && podcast && typeof window !== 'undefined') {
      // Use sessionStorage to prevent multiple view counts in the same session
      const viewKey = `podcast-view-${podcastId}`;
      const hasViewedInSession = sessionStorage.getItem(viewKey);

      if (!hasViewedInSession) {
        updateViewCount({ podcastId }).then(() => {
          setHasUpdatedView(true);
          // Mark this podcast as viewed in this session
          sessionStorage.setItem(viewKey, 'true');
        });
      } else {
        // Already viewed in this session, just update the state
        setHasUpdatedView(true);
      }
    }

    // Set user's previous rating if it exists
    if (userRatingData && userRatingData.rating) {
      setUserRating(userRatingData.rating);
      setHasRated(true);
    }
  }, [podcast, userRatingData, podcastId, updateViewCount]); // Add proper dependencies

  const handleRatingSubmit = async () => {
    if (!user || !userRating) return;

    try {
      await submitRating({
        podcastId,
        userId: user.id,
        rating: userRating
      });
      setHasRated(true);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user || !comment.trim()) return;

    try {
      await submitComment({
        podcastId,
        userId: user.id,
        userName: user.fullName || user.username || "Anonymous",
        userImageUrl: user.imageUrl,
        content: comment.trim()
      });
      setComment(''); // Clear comment input after submission
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleCommentDelete = async (commentId: Id<"comments">) => {
    if (!user) return;

    try {
      await deleteComment({
        commentId,
        userId: user.id,
        podcastId,
        isOwner: isOwner
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
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
          audioUrl={podcast.audioUrl || ''}
          podcastTitle={podcast.podcastTitle}
          author={podcast.author || ''}
          imageUrl={podcast.imageUrl || ''}
          imageStorageId={podcast.imageStorageId as Id<"_storage">}
          audioStorageId={podcast.audioStorageId as Id<"_storage">}
          authorImageUrl={podcast.authorImageUrl || ''}
          authorId={podcast.authorId}
          likes={podcast.likes}
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
        {user && (
          <div className="mt-8 bg-black-1/30 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
                <h2 className="text-20 font-bold text-white-1">Rate this Podcast</h2>
              </div>
              {podcast?.ratingCount && podcast.ratingCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
                    <Star size={18} stroke="white" />
                    <span className="text-14 font-medium text-white-2">{podcast.ratingCount} ratings</span>
                  </div>
                  <button
                    onClick={() => setShowRatingAnalysis(!showRatingAnalysis)}
                    className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full hover:bg-white-1/10 transition-colors"
                  >
                    <ChartBar size={18} stroke="white" />
                    <span className="text-14 font-medium text-white-2">
                      {showRatingAnalysis ? "Hide Analysis" : "Show Analysis"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {showRatingAnalysis && podcast?.ratingCount && podcast.ratingCount > 0 && (
              <div className="mb-6 bg-black-1/50 p-4 rounded-lg border border-white-1/10 animate-fadeIn">
                <h3 className="text-white-1 font-medium mb-3">Rating Distribution</h3>
                <div className="space-y-2">
                  {ratingDistribution && [5, 4, 3, 2, 1].map((star) => {
                  const count = ratingDistribution[star as keyof typeof ratingDistribution] || 0;
                  const percentage = podcast.ratingCount && podcast.ratingCount > 0
                    ? Math.round((count / podcast.ratingCount) * 100)
                    : 0;
                  
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex items-center w-16">
                        <span className="text-white-2 font-medium">{star}</span>
                        <Star size={16} className="ml-1 fill-orange-1 text-orange-1" />
                      </div>
                      <div className="flex-1 h-4 bg-black-1/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-1 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-24 flex justify-between">
                        <span className="text-white-3 text-sm">{count} {count === 1 ? 'user' : 'users'}</span>
                        <span className="text-white-2 text-sm font-medium">{percentage}%</span>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            )}

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
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg">
                      <span>Your rating: {userRating} ★</span>
                    </div>
                    <button
                      onClick={() => setHasRated(false)}
                      className="px-4 py-2 rounded-lg font-medium bg-white-1/10 text-white-2 hover:bg-white-1/20 transition-all"
                    >
                      Modify Rating
                    </button>
                  </div>
                )}

                {/* Removing the rating submission message */}
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        {/* Comments Section */}
        <div className="bg-black-1/30 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
            <h2 className="text-20 font-bold text-white-1">Comments</h2>
            {podcastComments && podcastComments.length > 0 && (
              <span className="text-14 text-white-3 bg-black-1/50 px-3 py-1 rounded-full">
                {podcastComments.length}
              </span>
            )}
          </div>

          {/* Add Comment Form */}
          {user && (
            <div className="mb-6">
              <div className="flex gap-4 bg-black-1/50 p-4 rounded-lg border border-gray-800">
                <div className="flex-shrink-0">
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === ' ') {
                        e.stopPropagation();
                      }
                    }}
                    placeholder="Share your thoughts about this podcast..."
                    className="w-full bg-black-1/70 border border-gray-800 rounded-lg p-3 text-white-2 placeholder:text-white-3 focus:outline-none focus:ring-1 focus:ring-orange-1 min-h-[100px]"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleCommentSubmit}
                      disabled={!comment.trim()}
                      className={`px-5 py-2 rounded-lg font-medium transition-all ${comment.trim()
                        ? "bg-orange-1 text-black hover:bg-orange-2"
                        : "bg-white-1/10 text-white-3 cursor-not-allowed"
                        }`}
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Show Comments Toggle */}
          {podcastComments && podcastComments.length > 0 ? (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 bg-black-1/50 px-5 py-2 rounded-full hover:bg-white-1/10 transition-colors"
              >
                {showComments ? (
                  <>
                    <ChevronUp size={18} stroke="white" />
                    <span className="text-14 font-medium text-white-2">Hide Comments</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={18} stroke="white" />
                    <span className="text-14 font-medium text-white-2">Show {podcastComments.length} Comments</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            !user && (
              <div className="text-center py-8 bg-black-1/50 rounded-lg border border-gray-800">
                <MessageCircle size={40} className="mx-auto mb-3 text-white-3" />
                <p className="text-white-3">No comments yet. Sign in to be the first to comment!</p>
              </div>
            )
          )}

          {/* Comments List */}
          {showComments && (
            <div className="space-y-6">
              {podcastComments && podcastComments.length > 0 ? (
                podcastComments.map((comment) => (
                  <div key={comment._id} className="flex gap-4 bg-black-1/50 p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex-shrink-0">
                      <img
                        src={comment.userImageUrl}
                        alt={comment.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-16 font-medium text-white-1">{comment.userName}</h4>
                          <span className="text-12 text-white-3">
                            {new Date(comment._creationTime).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        {user && (user.id === comment.userId || isOwner) && (
                          <button
                            onClick={() => handleCommentDelete(comment._id)}
                            className="text-white-3 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-white-1/10"
                            title="Delete comment"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <p className="text-15 text-white-2">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-black-1/50 rounded-lg border border-gray-800">
                  <MessageCircle size={40} className="mx-auto mb-3 text-white-3" />
                  <p className="text-white-3">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          )}
        </div>
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
    </section>
  )
}

export default PodcastDetails