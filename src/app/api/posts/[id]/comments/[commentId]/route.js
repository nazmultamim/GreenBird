import { NextResponse } from "next/server";
import { getCurrentDbUser } from "../../../../../../lib/auth/current-user";
import { connect } from "../../../../../../lib/mongodb/mongoes";
import Post from "../../../../../../lib/models/post.model";

export async function DELETE(_request, { params }) {
  const currentUser = await getCurrentDbUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connect();

  const { id, commentId } = await params;
  const post = await Post.findById(id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const comment = post.comments.id(commentId);

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  const currentUserId = currentUser._id.toString();
  const postOwnerId = post.user?.toString?.();
  const commentAuthorId = comment.user?.toString?.();
  const canDeleteComment =
    currentUserId === postOwnerId || currentUserId === commentAuthorId;

  if (!canDeleteComment) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  comment.deleteOne();
  await post.save();

  return NextResponse.json({ ok: true, replies: post.comments.length });
}
