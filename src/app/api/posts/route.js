import { NextResponse } from "next/server";
import { getCurrentDbUser } from "../../../lib/auth/current-user";
import { connect } from "../../../lib/mongodb/mongoes";
import Post from "../../../lib/models/post.model";
import { serializePost } from "../../../lib/posts/serialize-post";

export async function GET() {
  await connect();

  const currentUser = await getCurrentDbUser().catch(() => null);
  const posts = await Post.find({})
    .populate("user", "verificationBadge")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean(false);

  return NextResponse.json({
    posts: posts.map((post) => serializePost(post, currentUser?._id)),
  });
}

export async function POST(request) {
  const currentUser = await getCurrentDbUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const text = String(body.text || "").trim();
  const media = Array.isArray(body.media) ? body.media.slice(0, 4) : [];

  const post = await Post.create({
    text,
    media: media.map((item) => ({
      url: item.url,
      publicId: item.publicId,
      type: item.type === "video" ? "video" : "image",
      width: item.width,
      height: item.height,
    })),
    user: currentUser._id,
    name:
      [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") ||
      currentUser.username,
    username: currentUser.username,
    profileImg: currentUser.avatar,
    verificationBadge: currentUser.verificationBadge,
  });

  return NextResponse.json(
    { post: serializePost(post, currentUser._id) },
    { status: 201 }
  );
}
