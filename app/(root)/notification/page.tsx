"use client";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { Bell, User, Calendar, Headphones, Check, CheckCircle, RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";
import LoaderSpinner from "@/components/LoaderSpinner";
import EmptyState from "@/components/EmptyState";

// Types for notifications
type NotificationType = "new_podcast" | "follow" | "like";
type NotificationTab = "all" | "unread";

interface Notification {
  _id: string;
  _creationTime: number;
  type: NotificationType;
  isRead: boolean;
  creatorName: string;
  creatorId: string;
  creatorImageUrl?: string;
  podcastId?: string;
  podcastTitle?: string;
  podcastImageUrl?: string;
}

// Notification action buttons component
const NotificationActions = ({ 
  notification, 
  onToggleRead, 
  onDelete 
}: { 
  notification: Notification; 
  onToggleRead: (e: React.MouseEvent) => void; 
  onDelete: (e: React.MouseEvent) => void; 
}) => (
  <div className="absolute top-2 right-2 flex gap-1">
    <button
      onClick={onToggleRead}
      className="p-1 rounded-full bg-black-1/50 hover:bg-orange-1/20 transition-colors"
      title={notification.isRead ? "Mark as unread" : "Mark as read"}
    >
      {notification.isRead ? (
        <RefreshCw size={18} className="text-orange-1" />
      ) : (
        <CheckCircle size={18} className="text-orange-1" />
      )}
    </button>
    <button
      onClick={onDelete}
      className="p-1 rounded-full bg-black-1/50 hover:bg-red-500/20 transition-colors"
      title="Delete notification"
    >
      <Trash2 size={18} className="text-red-500" />
    </button>
  </div>
);

// Notification icon component
const NotificationIcon = ({ type }: { type: NotificationType }) => (
  <div className="bg-black-1/50 p-3 rounded-full">
    {type === "new_podcast" ? (
      <Headphones size={24} className="text-orange-1" />
    ) : type === "follow" ? (
      <User size={24} className="text-orange-1" />
    ) : (
      <Bell size={24} className="text-orange-1" />
    )}
  </div>
);

// Notification content component
const NotificationContent = ({ notification }: { notification: Notification }) => (
  <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
      {notification.creatorImageUrl && (
        <Image
          src={notification.creatorImageUrl}
          alt={notification.creatorName}
          width={24}
          height={24}
          className="rounded-full"
        />
      )}
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
);

// Notification item component
const NotificationItem = ({ 
  notification, 
  onNotificationClick, 
  onToggleReadStatus, 
  onDeleteNotification 
}: { 
  notification: Notification; 
  onNotificationClick: () => void; 
  onToggleReadStatus: (e: React.MouseEvent) => void; 
  onDeleteNotification: (e: React.MouseEvent) => void; 
}) => (
  <div
    key={notification._id}
    className={`bg-black-1/30 border ${notification.isRead ? "border-gray-800" : "border-orange-1/50"
      } rounded-xl p-4 transition-all hover:bg-black-1/50 cursor-pointer relative`}
    onClick={onNotificationClick}
  >
    <NotificationActions 
      notification={notification} 
      onToggleRead={onToggleReadStatus} 
      onDelete={onDeleteNotification} 
    />
    <div className="flex items-start gap-4">
      <NotificationIcon type={notification.type} />
      <NotificationContent notification={notification} />
    </div>
  </div>
);

// Confirmation modal component
const ConfirmationModal = ({ 
  onCancel, 
  onConfirm 
}: { 
  onCancel: () => void; 
  onConfirm: () => void; 
}) => (
  <div className="fixed inset-0 bg-black-1/80 flex items-center justify-center z-50 p-4">
    <div className="bg-black-1 border border-gray-800 rounded-xl p-6 max-w-md w-full">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle size={24} className="text-red-500" />
        <h2 className="text-xl font-bold text-white-1">Clear all notifications?</h2>
      </div>
      <p className="text-white-2 mb-6">
        This will permanently delete all your notifications. This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-md text-white-1 hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  </div>
);

// Tab selector component
const TabSelector = ({ 
  activeTab, 
  setActiveTab, 
  unreadCount 
}: { 
  activeTab: NotificationTab; 
  setActiveTab: (tab: NotificationTab) => void; 
  unreadCount: number; 
}) => (
  <div className="flex bg-black-1/50 rounded-full p-1">
    <button
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "all"
          ? "bg-orange-1 text-white-1"
          : "text-white-2 hover:text-white-1"
        }`}
      onClick={() => setActiveTab("all")}
    >
      All
    </button>
    <button
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "unread"
          ? "bg-orange-1 text-white-1"
          : "text-white-2 hover:text-white-1"
        }`}
      onClick={() => setActiveTab("unread")}
    >
      Unread {unreadCount > 0 && `(${unreadCount})`}
    </button>
  </div>
);

