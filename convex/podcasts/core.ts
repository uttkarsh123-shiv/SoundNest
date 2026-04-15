import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";

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
    language: v.optional(v.string()),
    likes: v.optional(v.array(v.string())),
    likeCount: v.optional(v.number()),
    // authorId passed from client (our user._id string)
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find(u => u._id.toString() === args.authorId);
    if (!user) throw new ConvexError("User not found");

    const podcastId = await ctx.db.insert("podcasts", {
      audioStorageId: args.audioStorageId,
      user: user._id,
      podcastTitle: args.podcastTitle,
      podcastDescription: args.podcastDescription,
      audioUrl: args.audioUrl,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
      author: user.name,
      authorId: args.authorId,
      voicePrompt: args.voicePrompt,
      imagePrompt: args.imagePrompt,
      voiceType: args.voiceType,
      views: args.views,
      authorImageUrl: user.imageUrl,
      audioDuration: args.audioDuration,
      podcastType: args.podcastType,
      likes: args.likes || [],
      likeCount: args.likeCount || 0,
      language: args.language,
    });

    // Notify followers
    const followers = await ctx.db.query("follows")
      .withIndex("by_following", q => q.eq("following", args.authorId))
      .collect();

    for (const follower of followers) {
      await ctx.db.insert("notifications", {
        userId: follower.follower,
        creatorId: args.authorId,
        type: "new_podcast",
        podcastId,
        isRead: false,
      });
    }

    return podcastId;
  },
});

export const getUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => ctx.storage.getUrl(args.storageId),
});

export const deletePodcast = mutation({
  args: {
    podcastId: v.id("podcasts"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);
    if (!podcast) throw new ConvexError("Podcast not found");

    const notifications = await ctx.db.query("notifications")
      .filter(q => q.eq(q.field("podcastId"), args.podcastId))
      .collect();
    for (const n of notifications) await ctx.db.delete(n._id);

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return ctx.db.delete(args.podcastId);
  },
});

export const updatePodcastViews = mutation({
  args: { podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);
    if (!podcast) throw new ConvexError("Podcast not found");
    return ctx.db.patch(args.podcastId, { views: podcast.views + 1 });
  },
});
