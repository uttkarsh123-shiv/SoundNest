import { ConvexError, v } from "convex/values";

import { internalMutation, query } from "./_generated/server";

export const getUserById = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
            .unique();

        if (!user) {
            throw new ConvexError("User not found");
        }

        return user;
    },
});

// this query is used to get the top user by podcast count. first the podcast is
//  sorted by views and then the user is sorted by total podcasts, so the user 
// with the most podcasts will be at the top.
export const getTopUserByPodcastCount = query({
    args: {},
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users").collect();

        const userData = await Promise.all(
            user.map(async (u) => {
                const podcasts = await ctx.db
                    .query("podcasts")
                    .filter((q) => q.eq(q.field("authorId"), u.clerkId))
                    .collect();

                const sortedPodcasts = podcasts.sort((a, b) => b.views - a.views);

                return {
                    ...u,
                    totalPodcasts: podcasts.length,
                    podcast: sortedPodcasts.map((p) => ({
                        podcastTitle: p.podcastTitle,
                        podcastId: p._id,
                    })),
                };
            })
        );

        return userData.sort((a, b) => b.totalPodcasts - a.totalPodcasts);
    },
});

export const createUser = internalMutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("users", {
            clerkId: args.clerkId,
            email: args.email,
            imageUrl: args.imageUrl,
            name: args.name,
        });
    },
});

export const updateUser = internalMutation({
    args: {
        clerkId: v.string(),
        imageUrl: v.string(),
        email: v.string(),
    },
    async handler(ctx, args) {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
            .unique();

        if (!user) {
            throw new ConvexError("User not found");
        }

        await ctx.db.patch(user._id, {
            imageUrl: args.imageUrl,
            email: args.email,
        });

        const podcast = await ctx.db
            .query("podcasts")
            .filter((q) => q.eq(q.field("authorId"), args.clerkId))
            .collect();

        await Promise.all(
            podcast.map(async (p) => {
                await ctx.db.patch(p._id, {
                    authorImageUrl: args.imageUrl,
                });
            })
        );
    },
});

export const deleteUser = internalMutation({
    args: { clerkId: v.string() },
    async handler(ctx, args) {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
            .unique();

        if (!user) {
            throw new ConvexError("User not found");
        }

        await ctx.db.delete(user._id);
    },
});


// Add this new query to the existing users.ts file

// Get user with followers and following counts
export const getUserWithFollowCounts = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Get followers count
    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("following", args.clerkId))
      .collect();

    // Get following count
    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("follower", args.clerkId))
      .collect();

    return {
      ...user,
      followersCount: followers.length,
      followingCount: following.length
    };
  },
});

// Add this mutation to your existing users.ts file

export const updateUserProfile = mutation({
  args: {
    clerkId: v.string(),
    bio: v.optional(v.string()),
    website: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.object({
      platform: v.string(),
      url: v.string()
    }))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    // Ensure user can only update their own profile
    if (identity.subject !== args.clerkId) {
      throw new ConvexError("Unauthorized to update this profile");
    }

    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Update only the fields that are provided
    const updates: any = {};
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.website !== undefined) updates.website = args.website;
    if (args.socialLinks !== undefined) updates.socialLinks = args.socialLinks;

    return await ctx.db.patch(user._id, updates);
  },
});