"use client";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { Bell, User, Calendar, Headphones, Check, CheckCircle, RefreshCw } from "lucide-react";
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

  // Get the mutations for notification status
  const toggleNotificationReadStatus = useMutation(api.notifications.markNotificationAsReadUnread);
  const markAllNotificationsAsRead = useMutation(api.notifications.markAllNotificationsAsRead);

  // Filter notifications based on active tab
  const filteredNotifications = notifications?.filter((notification) => {
    if (activeTab === "all") return true;
    return !notification.isRead;
  });

  // Handle notification click - mark as read and navigate
  const handleNotificationClick = (notification: any) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      toggleNotificationReadStatus({ notificationId: notification._id });
    }
    
    // Navigate based on notification type
    if (notification.type === "new_podcast" && notification.podcastId) {
      router.push(`/podcasts/${notification.podcastId}`);
    } else if (notification.type === "follow") {
      router.push(`/profile/${notification.creatorId}`);
    }
  };

  // Handle toggling notification read status
  const handleToggleReadStatus = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation(); // Prevent the notification click event
    toggleNotificationReadStatus({ notificationId });
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    if (userId) {
      markAllNotificationsAsRead({ userId });
    }
  };

  if (!notifications) return <LoaderSpinner />;

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white-1">Notifications</h1>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 text-sm text-white-2 hover:text-orange-1 transition-colors"
            >
              <Check size={16} />
              Mark all as read
            </button>
          )}
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
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        </div>
      </div>

      {filteredNotifications && filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-black-1/30 border ${
                notification.isRead ? "border-gray-800" : "border-orange-1/50"
              } rounded-xl p-4 transition-all hover:bg-black-1/50 cursor-pointer relative`}
              onClick={() => handleNotificationClick(notification)}
            >
              {/* Toggle read status button */}
              <button
                onClick={(e) => handleToggleReadStatus(e, notification._id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-black-1/50 hover:bg-orange-1/20 transition-colors"
                title={notification.isRead ? "Mark as unread" : "Mark as read"}
              >
                {notification.isRead ? (
                  <RefreshCw size={18} className="text-orange-1" />
                ) : (
                  <CheckCircle size={18} className="text-orange-1" />
                )}
              </button>
              
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