// Main notification page component
const NotificationPage = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Fetch notifications for the current user
  const notifications = useQuery(
    api.notifications.getUserNotifications,
    userId ? { userId } : "skip"
  );

  // Get the mutations for notification status
  const toggleNotificationReadStatus = useMutation(api.notifications.markNotificationAsReadUnread);
  const markAllNotificationsReadUnread = useMutation(api.notifications.markAllNotificationsAsReadUnread);
  const deleteNotification = useMutation(api.notifications.deleteNotification);
  const clearAllNotifications = useMutation(api.notifications.clearAllNotifications);

  // Filter notifications based on active tab
  const filteredNotifications = notifications?.filter((notification) => {
    if (activeTab === "all") return true;
    return !notification.isRead;
  });

  // Handle notification click - mark as read and navigate
  const handleNotificationClick = (notification: Notification) => {
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
      markAllNotificationsReadUnread({ userId, markAs: "read" });
    }
  };

  // Handle marking all notifications as unread
  const handleMarkAllAsUnread = () => {
    if (userId) {
      markAllNotificationsReadUnread({ userId, markAs: "unread" });
    }
  };

  // Handle deleting a single notification
  const handleDeleteNotification = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation(); // Prevent the notification click event
    deleteNotification({ notificationId });
  };

  // Handle clearing all notifications
  const handleClearAllNotifications = () => {
    if (userId) {
      clearAllNotifications({ userId });
      setShowConfirmClear(false);
    }
  };

  if (!notifications) return <LoaderSpinner />;

  // Count unread and read notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const readCount = notifications.filter(n => n.isRead).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white-1">Notifications</h1>
        <div className="flex items-center gap-4">
          {notifications.length > 0 && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="flex items-center gap-1 text-sm text-white-2 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
              Clear all
            </button>
          )}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 text-sm text-white-2 hover:text-orange-1 transition-colors"
            >
              <Check size={16} />
              Mark all as read
            </button>
          )}
          {readCount > 0 && (
            <button
              onClick={handleMarkAllAsUnread}
              className="flex items-center gap-1 text-sm text-white-2 hover:text-orange-1 transition-colors"
            >
              <RefreshCw size={16} />
              Mark all as unread
            </button>
          )}
          <TabSelector 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            unreadCount={unreadCount} 
          />
        </div>
      </div>

      {/* Confirmation modal for clearing all notifications */}
      {showConfirmClear && (
        <ConfirmationModal 
          onCancel={() => setShowConfirmClear(false)} 
          onConfirm={handleClearAllNotifications} 
        />
      )}

      {filteredNotifications && filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onNotificationClick={() => handleNotificationClick(notification)}
              onToggleReadStatus={(e) => handleToggleReadStatus(e, notification._id)}
              onDeleteNotification={(e) => handleDeleteNotification(e, notification._id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No notifications yet"
          description="Join our community to connect with podcasters and get notified about new content"
          icon={<Bell size={48} className="text-orange-1" />}
          action={
            <button 
              onClick={() => router.push('/community')}
              className="mt-4 px-6 py-2 bg-orange-1 hover:bg-orange-600 text-white font-medium rounded-full transition-colors"
            >
              Explore Community
            </button>
          }
        />
      )}
    </div>
  );
};

export default NotificationPage;
