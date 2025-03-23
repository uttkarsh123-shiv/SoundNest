import { v } from "convex/values";
import { query } from "../_generated/server";

// Helper function to get podcasts by author
const getPodcastsByAuthor = async (ctx, authorId) => {
  return await ctx.db
    .query("podcasts")
    .filter((q) => q.eq(q.field("authorId"), authorId))
    .collect();
};

// Helper function to search podcasts
const searchPodcasts = async (ctx, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === "") {
    return await ctx.db.query("podcasts").collect();
  }

  // Try author search first
  const authorSearch = await ctx.db
    .query("podcasts")
    .withSearchIndex("search_author", (q) => q.search("author", searchTerm))
    .collect();

  if (authorSearch.length > 0) {
    return authorSearch;
  }

  // Try title search
  const titleSearch = await ctx.db
    .query("podcasts")
    .withSearchIndex("search_title", (q) => q.search("podcastTitle", searchTerm))
    .collect();

  if (titleSearch.length > 0) {
    return titleSearch;
  }

  // Try description search
  return await ctx.db
    .query("podcasts")
    .withSearchIndex("search_body", (q) => q.search("podcastDescription", searchTerm))
    .collect();
};

// Helper function to apply category and language filters
const applyFilters = (podcasts, categories, languages) => {
  if (!categories?.length && !languages?.length) {
    return podcasts;
  }

  return podcasts.filter(podcast => {
    const categoryMatch = !categories?.length || 
      (podcast.podcastType && categories.includes(podcast.podcastType));
    
    const languageMatch = !languages?.length || 
      (podcast.language && languages.includes(podcast.language));
    
    return categoryMatch && languageMatch;
  });
};

// Helper function to calculate popularity score
const calculatePopularityScore = (podcast) => {
  const likes = podcast.likeCount || 0;
  const views = podcast.views || 0;
  const ratingCount = podcast.ratingCount || 0;
  const avgRating = podcast.averageRating || 0;

  const ratingScore = (ratingCount * avgRating) / 5;
  return ratingScore + likes * 2 + views;
};

// Helper function to calculate trending score
const calculateTrendingScore = (podcast) => {
  const likes = podcast.likeCount || 0;
  const views = podcast.views || 0;
  const now = Date.now();
  const daysSinceRelease = (now - podcast._creationTime) / (1000 * 60 * 60 * 24);
  
  return (likes * 2 + views) / Math.pow(daysSinceRelease + 1, 1.2);
};

// Helper function to sort podcasts
const sortPodcasts = (podcasts, sortType) => {
  const sortedPodcasts = [...podcasts]; // Create a copy to avoid mutating the original
  
  switch (sortType) {
    case "popular":
      sortedPodcasts.sort((a, b) => {
        return calculatePopularityScore(b) - calculatePopularityScore(a);
      });
      break;

    case "topRated":
      sortedPodcasts.sort((a, b) => {
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
        return (b.views || 0) - (a.views || 0);
      });
      break;
      
    case "trending":
      sortedPodcasts.sort((a, b) => {
        return calculateTrendingScore(b) - calculateTrendingScore(a);
      });
      break;
      
    case "latest":
    default:
      sortedPodcasts.sort((a, b) => b._creationTime - a._creationTime);
      break;
  }
  
  return sortedPodcasts;
};

// Universal podcast filtering and sorting function
export const getFilteredPodcasts = query({
  args: {
    type: v.optional(v.string()), // 'popular', 'trending', 'latest', 'topRated'
    search: v.optional(v.string()),
    categories: v.optional(v.array(v.string())),
    languages: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
    authorId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { type, search, categories, languages, limit, authorId } = args;
    let resultPodcasts = [];

    // Step 1: Get initial podcasts based on search, author, or get all
    if (authorId) {
      resultPodcasts = await getPodcastsByAuthor(ctx, authorId);
    } else {
      resultPodcasts = await searchPodcasts(ctx, search);
    }
    
    // Step 2: Apply category and language filters
    resultPodcasts = applyFilters(resultPodcasts, categories, languages);
    
    // Step 3: Sort based on type
    const sortType = type || 'latest'; // Default to latest if not specified
    resultPodcasts = sortPodcasts(resultPodcasts, sortType);
    
    // Step 4: Apply limit if specified
    if (limit && limit > 0) {
      resultPodcasts = resultPodcasts.slice(0, limit);
    }
    
    return resultPodcasts;
  },
});