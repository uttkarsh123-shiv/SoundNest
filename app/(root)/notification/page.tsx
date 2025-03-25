"use client";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Bell, User, Calendar, Headphones } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";
import LoaderSpinner from "@/components/LoaderSpinner";
import EmptyState from "@/components/EmptyState";

const NotificationPage = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  // Fetch notifications for the current user
  const notifications = useQuery(
    api.notifications.getUserNotifications,
    userId ? { userId } : "skip"
  );

  // Mark notifications as read when viewed
  useEffect(() => {
    if (userId && notifications && notifications.length > 0) {
      // Find unread notifications
      const unreadNotifications = notifications.filter(
        (notification) => !notification.isRead
      );
      
      if (unreadNotifications.length > 0) {
        // Mark them as read
        unreadNotifications.forEach((notification) => {
          // Call the markAsRead mutation for each notification
          // This would be implemented in your Convex backend
        });
      }
    }
  }, [notifications, userId]);

  // Filter notifications based on active tab
  const filteredNotifications = notifications?.filter((notification) => {
    if (activeTab === "all") return true;
    return !notification.isRead;
  });

  if (!userId) {
    return (
      <EmptyState
        title="Authentication Required"
        description="Please sign in to view your notifications"
        icon={<Bell size={48} className="text-orange-1" />}
      />
    );
  }

  if (!notifications) return <LoaderSpinner />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white-1">Notifications</h1>
        <div className="flex bg-black-1/50 rounded-full p-1">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "bg-orange-1 text-white-1"
                : "text-white-2 hover:text-white-1"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "unread"
                ? "bg-orange-1 text-white-1"
                : "text-white-2 hover:text-white-1"
            }`}
            onClick={() => setActiveTab("unread")}
          >
            Unread
          </button>
        </div>
      </div>

      {filteredNotifications && filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-black-1/30 border ${
                notification.isRead ? "border-gray-800" : "border-orange-1/50"
              } rounded-xl p-4 transition-all hover:bg-black-1/50 cursor-pointer`}
              onClick={() => {
                // Navigate based on notification type
                if (notification.type === "new_podcast" && notification.podcastId) {
                  router.push(`/podcast/${notification.podcastId}`);
                } else if (notification.type === "follow") {
                  router.push(`/profile/${notification.creatorId}`);
                }
              }}
            >
              <div className="flex items-start gap-4">
                {/* Notification icon */}
                <div className="bg-black-1/50 p-3 rounded-full">
                  {notification.type === "new_podcast" ? (
                    <Headphones size={24} className="text-orange-1" />
                  ) : notification.type === "follow" ? (
                    <User size={24} className="text-orange-1" />
                  ) : (
                    <Bell size={24} className="text-orange-1" />
                  )}
                </div>

                {/* Notification content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {notification.creatorImageUrl ? (
                      <Image
                        src={notification.creatorImageUrl}
                        alt={notification.creatorName}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : null}
                    <span className="font-semibold text-white-1">
                      {notification.creatorName}
                    </span>
                  </div>

                  <p className="text-white-2 mb-2">
                    {notification.type === "new_podcast"
                      ? `uploaded a new podcast: ${notification.podcastTitle}`
                      : notification.type === "follow"
                      ? "started following you"
                      : "liked your podcast"}
                  </p>

                  {/* Podcast image for new podcast notifications */}
                  {notification.type === "new_podcast" && notification.podcastImageUrl && (
                    <div className="mt-2">
                      <Image
                        src={notification.podcastImageUrl}
                        alt={notification.podcastTitle || "Podcast"}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="flex items-center text-sm text-white-3 mt-2">
                    <Calendar size={14} className="mr-1" />
                    {new Date(notification._creationTime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No notifications yet"
          description="When you receive notifications, they will appear here"
          icon={<Bell size={48} className="text-orange-1" />}
        />
      )}
    </div>
  );
};

export default NotificationPage;
