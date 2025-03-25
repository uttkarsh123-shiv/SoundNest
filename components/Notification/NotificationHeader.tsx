import React from "react";
import { Check, RefreshCw, Trash2 } from "lucide-react";
import TabSelector from "./TabSelector";
import { NotificationTab } from "@/types/notification";

interface NotificationHeaderProps {
  hasNotifications: boolean;
  unreadCount: number;
  readCount: number;
  activeTab: NotificationTab;
  setActiveTab: (tab: NotificationTab) => void;
  onClearAll: () => void;
  onMarkAllAsRead: () => void;
  onMarkAllAsUnread: () => void;
}

const NotificationHeader = ({
  hasNotifications,
  unreadCount,
  readCount,
  activeTab,
  setActiveTab,
  onClearAll,
  onMarkAllAsRead,
  onMarkAllAsUnread,
}: NotificationHeaderProps) => (
  <div className="flex items-center justify-between mb-8">
    <h1 className="text-3xl font-bold text-white-1">Notifications</h1>
    <div className="flex items-center gap-4">
      {hasNotifications && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 text-sm text-white-2 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
          Clear all
        </button>
      )}
      {unreadCount > 0 && (
        <button
          onClick={onMarkAllAsRead}
          className="flex items-center gap-1 text-sm text-white-2 hover:text-orange-1 transition-colors"
        >
          <Check size={16} />
          Mark all as read
        </button>
      )}
      {readCount > 0 && (
        <button
          onClick={onMarkAllAsUnread}
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
);

export default NotificationHeader;