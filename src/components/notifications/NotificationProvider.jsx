"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const NotificationContext = createContext(null);
const REFRESH_EVENT = "greenbird:notifications:refresh";

export function triggerNotificationRefresh() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(REFRESH_EVENT));
  }
}

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchNotifications = async ({ silent = false } = {}) => {
    if (!silent) {
      setRefreshing(true);
    }

    setError("");

    try {
      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load notifications");
      }

      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setUnreadCount(Number(data.unreadCount || 0));
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchNotifications({ silent: true });
      }
    }, 10000);

    const handleFocus = () => fetchNotifications({ silent: true });
    const handleRefreshEvent = () => fetchNotifications({ silent: true });

    window.addEventListener("focus", handleFocus);
    window.addEventListener(REFRESH_EVENT, handleRefreshEvent);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener(REFRESH_EVENT, handleRefreshEvent);
    };
  }, []);

  const markAllRead = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to update notifications");
      }

      setUnreadCount(0);
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, read: true }))
      );
    } catch (markError) {
      setError(markError.message || "Unable to update notifications");
    }
  };

  const value = useMemo(
    () => ({
      unreadCount,
      notifications,
      loading,
      refreshing,
      error,
      refreshNotifications: () => fetchNotifications(),
      markAllRead,
      setNotifications,
      setUnreadCount,
    }),
    [unreadCount, notifications, loading, refreshing, error]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }

  return context;
}
