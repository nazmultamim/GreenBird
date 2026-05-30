import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LeftSidebar from "../../../../components/layout/LeftSidebar";
import RightSidebar from "../../../../components/layout/RightSidebar";
import MobileTopNav from "../../../../components/layout/mobile/MobileTopNav";
import PostCard from "../../../../components/feed/PostCard";
import { getCurrentDbUser } from "../../../../lib/auth/current-user";
import { connect } from "../../../../lib/mongodb/mongoes";
import Post from "../../../../lib/models/post.model";
import { serializePost } from "../../../../lib/posts/serialize-post";

export async function generateMetadata({ params }) {
  const { id } = params;
  await connect();

  const post = await Post.findById(id).select("text name username media").lean();

  if (!post) {
    return {
      title: "Post not found | Green Bird",
      description: "The requested post could not be found.",
    };
  }

  const title = post.text
    ? `${post.text.slice(0, 60)} | Green Bird`
    : `${post.name}'s post on Green Bird`;
  const description = post.text
    ? post.text.slice(0, 160)
    : `Read ${post.name}'s latest post on Green Bird.`;
  const imageUrl = post.media?.[0]?.url || "https://green-bird-xi.vercel.app/og-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://green-bird-xi.vercel.app/posts/${id}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function PostPage({ params }) {
  const { id } = await params;

  await connect();

  const currentUser = await getCurrentDbUser().catch(() => null);
  const post = await Post.findById(id).populate("user", "verificationBadge");

  return (
    <div className="app-shell min-h-screen text-foreground dark">
      <MobileTopNav />

      <div className="mx-auto flex max-w-[1420px] justify-center">
        <LeftSidebar />

        <main className="min-h-screen w-full max-w-[680px] border-x emerald-divider bg-[#02120e]/70 pt-14 shadow-[0_0_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:pt-0">
          <div className="sticky top-0 z-10 flex items-center gap-3 border-b emerald-divider bg-[rgba(2,18,14,0.86)] px-4 py-3 backdrop-blur-xl">
            <Link
              href="/"
              className="rounded-full p-2 text-emerald-100/70 transition hover:bg-emerald-300/10 hover:text-emerald-100"
              aria-label="Back to feed"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">Post</h1>
              <p className="text-xs text-emerald-100/45">Shared from Green Bird</p>
            </div>
          </div>

          {post ? (
            <PostCard post={serializePost(post, currentUser?._id)} />
          ) : (
            <div className="px-4 py-10">
              <p className="text-sm font-semibold text-white">Post not found</p>
              <p className="mt-1 text-sm text-emerald-100/50">
                The link may be broken or the post may have been deleted.
              </p>
            </div>
          )}
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
