"use client";

import { useState } from "react";

export default function FollowButton({ username, initialFollowing = false, initialCount = 0 }) {
  const [following, setFollowing] = useState(Boolean(initialFollowing));
  const [count, setCount] = useState(Number(initialCount));
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${username}/follow`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setFollowing(Boolean(data.followed));
      setCount(Number(data.followersCount ?? count));
      try {
        const meRes = await fetch("/api/users/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          const followingCount = Number(meData.user?.following?.length ?? 0);
          const followersCount = Number(data.followersCount ?? 0);
          window.dispatchEvent(new CustomEvent("user-counts-updated", { detail: { followersCount, followingCount } }));
        }
      } catch (e) {
        console.error("Error fetching /api/users/me after follow toggle", e);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-3 py-1 text-sm font-semibold transition ${following ? "bg-emerald-400/10 text-emerald-100" : "bg-white/10 text-white"}`}
    >
      {following ? `Following ${count}` : `Follow ${count}`}
    </button>
  );
}
