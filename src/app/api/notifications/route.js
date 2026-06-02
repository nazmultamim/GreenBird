import { NextResponse } from "next/server";
import { getCurrentDbUser } from "../../../lib/auth/current-user";
import { connect } from "../../../lib/mongodb/mongoes";
import Notification from "../../../lib/models/notification.model";
import { markNotificationsRead } from "../../../lib/notifications/notification-service";

export const runtime = "nodejs";

async function serializeNotification(notification) {
  return {
    id: notification._id.toString(),
    type: notification.type,
    message: notification.message,
    read: Boolean(notification.read),
    createdAt: notification.createdAt?.toISOString?.() || notification.createdAt,
    actor: notification.actor
      ? {
          id: notification.actor._id?.toString?.() || notification.actor?.toString?.(),
          username: notification.actor.username,
          displayName:
            [notification.actor.firstName, notification.actor.lastName]
              .filter(Boolean)
              .join(" ")
              .trim() || notification.actor.username,
          avatar: notification.actor.avatar || "/default-avatar.png",
        }
      : null,
    post: notification.post
      ? {
          id: notification.post._id?.toString?.() || notification.post?.toString?.(),
          text: notification.post.text || "",
        }
      : null,
  };
}

export async function GET() {
  const currentUser = await getCurrentDbUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connect();

  const notifications = await Notification.find({
    recipient: currentUser._id,
  })
    .populate("actor", "username firstName lastName avatar")
    .populate("post", "text")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean(false);

  const unreadCount = await Notification.countDocuments({
    recipient: currentUser._id,
    read: false,
  });

  return NextResponse.json({
    notifications: await Promise.all(notifications.map(serializeNotification)),
    unreadCount,
  });
}

export async function PATCH() {
  const currentUser = await getCurrentDbUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await markNotificationsRead(currentUser._id);

  return NextResponse.json({ ok: true });
}
