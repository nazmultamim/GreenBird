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
