import React from "react";
import { NotificationTab } from "@/types/notification";

interface TabSelectorProps {
  activeTab: NotificationTab;
  setActiveTab: (tab: NotificationTab) => void;
  unreadCount: number;
}

const TabSelector = ({ activeTab, setActiveTab, unreadCount }: TabSelectorProps) => (
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
);

export default TabSelector;