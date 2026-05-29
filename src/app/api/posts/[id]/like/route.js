import { NextResponse } from "next/server";
import { getCurrentDbUser } from "../../../../../lib/auth/current-user";
import { connect } from "../../../../../lib/mongodb/mongoes";
import Post from "../../../../../lib/models/post.model";

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

  return NextResponse.json({
    liked: !hasLiked,
    likes: post.likes.length,
  });
}
