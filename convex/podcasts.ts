import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// create podcast mutation
export const createPodcast = mutation({
  args: {
    audioStorageId: v.optional(v.id("_storage")),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    views: v.float64(),
    audioDuration: v.float64(),
    podcastType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("podcasts", {
      audioStorageId: args.audioStorageId,
      user: user[0]._id,
      podcastTitle: args.podcastTitle,
      podcastDescription: args.podcastDescription,
      audioUrl: args.audioUrl,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
      author: user[0].name,
      authorId: user[0].clerkId,
      voicePrompt: args.voicePrompt,
      imagePrompt: args.imagePrompt,
      voiceType: args.voiceType,
      views: args.views,
      authorImageUrl: user[0].imageUrl,
      audioDuration: args.audioDuration,
      podcastType: args.podcastType,
      likes: args.likes || [],
      likeCount: args.likeCount || 0,
    });
  },
});

// this mutation is required to generate the url after uploading the file to the storage.
export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// this query will get all the podcasts based on the voiceType of the podcast , which we are showing in the Similar Podcasts section.
export const getPodcastByVoiceType = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    return await ctx.db
      .query("podcasts")
      .filter((q) =>
        q.and(
          q.eq(q.field("voiceType"), podcast?.voiceType),
          q.neq(q.field("_id"), args.podcastId)
        )
      )
      .collect();
  },
});

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
        sortedPodcasts = podcasts.sort(
          (a, b) =>
            ((b.likeCount && b.views) || 0) - ((a.likeCount && a.views) || 0)
        );
        break;
      case "trending":
        sortedPodcasts = podcasts.sort(
          (a, b) =>
            ((b.views && b.likeCount) || 0) - ((a.views && a.likeCount) || 0)
        );
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

// this mutation will update the views of the podcast.
export const updatePodcastViews = mutation({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    return await ctx.db.patch(args.podcastId, {
      views: podcast.views + 1,
    });
  },
});

// this mutation will delete the podcast.
export const deletePodcast = mutation({
  args: {
    podcastId: v.id("podcasts"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return await ctx.db.delete(args.podcastId);
  },
});

// this mutation will handle liking and unliking podcasts
export const likePodcast = mutation({
  args: { podcastId: v.id("podcasts"), userId: v.string() },
  handler: async (ctx, { podcastId, userId }) => {
    const podcast = await ctx.db.get(podcastId);
    if (!podcast) throw new Error("Podcast not found");

    // Initialize likes and likeCount if they don't exist
    const likes = podcast.likes ?? [];
    const likeCount = podcast.likeCount ?? 0;
    const hasLiked = likes.includes(userId);

    if (hasLiked) {
      // Unlike
      await ctx.db.patch(podcastId, {
        likes: likes.filter((id) => id !== userId),
        likeCount: Math.max(0, likeCount - 1), // Ensure count never goes below 0
      });
      return false;
    } else {
      // Like
      await ctx.db.patch(podcastId, {
        likes: [...likes, userId],
        likeCount: likeCount + 1,
      });
      return true;
    }
  },
});

// Function to rate a podcast
export const ratePodcast = mutation({
  args: {
    podcastId: v.id("podcasts"),
    userId: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const { podcastId, userId, rating } = args;
    
    // Check if the user has already rated this podcast
    const existingRating = await ctx.db
      .query("ratings")
      .withIndex("by_user_and_podcast", (q) => 
        q.eq("userId", userId).eq("podcastId", podcastId)
      )
      .first();
    
    if (existingRating) {
      // Update existing rating
      await ctx.db.patch(existingRating._id, { rating });
    } else {
      // Create new rating
      await ctx.db.insert("ratings", {
        podcastId,
        userId,
        rating,
        createdAt: new Date().toISOString(),
      });
    }
    
    // Calculate new average rating
    const allRatings = await ctx.db
      .query("ratings")
      .withIndex("by_podcast", (q) => q.eq("podcastId", podcastId))
      .collect();
    
    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allRatings.length;
    
    // Update podcast with new average rating and count
    await ctx.db.patch(podcastId, {
      averageRating,
      ratingCount: allRatings.length,
    });
    
    return { success: true };
  },
});

// Function to get a user's rating for a podcast
export const getUserRating = query({
  args: {
    podcastId: v.id("podcasts"),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { podcastId, userId } = args;
    
    if (!userId) return null;
    
    const rating = await ctx.db
      .query("ratings")
      .withIndex("by_user_and_podcast", (q) => 
        q.eq("userId", userId).eq("podcastId", podcastId)
      )
      .first();
    
    return rating ? { rating: rating.rating } : null;
  },
});

// Function to get rating distribution for a podcast
export const getRatingDistribution = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const { podcastId } = args;
    
    // Get all ratings for this podcast
    const allRatings = await ctx.db
      .query("ratings")
      .withIndex("by_podcast", (q) => q.eq("podcastId", podcastId))
      .collect();
    
    // Count ratings for each star level (1-5)
    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };
    
    // Count each rating
    allRatings.forEach(rating => {
      const starRating = rating.rating;
      if (starRating >= 1 && starRating <= 5) {
        distribution[starRating]++;
      }
    });
    
    return distribution;
  },
});

// Function to add a comment to a podcast
export const addComment = mutation({
  args: {
    podcastId: v.id("podcasts"),
    userId: v.string(),
    userName: v.string(),
    userImageUrl: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { podcastId, userId, userName, userImageUrl, content } = args;
    
    // Verify the podcast exists
    const podcast = await ctx.db.get(podcastId);
    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }
    
    // Create the comment
    return await ctx.db.insert("comments", {
      podcastId,
      userId,
      userName,
      userImageUrl,
      content,
      createdAt: new Date().toISOString(),
    });
  },
});

// Function to get comments for a podcast
export const getPodcastComments = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const { podcastId } = args;
    
    return await ctx.db
      .query("comments")
      .withIndex("by_podcast", (q) => q.eq("podcastId", podcastId))
      .order("desc")
      .collect();
  },
});

// Add this function to your existing podcasts.ts file

// Delete a comment
export const deleteComment = mutation({
  args: {
    commentId: v.string(),
    userId: v.string(),
    podcastId: v.id("podcasts"),
    isOwner: v.boolean()
  },
  handler: async (ctx, args) => {
    // Get the comment
    const comment = await ctx.db.get(args.commentId as Id<"comments">);
    
    if (!comment) {
      throw new Error("Comment not found");
    }
    
    // Check if the user is authorized to delete this comment
    // Allow deletion if user is the comment author or the podcast owner
    if (comment.userId !== args.userId && !args.isOwner) {
      throw new Error("Unauthorized to delete this comment");
    }
    
    // Delete the comment
    await ctx.db.delete(args.commentId as Id<"comments">);
    
    return { success: true };
  },
});
