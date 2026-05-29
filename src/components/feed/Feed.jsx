"use client";
import { useEffect, useState } from "react";
import TopNav from "./TopNav";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";

import { useUser } from "@clerk/nextjs";


export default function Feed() {
  const [activeTab, setActiveTab] = useState("For you");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();

        if (isMounted && response.ok) {
          setPosts(data.posts || []);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNewPost = async ({ text, media = [] }) => {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, media }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Post could not be saved.");
    }

    setPosts((prev) => [data.post, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  return (
    <main className="min-h-screen w-full shrink-0 text-white pt-14 sm:pt-0 lg:max-w-[720px]">
      <div className="mx-auto min-h-screen w-full max-w-[720px] border-x emerald-divider bg-[#02120e]/70 shadow-[0_0_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
        {user && (
          <CreatePost onPost={handleNewPost} />
        )}
        <div className="space-y-3 px-3 py-3 sm:px-4">
          {isLoading && (
            <div className="emerald-panel rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-emerald-300/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-36 rounded-full bg-emerald-300/12" />
                  <div className="h-3 w-24 rounded-full bg-emerald-300/8" />
                </div>
              </div>
              <div className="mt-4 h-56 rounded-xl bg-emerald-300/8" />
            </div>
          )}
          {!isLoading && posts.length === 0 && (
            <p className="emerald-panel rounded-xl px-4 py-6 text-sm text-emerald-100/50">
              No posts yet. Create the first one.
            </p>
          )}
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDeleted={handlePostDeleted}
              onUpdated={handlePostUpdated}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
