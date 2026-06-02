"use client";

import Link from "next/link";
import {
  Bell,
  CheckCheck,
  UserPlus,
  Sparkles,
  MessageSquare,
  Heart,
  RefreshCcw,
} from "lucide-react";
import { useNotifications } from "./NotificationProvider";
import BackButton from "../ui/BackBtn";

function NotificationAvatar({ actor }) {
  return (
    <img
      src={actor?.avatar || "/default-avatar.png"}
      alt={actor?.displayName || "User"}
      className="h-12 w-12 rounded-2xl object-cover ring-1 ring-white/10"
    />
  );
}

function getIcon(type) {
  if (type === "follow") return UserPlus;
  if (type === "post") return Sparkles;
  if (type === "like") return Heart;
  return MessageSquare;
}

export default function NotificationCenter() {
  const {
    loading,
    error,
    refreshing,
    unreadCount,
    notifications,
    refreshNotifications,
    markAllRead,
  } = useNotifications();

  return (
    <div className="space-y-4 p-4 sm:p-5">
      <section className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.24),transparent_35%),linear-gradient(135deg,rgba(2,10,8,0.96),rgba(3,23,18,0.82))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.22)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BackButton />
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/80">
              <Bell className="h-3.5 w-3.5" />
              Notifications
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-right text-nowrap">
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">Unread <span className="font-bold text-white">{unreadCount}</span></p>
            </div>
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-300/25 hover:bg-emerald-300/10"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(1,10,8,0.72))] shadow-[0_24px_100px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">Inbox</p>
            <h2 className="mt-1 text-lg font-semibold text-white">
              Latest activity
            </h2>
          </div>

          <button
            type="button"
            onClick={refreshNotifications}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-sm text-white/70 transition hover:border-emerald-300/25 hover:text-white"
          >
            <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="space-y-3">
              <div className="h-24 animate-pulse rounded-3xl bg-white/5" />
              <div className="h-24 animate-pulse rounded-3xl bg-white/5" />
              <div className="h-24 animate-pulse rounded-3xl bg-white/5" />
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-100">
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
              <p className="text-lg font-semibold text-white">No notifications yet.</p>
              <p className="mt-2 text-sm text-white/55">
                New follows and posts from people you follow will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={`group rounded-3xl border p-4 transition ${
                      notification.read
                        ? "border-white/10 bg-white/[0.03]"
                        : "border-emerald-300/20 bg-emerald-300/8"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <NotificationAvatar actor={notification.actor} />
                        <span className="absolute -bottom-1 -right-1 rounded-full border border-black/40 bg-emerald-300 p-1 text-[#00130f]">
                          <Icon className="h-3 w-3" />
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {notification.actor?.username ? (
                            <Link
                              href={`/user/${notification.actor.username}`}
                              className="font-semibold text-white transition hover:text-emerald-200"
                            >
                              {notification.actor.displayName || "Someone"}
                            </Link>
                          ) : (
                            <span className="font-semibold text-white">
                              {notification.actor?.displayName || "Someone"}
                            </span>
                          )}
                          <span className="text-xs uppercase tracking-[0.24em] text-white/35">
                            {notification.type}
                          </span>
                        </div>

                        <p className="mt-1 text-sm leading-6 text-white/70">
                          {notification.message}
                        </p>

                        {notification.post?.id && (
                          <Link
                            href={`/posts/${notification.post.id}`}
                            className="mt-3 inline-flex rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-white/65 transition hover:border-emerald-300/25 hover:text-white"
                          >
                            View post
                          </Link>
                        )}
                      </div>

                      {!notification.read && (
                        <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
