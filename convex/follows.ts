import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// userId here is always the Convex _id string

export const followUser = mutation({
  args: { followerId: v.string(), followingId: v.string() },
  handler: async (ctx, args) => {
    if (args.followerId === args.followingId) throw new ConvexError("Cannot follow yourself");

    const existing = await ctx.db.query("follows")
      .withIndex("by_follower_and_following", q => q.eq("follower", args.followerId).eq("following", args.followingId))
      .unique();
    if (existing) return existing;

    const followId = await ctx.db.insert("follows", {
      follower: args.followerId,
      following: args.followingId,
      createdAt: Date.now(),
    });

    const users = await ctx.db.query("users").collect();
    const followerUser = users.find(u => u._id.toString() === args.followerId);
    const followingUser = users.find(u => u._id.toString() === args.followingId);

    if (followerUser) await ctx.db.patch(followerUser._id, { followingCount: (followerUser.followingCount || 0) + 1 });
    if (followingUser) await ctx.db.patch(followingUser._id, { followersCount: (followingUser.followersCount || 0) + 1 });

    return { _id: followId };
  },
});

export const unfollowUser = mutation({
  args: { followerId: v.string(), followingId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("follows")
      .withIndex("by_follower_and_following", q => q.eq("follower", args.followerId).eq("following", args.followingId))
      .unique();
    if (!existing) return { success: false };

    await ctx.db.delete(existing._id);

    const users = await ctx.db.query("users").collect();
    const followerUser = users.find(u => u._id.toString() === args.followerId);
    const followingUser = users.find(u => u._id.toString() === args.followingId);

    if (followerUser && (followerUser.followingCount || 0) > 0)
      await ctx.db.patch(followerUser._id, { followingCount: followerUser.followingCount! - 1 });
    if (followingUser && (followingUser.followersCount || 0) > 0)
      await ctx.db.patch(followingUser._id, { followersCount: followingUser.followersCount! - 1 });

    return { success: true };
  },
});

export const isFollowing = query({
  args: { followerId: v.optional(v.string()), followingId: v.string() },
  handler: async (ctx, args) => {
    if (!args.followerId) return false;
    const existing = await ctx.db.query("follows")
      .withIndex("by_follower_and_following", q => q.eq("follower", args.followerId!).eq("following", args.followingId))
      .unique();
    return !!existing;
  },
});

export const getFollowers = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const follows = await ctx.db.query("follows")
      .withIndex("by_following", q => q.eq("following", args.userId))
      .collect();
    const users = await ctx.db.query("users").collect();
    return follows.map(f => {
      const u = users.find(u => u._id.toString() === f.follower);
      return u ? { _id: u._id, name: u.name, imageUrl: u.imageUrl, followedAt: f.createdAt } : null;
    }).filter(Boolean).sort((a, b) => (b?.followedAt ?? 0) - (a?.followedAt ?? 0));
  },
});

export const getFollowing = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const follows = await ctx.db.query("follows")
      .withIndex("by_follower", q => q.eq("follower", args.userId))
      .collect();
    const users = await ctx.db.query("users").collect();
    return follows.map(f => {
      const u = users.find(u => u._id.toString() === f.following);
      return u ? { _id: u._id, name: u.name, imageUrl: u.imageUrl, followedAt: f.createdAt } : null;
    }).filter(Boolean).sort((a, b) => (b?.followedAt ?? 0) - (a?.followedAt ?? 0));
  },
});

export const getFollowersCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) =>
    (await ctx.db.query("follows").withIndex("by_following", q => q.eq("following", args.userId)).collect()).length,
});

export const getFollowingCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) =>
    (await ctx.db.query("follows").withIndex("by_follower", q => q.eq("follower", args.userId)).collect()).length,
});
