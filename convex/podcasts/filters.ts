import { v } from "convex/values";
import { query } from "../_generated/server";

// Featured/Popular, Trending, Latest Podcasts section
export const getFilteredPodcasts = query({
  args: {
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const podcasts = await ctx.db.query("podcasts").collect();

    // Sort the podcasts based on the requested type
    let sortedPodcasts = [];

    switch (args.type) {
      case "popular":
        // Calculate popularity score using the formula: (∑Ratings×Avg Rating)/5+(Likes×2)+(Views×1)
        sortedPodcasts = podcasts.sort((a, b) => {
          const aLikes = a.likeCount || 0;
          const bLikes = b.likeCount || 0;
          const aViews = a.views || 0;
          const bViews = b.views || 0;
          const aRatingCount = a.ratingCount || 0;
          const bRatingCount = b.ratingCount || 0;
          const aAvgRating = a.averageRating || 0;
          const bAvgRating = b.averageRating || 0;

          // Calculate popularity scores
          const aRatingScore = (aRatingCount * aAvgRating) / 5;
          const bRatingScore = (bRatingCount * bAvgRating) / 5;

          const aScore = aRatingScore + aLikes * 2 + aViews;
          const bScore = bRatingScore + bLikes * 2 + bViews;

          return bScore - aScore; // Higher score first
        });
        break;

      case "topRated":
        // Sort by average rating, considering only podcasts with at least one rating
        sortedPodcasts = podcasts.sort((a, b) => {
          const aRating = a.averageRating || 0;
          const bRating = b.averageRating || 0;
          const aCount = a.ratingCount || 0;
          const bCount = b.ratingCount || 0;

          // If both have ratings, compare by rating
          if (aCount > 0 && bCount > 0) {
            return bRating - aRating;
          }

          // If only one has ratings, prioritize the one with ratings
          if (aCount > 0) return -1;
          if (bCount > 0) return 1;

          // If neither has ratings, sort by views as a fallback
          return b.views - a.views;
        });
        break;
      case "trending":
        // Calculate trending score using the formula: (Likes×2)+(Views×1)/((Days Since Release+1)^1.2)
        sortedPodcasts = podcasts.sort((a, b) => {
          const aLikes = a.likeCount || 0;
          const bLikes = b.likeCount || 0;
          const aViews = a.views || 0;
          const bViews = b.views || 0;

          // Calculate days since release
          const now = Date.now();
          const aDaysSinceRelease =
            (now - a._creationTime) / (1000 * 60 * 60 * 24);
          const bDaysSinceRelease =
            (now - b._creationTime) / (1000 * 60 * 60 * 24);

          // Calculate trending scores
          const aScore =
            (aLikes * 2 + aViews) / Math.pow(aDaysSinceRelease + 1, 1.2);
          const bScore =
            (bLikes * 2 + bViews) / Math.pow(bDaysSinceRelease + 1, 1.2);

          return bScore - aScore; // Higher score first
        });
        break;
      case "latest":
        sortedPodcasts = podcasts.sort(
          (a, b) => b._creationTime - a._creationTime
        );
        break;
      default:
        throw new Error("Invalid podcast type");
    }

    return sortedPodcasts;
  },
});