function formatRelativeTime(value) {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "now";
  }

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 30) return "now";
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

export function serializePost(post, currentUserId) {
  const userId = post.user?._id?.toString?.() || post.user?.toString?.();
  const currentId = currentUserId?.toString?.();
  const likedByCurrentUser = currentId
    ? post.likes?.some((like) => like.toString() === currentId)
    : false;

  return {
    id: post._id.toString(),
    text: post.text || "",
    media: (post.media || []).map((item) => ({
      url: item.url,
      publicId: item.publicId,
      type: item.type,
      width: item.width,
      height: item.height,
    })),
    name: post.name,
    handle: `@${post.username}`,
    username: post.username,
    avatar: post.profileImg || "/default-avatar.png",
    verificationBadge:
      Boolean(post.verificationBadge) || Boolean(post.user?.verificationBadge),
    userId,
    isOwner: Boolean(currentId && userId === currentId),
    liked: likedByCurrentUser,
    replies: post.comments?.length || 0,
    retweets: 0,
    likes: post.likes?.length || 0,
    views: post.views || 0,
    comments: (post.comments || []).map((comment) => ({
      id: comment._id.toString(),
      comment: comment.comment,
      name: comment.name,
      username: comment.username,
      profileImg: comment.profileImg || "/default-avatar.png",
      createdAt: comment.createdAt?.toISOString?.() || comment.createdAt,
    })),
    createdAt: post.createdAt?.toISOString?.() || post.createdAt,
    time: formatRelativeTime(post.createdAt),
  };
}
