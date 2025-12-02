import { useState } from "react";
import { Notification } from "../data/mockNotifications";
import { Bell, X, AlertCircle, TrendingUp, User, Settings } from "lucide-react";

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function NotificationPanel({ notifications, onMarkAsRead, onDismiss }: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "model":
        return <TrendingUp className="w-4 h-4" />;
      case "student":
        return <User className="w-4 h-4" />;
      case "alert":
        return <AlertCircle className="w-4 h-4" />;
      case "system":
        return <Settings className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-[#eb5757] text-white";
      case "medium":
        return "bg-[#f2994a] text-white";
      case "low":
        return "bg-[#27ae60] text-white";
      default:
        return "bg-[#495d72] text-white";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "model":
        return "bg-[#4c85e9] text-white";
      case "student":
        return "bg-[#9b51e0] text-white";
      case "alert":
        return "bg-[#eb5757] text-white";
      case "system":
        return "bg-[#495d72] text-white";
      default:
        return "bg-[#0c1e33] text-white";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const displayedNotifications = notifications.slice(0, 5);

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-full transition-colors"
      >
        <Bell className="w-5 h-5 text-[#0c1e33]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#eb5757] text-white text-[10px] font-['Poppins:Bold',sans-serif] rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 top-[calc(100%+8px)] w-[420px] bg-white rounded-lg shadow-2xl border border-[#e5e5e5] z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-[#0c1e33] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-white" />
                <h3 className="font-['Poppins:SemiBold',sans-serif] text-white text-[16px]">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-[#eb5757] text-white text-[11px] font-['Poppins:Bold',sans-serif] px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-[#f2994a] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] overflow-y-auto">
              {displayedNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-[#cbd5e0]" />
                  <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[14px]">
                    No notifications
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[#a0aec0] text-[12px] mt-1">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                displayedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b border-[#e5e5e5] p-4 hover:bg-[#f9fafb] transition-colors cursor-pointer ${
                      !notification.isRead ? "bg-[#f0f7ff]" : ""
                    }`}
                    onClick={() => {
                      if (!notification.isRead) {
                        onMarkAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`${getTypeColor(notification.type)} p-2 rounded-lg shrink-0`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[13px] leading-tight">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-[#4c85e9] rounded-full shrink-0 mt-1" />
                          )}
                        </div>
                        
                        <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px] leading-relaxed mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`${getPriorityColor(notification.priority)} text-[10px] font-['Poppins:Medium',sans-serif] px-2 py-0.5 rounded uppercase`}>
                              {notification.priority}
                            </span>
                            {notification.relatedTo && (
                              <span className="text-[#a0aec0] text-[11px] font-['Poppins:Regular',sans-serif]">
                                • {notification.relatedTo}
                              </span>
                            )}
                          </div>
                          <span className="text-[#a0aec0] text-[11px] font-['Poppins:Regular',sans-serif]">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Dismiss Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDismiss(notification.id);
                        }}
                        className="text-[#a0aec0] hover:text-[#eb5757] transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {displayedNotifications.length > 0 && (
              <div className="bg-[#f9fafb] px-4 py-3 border-t border-[#e5e5e5]">
                <button className="w-full text-center font-['Poppins:Medium',sans-serif] text-[#4c85e9] text-[13px] hover:text-[#3a6bc7] transition-colors">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
