import { v } from "convex/values";
import { query } from "../_generated/server";

// this query will get all the podcasts.
export const getAllPodcasts = query({
  handler: async (ctx) => {
    return await ctx.db.query("podcasts").order("desc").collect();
  },
});

// this query will get the podcast by the podcastId.
export const getPodcastById = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.podcastId);
  },
});

// this query will get the podcast by the authorId.
export const getPodcastByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const podcasts = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalListeners = podcasts.reduce(
      (sum, podcast) => sum + podcast.views,
      0
    );

    return { podcasts, listeners: totalListeners };
  },
});

// this query will get the podcast by the search query.
export const getPodcastBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("podcasts").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("podcasts")
      .withSearchIndex("search_author", (q) => q.search("author", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("podcasts")
      .withSearchIndex("search_title", (q) =>
        q.search("podcastTitle", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("podcasts")
      .withSearchIndex("search_body", (q) =>
        q.search("podcastDescription", args.search)
      )
      .take(10);
  },
});

// Function to get podcasts by language
export const getPodcastsByLanguage = query({
  args: {
    language: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("language"), args.language))
      .order("desc")
      .collect();
  },
});

// Function to get similar podcasts based on multiple parameters
export const getSimilarPodcasts = query({
  args: {
    podcastId: v.id("podcasts"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);
    if (!podcast) return [];
    
    const limit = args.limit || 9; // Default to 8 similar podcasts
    
    // Get all podcasts except the current one
    const allPodcasts = await ctx.db
      .query("podcasts")
      .filter((q) => q.neq(q.field("_id"), args.podcastId))
      .collect();
    
    // Calculate similarity scores for each podcast
    const scoredPodcasts = allPodcasts.map(p => {
      let score = 0;
      
      // Same author (highest weight)
      if (p.authorId === podcast.authorId) {
        score += 10;
      }
      
      // Same voice type (high weight)
      if (p.voiceType === podcast.voiceType) {
        score += 8;
      }
      
      // Same podcast type (medium weight)
      if (p.podcastType === podcast.podcastType) {
        score += 6;
      }
      
      // Same language (medium weight)
      if (p.language === podcast.language) {
        score += 6;
      }
      
      // Content similarity - check if titles or descriptions share keywords
      if (p.podcastTitle && podcast.podcastTitle) {
        const podcastWords = podcast.podcastTitle.toLowerCase().split(/\s+/);
        const otherWords = p.podcastTitle.toLowerCase().split(/\s+/);
        
        // Count matching words in titles
        const matchingTitleWords = podcastWords.filter(word => 
          word.length > 3 && otherWords.includes(word)
        ).length;
        
        if (matchingTitleWords > 0) {
          score += matchingTitleWords * 2; // 2 points per matching significant word
        }
      }
      
      // Description similarity
      if (p.podcastDescription && podcast.podcastDescription) {
        const podcastDesc = podcast.podcastDescription.toLowerCase().split(/\s+/);
        const otherDesc = p.podcastDescription.toLowerCase().split(/\s+/);
        
        // Count matching words in descriptions (only for words longer than 3 chars)
        const matchingDescWords = podcastDesc.filter(word => 
          word.length > 3 && otherDesc.includes(word)
        ).length;
        
        if (matchingDescWords > 0) {
          score += Math.min(matchingDescWords, 5); // Cap at 5 points to avoid overfitting
        }
      }
      
      // Popularity boost - give a small boost to popular podcasts
      if (p.views) {
        // Logarithmic scaling to avoid domination by very popular podcasts
        score += Math.min(Math.log10(p.views) * 0.5, 3);
      }
      
      // Rating boost - give a small boost to highly rated podcasts
      if (p.averageRating && p.averageRating > 4) {
        score += (p.averageRating - 4) * 2; // Up to 2 points for 5-star podcasts
      }
      
      // Recency boost - give a small boost to newer podcasts
      if (p._creationTime) {
        const ageInDays = (Date.now() - p._creationTime) / (1000 * 60 * 60 * 24);
        if (ageInDays < 30) {
          score += Math.max(0, (30 - ageInDays) / 10); // Up to 3 points for very new podcasts
        }
      }
      
      // Add some randomness to avoid always showing the same recommendations
      score += Math.random() * 2;
      
      return { podcast: p, score };
    });
    
    // Sort by score (highest first) and take the top results
    const sortedPodcasts = scoredPodcasts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.podcast);
    
    return sortedPodcasts;
  },
});