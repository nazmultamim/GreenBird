import LeftSidebar from "../../../../components/layout/LeftSidebar";
import RightSidebar from "../../../../components/layout/RightSidebar";
import MobileTopNav from "../../../../components/layout/mobile/MobileTopNav";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { notFound } from "next/navigation";

import { connect } from "../../../../lib/mongodb/mongoes";
import { getCurrentDbUser } from "../../../../lib/auth/current-user";
import User from "../../../../lib/models/user.model";
import Post from "../../../../lib/models/post.model";
import { serializePost } from "../../../../lib/posts/serialize-post";
import PostCard from "../../../../components/feed/PostCard";
import ProfileHeader from "../../../../components/profile/ProfileHeader";

export async function generateMetadata({ params }) {
  const { username } = await params;

  return {
    title: `${username} Profile`,
    description: `${username}- Profile`,
    openGraph: {
      title: `${username} | Profile Green Bird`,
      description: `${username}- Profile`,
      images: [`/api/og?username=${username}`],
    },
  };
}

export default async function ProfilePage({ params }) {
  const { username } = await params;

  await connect();

  const currentUser = await getCurrentDbUser().catch(() => null);
  const user = await User.findOne({ username: username.toLowerCase() }).lean();

  if (!user) {
    notFound();
  }

  const posts = await Post.find({ username: username.toLowerCase() })
    .populate("user", "verificationBadge")
    .sort({ createdAt: -1 });

  const serializedPosts = posts.map((p) => serializePost(p, currentUser?._id));
  const postCount = serializedPosts.length;
  const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
  const isCurrentUser = Boolean(currentUser?._id?.toString() === user._id?.toString());
  const isFollowing = Boolean(
    currentUser?.following?.some((id) => id.toString() === user._id?.toString())
  );

  // Build a plain object with only serializable fields for client components
  const profileUser = {
    username: String(user.username),
    avatar: String(user.avatar || ""),
    banner: String(user.banner || ""),
    bio: String(user.bio || ""),
    verificationBadge: Boolean(user.verificationBadge),
    followersCount: Number(user.followers?.length ?? 0),
    followingCount: Number(user.following?.length ?? 0),
    firstName: String(user.firstName || ""),
    lastName: String(user.lastName || ""),
    joinedAt: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      : null,
  };

  return (
    <div className="min-h-screen text-foreground">
      <MobileTopNav />

      <div className="mx-auto flex max-w-[1420px] justify-center">
        <LeftSidebar />

        <main className="min-h-screen w-full max-w-[680px] border-x emerald-divider bg-[#02120e]/70 pt-14 shadow-[0_0_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:pt-0">
          <ProfileHeader
            user={profileUser}
            displayName={displayName}
            postCount={postCount}
            isFollowing={isFollowing}
            isCurrentUser={isCurrentUser}
          />

          {/* Posts list */}
          <div className="mt-3 space-y-3 px-4">
            {serializedPosts.length === 0 ? (
              <div className="p-6 text-center text-emerald-100/60">No posts yet.</div>
            ) : (
              serializedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}