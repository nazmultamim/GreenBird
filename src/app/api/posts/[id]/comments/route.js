import { NextResponse } from "next/server";
import { getCurrentDbUser } from "../../../../../lib/auth/current-user";
import { connect } from "../../../../../lib/mongodb/mongoes";
import Post from "../../../../../lib/models/post.model";

export async function POST(request, { params }) {
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

  const body = await request.json();
  const comment = String(body.comment || "").trim();

  if (!comment) {
    return NextResponse.json({ error: "Comment is required" }, { status: 400 });
  }

  post.comments.push({
    comment,
    user: currentUser._id,
    name:
      [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") ||
      currentUser.username,
    username: currentUser.username,
    profileImg: currentUser.avatar,
  });

  await post.save();

  const savedComment = post.comments[post.comments.length - 1];

  return NextResponse.json(
    {
      comment: {
        id: savedComment._id.toString(),
        comment: savedComment.comment,
        name: savedComment.name,
        username: savedComment.username,
        profileImg: savedComment.profileImg || "/default-avatar.png",
        createdAt: savedComment.createdAt,
      },
      replies: post.comments.length,
    },
    { status: 201 }
  );
}
