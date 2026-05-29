import { NextResponse } from "next/server";
import { connect } from "../../../../../lib/mongodb/mongoes";
import Post from "../../../../../lib/models/post.model";

export async function POST(_request, { params }) {
  await connect();

  const { id } = await params;
  const post = await Post.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).select("views");

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ views: post.views });
}
