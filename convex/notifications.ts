import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all notifications for a user
export const getUserNotifications = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const notifications = await ctx.db
            .query("notifications")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .order("desc")
            .collect();

        // Enhance notifications with creator and podcast details
        const enhancedNotifications = await Promise.all(
            notifications.map(async (notification) => {
                // Get creator details
                const creator = await ctx.db
                    .query("users")
                    .filter((q) => q.eq(q.field("clerkId"), notification.creatorId))
                    .first();

                // For podcast notifications, get podcast details
                let podcast = null;
                if (notification.podcastId) {
                    podcast = await ctx.db
                        .query("podcasts")
                        .filter((q) => q.eq(q.field("_id"), notification.podcastId))
                        .first();
                }

                return {
                    ...notification,
                    creatorName: creator?.name || "Unknown Creator",
                    creatorImageUrl: creator?.imageUrl,
                    podcastTitle: podcast?.podcastTitle,
                    podcastImageUrl: podcast?.imageUrl,
                };
            })
        );

        return enhancedNotifications;
    },
});

// Create a new notification
export const createNotification = mutation({
    args: {
        userId: v.string(),
        creatorId: v.string(),
        type: v.string(),
        podcastId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Don't create notification if user is the creator
        if (args.userId === args.creatorId) {
            return null;
        }

        return await ctx.db.insert("notifications", {
            userId: args.userId,
            creatorId: args.creatorId,
            type: args.type,
            podcastId: args.podcastId,
            isRead: false,
        });
    },
});

// Mark a notification as read or unread (toggle)
export const markNotificationAsReadUnread = mutation({
    args: { notificationId: v.id("notifications") },
    handler: async (ctx, args) => {
        const notification = await ctx.db.get(args.notificationId);
        if (!notification) {
            throw new Error("Notification not found");
        }
        
        // Toggle the isRead status
        return await ctx.db.patch(args.notificationId, {
            isRead: !notification.isRead,
        });
    },
});

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const notifications = await ctx.db
            .query("notifications")
            .filter((q) =>
                q.and(
                    q.eq(q.field("userId"), args.userId),
                    q.eq(q.field("isRead"), false)
                )
            )
            .collect();

        for (const notification of notifications) {
            await ctx.db.patch(notification._id, {
                isRead: true,
            });
        }

        return notifications.length;
    },
});
