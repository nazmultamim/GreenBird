import { NextResponse } from "next/server";
import { getCurrentDbUser } from "../../../../../lib/auth/current-user";
import { connect } from "../../../../../lib/mongodb/mongoes";
import Post from "../../../../../lib/models/post.model";
import { createNotification } from "../../../../../lib/notifications/notification-service";

export async function POST(_request, { params }) {
  const currentUser = await getCurrentDbUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connect();

  const { id } = await params;
  const post = await Post.findById(id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const userId = currentUser._id.toString();
  const hasLiked = post.likes.some((like) => like.toString() === userId);

  if (hasLiked) {
    post.likes.pull(currentUser._id);
  } else {
    post.likes.addToSet(currentUser._id);
  }

  await post.save();

  if (!hasLiked && post.user?.toString?.() !== currentUser._id.toString()) {
    await createNotification({
      recipientId: post.user,
      actorId: currentUser._id,
      type: "like",
      postId: post._id,
      actorName:
        [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") ||
        currentUser.username,
    });
  }

  return NextResponse.json({
    liked: !hasLiked,
    likes: post.likes.length,
  });
}
