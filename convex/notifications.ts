import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserNotifications = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const notifications = await ctx.db.query("notifications")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();

    const users = await ctx.db.query("users").collect();

    return Promise.all(notifications.map(async (n) => {
      const creator = users.find(u => u._id.toString() === n.creatorId);
      let podcast = null;
      if (n.podcastId) {
        podcast = await ctx.db.query("podcasts")
          .filter(q => q.eq(q.field("_id"), n.podcastId))
          .first();
      }
      return {
        ...n,
        creatorName: creator?.name || "Unknown",
        creatorImageUrl: creator?.imageUrl,
        podcastTitle: podcast?.podcastTitle,
        podcastImageUrl: podcast?.imageUrl,
      };
    }));
  },
});

export const createNotification = mutation({
  args: {
    userId: v.string(),
    creatorId: v.string(),
    type: v.string(),
    podcastId: v.optional(v.id("podcasts")),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.userId === args.creatorId) return null;
    return ctx.db.insert("notifications", {
      userId: args.userId,
      creatorId: args.creatorId,
      type: args.type,
      podcastId: args.podcastId,
      message: args.message,
      isRead: false,
    });
  },
});

export const markNotificationAsReadUnread = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const n = await ctx.db.get(args.notificationId);
    if (!n) throw new Error("Not found");
    return ctx.db.patch(args.notificationId, { isRead: !n.isRead });
  },
});

export const markAllNotificationsAsReadUnread = mutation({
  args: { userId: v.string(), markAs: v.string() },
  handler: async (ctx, args) => {
    const targetIsRead = args.markAs === "read";
    const notifications = await ctx.db.query("notifications")
      .filter(q => q.and(q.eq(q.field("userId"), args.userId), q.eq(q.field("isRead"), !targetIsRead)))
      .collect();
    for (const n of notifications) await ctx.db.patch(n._id, { isRead: targetIsRead });
    return notifications.length;
  },
});

export const deleteNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const n = await ctx.db.get(args.notificationId);
    if (!n) throw new Error("Not found");
    await ctx.db.delete(args.notificationId);
    return true;
  },
});

export const clearAllNotifications = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const notifications = await ctx.db.query("notifications")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .collect();
    for (const n of notifications) await ctx.db.delete(n._id);
    return notifications.length;
  },
});
