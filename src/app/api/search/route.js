import { NextResponse } from "next/server";
import { connect } from "../../../lib/mongodb/mongoes";
import { getCurrentDbUser } from "../../../lib/auth/current-user";
import Post from "../../../lib/models/post.model";
import User from "../../../lib/models/user.model";
import { serializePost } from "../../../lib/posts/serialize-post";

export const runtime = "nodejs";

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serializePerson(user, currentUser) {
  const userId = user._id?.toString?.();
  const currentId = currentUser?._id?.toString?.();
  const followingSet = new Set(
    (currentUser?.following || []).map((id) => id.toString())
  );

  return {
    id: userId,
    username: String(user.username || ""),
    displayName:
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      user.username ||
      "User",
    avatar: user.avatar || "/default-avatar.png",
    bio: user.bio || "",
    verificationBadge: Boolean(user.verificationBadge),
    followersCount: Number(user.followers?.length ?? 0),
    followingCount: Number(user.following?.length ?? 0),
    isCurrentUser: Boolean(currentId && userId === currentId),
    isFollowing: Boolean(userId && followingSet.has(userId)),
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = String(searchParams.get("q") || "").trim();

  if (!query) {
    return NextResponse.json({
      query: "",
      posts: [],
      people: [],
      counts: { posts: 0, people: 0 },
    });
  }

  await connect();

  const currentUser = await getCurrentDbUser().catch(() => null);
  const pattern = new RegExp(escapeRegex(query), "i");

  const [postMatches, peopleMatches] = await Promise.all([
    Post.find({
      $or: [
        { text: pattern },
        { name: pattern },
        { username: pattern },
      ],
    })
      .populate("user", "verificationBadge")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(false),
    User.find({
      $or: [
        { username: pattern },
        { firstName: pattern },
        { lastName: pattern },
        { bio: pattern },
      ],
    })
      .select(
        "username firstName lastName avatar bio followers following verificationBadge createdAt"
      )
      .sort({ followers: -1, createdAt: -1 })
      .limit(20)
      .lean(),
  ]);

  return NextResponse.json({
    query,
    posts: postMatches.map((post) => serializePost(post, currentUser?._id)),
    people: peopleMatches.map((user) => serializePerson(user, currentUser)),
    counts: {
      posts: postMatches.length,
      people: peopleMatches.length,
    },
  });
}
