import { NextResponse } from "next/server";
import { getCurrentDbUser } from "../../../../lib/auth/current-user";
import { connect } from "../../../../lib/mongodb/mongoes";
import { destroyCloudinaryAsset } from "../../../../lib/cloudinary";
import Post from "../../../../lib/models/post.model";
import { serializePost } from "../../../../lib/posts/serialize-post";

function isOwner(post, user) {
  return post.user.toString() === user?._id?.toString();
}

export async function PATCH(request, { params }) {
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

  if (!isOwner(post, currentUser)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const nextMedia = Array.isArray(body.media) ? body.media.slice(0, 4) : post.media;
  const nextPublicIds = new Set(nextMedia.map((item) => item.publicId));

  await Promise.all(
    post.media
      .filter((item) => !nextPublicIds.has(item.publicId))
      .map((item) => destroyCloudinaryAsset(item.publicId, item.type))
  );

  post.text = String(body.text || "").trim();
  post.media = nextMedia.map((item) => ({
    url: item.url,
    publicId: item.publicId,
    type: item.type === "video" ? "video" : "image",
    width: item.width,
    height: item.height,
  }));

  await post.save();
  await post.populate("user", "verificationBadge");

  return NextResponse.json({ post: serializePost(post, currentUser._id) });
}

export async function DELETE(_request, { params }) {
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

  if (!isOwner(post, currentUser)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await Promise.all(
    post.media.map((item) => destroyCloudinaryAsset(item.publicId, item.type))
  );
  await post.deleteOne();

  return NextResponse.json({ ok: true });
}
