import { ConvexError, v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Auth ─────────────────────────────────────────────────────────────────────

export const createUserWithPassword = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();
    if (existing) throw new ConvexError("Email already in use");
    return ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      passwordHash: args.passwordHash,
      imageUrl: args.imageUrl,
    });
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) =>
    ctx.db.query("users").filter(q => q.eq(q.field("email"), args.email)).first(),
});

// ── Profile ───────────────────────────────────────────────────────────────────

// Look up by Convex _id string (used everywhere user.id is passed)
export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find(u => u._id.toString() === args.userId);
    if (!user) throw new ConvexError("User not found");
    return user;
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.string(),
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    website: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.object({ platform: v.string(), url: v.string() }))),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find(u => u._id.toString() === args.userId);
    if (!user) throw new ConvexError("User not found");
    await ctx.db.patch(user._id, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.bio !== undefined && { bio: args.bio }),
      ...(args.website !== undefined && { website: args.website }),
      ...(args.imageUrl !== undefined && { imageUrl: args.imageUrl }),
      ...(args.socialLinks !== undefined && { socialLinks: args.socialLinks }),
    });
    return { success: true };
  },
});

// ── Admin ─────────────────────────────────────────────────────────────────────

export const isUserAdmin = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find(u => u._id.toString() === args.userId);
    return user?.isAdmin === true;
  },
});

export const setUserAdmin = mutation({
  args: { userId: v.string(), isAdmin: v.boolean(), requestingUserId: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const requester = users.find(u => u._id.toString() === args.requestingUserId);
    if (!requester?.isAdmin) throw new Error("Unauthorized");
    const target = users.find(u => u._id.toString() === args.userId);
    if (!target) throw new Error("User not found");
    await ctx.db.patch(target._id, { isAdmin: args.isAdmin });
    return { success: true };
  },
});

export const getAdminUsers = query({
  args: {},
  handler: async (ctx) => {
    const admins = await ctx.db.query("users").filter(q => q.eq(q.field("isAdmin"), true)).collect();
    return admins.map(u => ({ id: u._id, name: u.name, imageUrl: u.imageUrl, email: u.email }));
  },
});

export const getAdminCount = query({
  args: {},
  handler: async (ctx) => {
    const admins = await ctx.db.query("users").filter(q => q.eq(q.field("isAdmin"), true)).collect();
    return admins.length;
  },
});

export const requestAdminAccess = mutation({
  args: { userId: v.string(), reason: v.string() },
  handler: async (ctx, args) =>
    ctx.db.insert("adminRequests", {
      userId: args.userId,
      reason: args.reason,
      status: "pending",
      createdAt: new Date().toISOString(),
    }),
});

export const getAdminRequest = query({
  args: { userId: v.string() },
  handler: async (ctx, args) =>
    ctx.db.query("adminRequests")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .filter(q => q.eq(q.field("status"), "pending"))
      .first(),
});

export const getAdminRequests = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("adminRequests");
    if (args.status) q = q.filter(f => f.eq(f.field("status"), args.status));
    return q.collect();
  },
});

export const deleteAdminRequest = mutation({
  args: { requestId: v.id("adminRequests") },
  handler: async (ctx, args) => {
    const req = await ctx.db.get(args.requestId);
    if (!req) throw new Error("Not found");
    await ctx.db.delete(args.requestId);
    return true;
  },
});

// ── Discovery ─────────────────────────────────────────────────────────────────

export const searchUsers = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    if (!args.searchTerm) return [];
    const term = args.searchTerm.toLowerCase();
    const users = await ctx.db.query("users").collect();
    return users.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
  },
});

export const getTopUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    const userData = await Promise.all(users.map(async (u) => {
      const podcasts = await ctx.db.query("podcasts")
        .filter(q => q.eq(q.field("authorId"), u._id.toString()))
        .collect();

      const followers = await ctx.db.query("follows")
        .withIndex("by_following", q => q.eq("following", u._id.toString()))
        .collect();

      const totalViews = podcasts.reduce((s, p) => s + (p.views || 0), 0);
      const totalLikes = podcasts.reduce((s, p) => s + (p.likeCount || 0), 0);
      const ratedPodcasts = podcasts.filter(p => p.averageRating && p.ratingCount && p.ratingCount > 0);
      const avgRating = ratedPodcasts.length > 0
        ? ratedPodcasts.reduce((s, p) => s + (p.averageRating || 0), 0) / ratedPodcasts.length : 0;

      const sorted = [...podcasts].sort((a, b) =>
        ((b.views || 0) * 0.5 + (b.likeCount || 0) * 2) - ((a.views || 0) * 0.5 + (a.likeCount || 0) * 2)
      );

      const score = podcasts.length * 10 + totalViews * 0.2 + totalLikes * 2 + avgRating * 15 + followers.length * 5;

      return {
        ...u,
        totalPodcasts: podcasts.length,
        totalViews,
        totalLikes,
        averageRating: avgRating,
        followersCount: followers.length,
        podcast: sorted.map(p => ({ podcastTitle: p.podcastTitle, podcastId: p._id, podcastImage: p.imageUrl || u.imageUrl })),
        score,
      };
    }));

    return userData.sort((a, b) => b.score - a.score);
  },
});
