"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CreatePost from "../../../components/feed/CreatePost";

export default function CreatePostPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen text-white flex flex-col">

      {/* ── TOP NAV ── */}
      <div className="
        sticky top-0 z-10
        flex items-center justify-between
        border-b border-white/10
        px-4 py-3 
      ">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Right — Drafts + Post */}
        <div className=" items-center gap-3">
          <button className="text-sm font-semibold text-emerald-500  transition-colors">
            Drafts
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 overflow-y-auto">
        <CreatePost />
      </div>

    </div>
  );
}