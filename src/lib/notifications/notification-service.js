import { connect } from "../mongodb/mongoes";
import Notification from "../models/notification.model";

function toIdString(value) {
  return value?.toString?.() || String(value || "");
}

function buildNotificationMessage(type, actorName) {
  if (type === "follow") {
    return `${actorName} started following you.`;
  }

  if (type === "post") {
    return `${actorName} shared a new post.`;
  }

  if (type === "like") {
    return `${actorName} liked your post.`;
  }

  if (type === "comment") {
    return `${actorName} commented on your post.`;
  }

  return `${actorName} sent you an update.`;
}

async function emitNotification(eventName, payload) {
  const socketServer = globalThis.__greenbirdSocketServer;

  if (socketServer?.emit) {
    socketServer.emit(eventName, payload);
  }
}

export async function createNotification({
  recipientId,
  actorId,
  type,
  actorName,
  postId = null,
  message,
}) {
  const recipient = toIdString(recipientId);
  const actor = toIdString(actorId);

  if (!recipient || !actor || recipient === actor) {
    return null;
  }

  await connect();

  const notification = await Notification.create({
    recipient,
    actor,
    type,
    post: postId || null,
    message: message || buildNotificationMessage(type, actorName || "Someone"),
  });

  await emitNotification("notification:new", {
    id: notification._id.toString(),
    recipient,
    actor,
    type,
    post: notification.post?.toString?.() || null,
    message: notification.message,
    createdAt: notification.createdAt,
  });

  return notification;
}

export async function createManyNotifications(entries = []) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return [];
  }

  await connect();

  const docs = entries
    .map((entry) => {
      const recipientId = toIdString(entry.recipientId);
      const actorId = toIdString(entry.actorId);

      if (!recipientId || !actorId || recipientId === actorId) {
        return null;
      }

      return {
        recipient: recipientId,
        actor: actorId,
        type: entry.type,
        post: entry.postId || null,
        message: entry.message || buildNotificationMessage(entry.type, entry.actorName || "Someone"),
      };
    })
    .filter(Boolean);

  if (docs.length === 0) {
    return [];
  }

  const created = await Notification.insertMany(docs, { ordered: false });

  for (const notification of created) {
    await emitNotification("notification:new", {
      id: notification._id.toString(),
      recipient: notification.recipient?.toString?.() || notification.recipient,
      actor: notification.actor?.toString?.() || notification.actor,
      type: notification.type,
      post: notification.post?.toString?.() || null,
      message: notification.message,
      createdAt: notification.createdAt,
    });
  }

  return created;
}

export async function markNotificationsRead(recipientId) {
  await connect();

  return Notification.updateMany(
    { recipient: recipientId, read: false },
    { $set: { read: true, readAt: new Date() } }
  );
}
