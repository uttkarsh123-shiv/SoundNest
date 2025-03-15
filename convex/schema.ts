import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  podcasts: defineTable({
    user: v.id("users"),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioUrl: v.optional(v.string()),
    audioStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    audioDuration: v.float64(),
    views: v.float64(),
    podcastType: v.optional(v.string()),
    likes: v.optional(v.array(v.string())),
    likeCount: v.optional(v.float64()),
    averageRating: v.optional(v.float64()),
    ratingCount: v.optional(v.float64()),
    language: v.optional(v.string()), // Add language field
  })
    .searchIndex("search_author", { searchField: "author" })
    .searchIndex("search_title", { searchField: "podcastTitle" })
    .searchIndex("search_body", { searchField: "podcastDescription" }),

  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
  }),
  ratings: defineTable({
    podcastId: v.id("podcasts"),
    userId: v.string(),
    rating: v.number(),
    createdAt: v.string(),
  })
    .index("by_podcast", ["podcastId"])
    .index("by_user_and_podcast", ["userId", "podcastId"]),

  comments: defineTable({
    podcastId: v.id("podcasts"),
    userId: v.string(),
    userName: v.string(),
    userImageUrl: v.string(),
    content: v.string(),
    createdAt: v.string(),
  })
    .index("by_podcast", ["podcastId"])
    .index("by_user", ["userId"]),
});
