"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PostCard from "../feed/PostCard";
import FollowButton from "../profile/FollowButton";
import {
  Search,
  Sparkles,
  UsersRound,
  Newspaper,
  ArrowUpRight,
  Check,
  Flame,
} from "lucide-react";
import { MdVerified } from "react-icons/md";
import BackButton from "../ui/BackBtn";

const tabs = [
  { id: "posts", label: "Posts", icon: Newspaper },
  { id: "people", label: "People", icon: UsersRound },
];



function SearchChip({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:border-emerald-300/30 hover:bg-emerald-300/10 hover:text-white"
    >
      {label}
    </button>
  );
}

function PersonCard({ person }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(2,20,16,0.88))] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.18)] transition hover:border-emerald-300/25 hover:shadow-[0_24px_90px_rgba(4,120,87,0.18)]">
      <div className="flex items-start gap-4">
        <Link href={`/user/${person.username}`} className="shrink-0">
          <img
            src={person.avatar}
            alt={person.displayName}
            className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/10 transition group-hover:ring-emerald-300/30"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/user/${person.username}`}
              className="truncate text-base font-semibold text-white transition hover:text-emerald-200"
            >
              {person.displayName}
            </Link>
            {person.verificationBadge && (
              <span className="inline-flex text-emerald-300" title="Verified account">
                <MdVerified size={18} />
              </span>
            )}
          </div>
          <p className="truncate text-sm text-white/50">@{person.username}</p>
          {person.bio ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/70">
              {person.bio}
            </p>
          ) : (
            <p className="mt-2 text-sm leading-6 text-white/50">
              A creator worth discovering.
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/50">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {person.followersCount.toLocaleString()} followers
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {person.followingCount.toLocaleString()} following
            </span>
          </div>
        </div>

        <div className="shrink-0">
          {person.isCurrentUser ? (
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/60">
              You
            </div>
          ) : (
            <FollowButton
              username={person.username}
              initialFollowing={person.isFollowing}
              initialCount={person.followersCount}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchResults({ initialQuery = "" }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(Boolean(initialQuery));
  const [error, setError] = useState("");
  const [results, setResults] = useState({
    posts: [],
    people: [],
    counts: { posts: 0, people: 0 },
  });

  useEffect(() => {
    const nextQuery = String(initialQuery || "").trim();
    setQuery(nextQuery);

    if (!nextQuery) {
      setResults({ posts: [], people: [], counts: { posts: 0, people: 0 } });
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    const loadResults = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(nextQuery)}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Search failed");
        }

        setResults({
          posts: data.posts || [],
          people: data.people || [],
          counts: data.counts || { posts: 0, people: 0 },
        });

        if ((data.posts || []).length > 0) {
          setActiveTab("posts");
        } else if ((data.people || []).length > 0) {
          setActiveTab("people");
        }
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Could not load search results");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadResults();

    return () => controller.abort();
  }, [initialQuery]);

  const submitSearch = (event) => {
    event.preventDefault();

    const nextQuery = query.trim();
    if (!nextQuery) return;

    router.push(`/search/${encodeURIComponent(nextQuery)}`);
  };

  const renderedPosts = results.posts;
  const renderedPeople = results.people;

  return (
    <div className="space-y-4 p-4 sm:p-5">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.28),transparent_35%),linear-gradient(135deg,rgba(2,10,8,0.96),rgba(3,23,18,0.82))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.22)]">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-12 top-0 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute right-0 top-12 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <BackButton />
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/80">
              <Sparkles className="h-3.5 w-3.5" />
              Discovery
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
              <Flame className="h-3.5 w-3.5 text-emerald-300" />
              Search people, posts, and profiles
            </span>
          </div>

          <form onSubmit={submitSearch} className="relative max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search creators, topics, or keywords"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-12 py-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-emerald-300/35 focus:bg-black/45 focus:ring-2 focus:ring-emerald-300/15"
            />
          </form>
        </div>
      </section>

      {query ? (
        <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(1,10,8,0.72))] shadow-[0_24px_100px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/40">Results for</p>
              <h2 className="mt-1 text-lg font-semibold text-white">{query}</h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
                {results.counts.posts} posts
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
                {results.counts.people} people
              </span>
            </div>
          </div>

          <div className="border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="inline-flex rounded-full border border-white/10 bg-black/25 p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-emerald-300 text-[#00130f]"
                        : "text-white/65 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="grid gap-4">
                <div className="h-36 animate-pulse rounded-3xl bg-white/5" />
                <div className="h-36 animate-pulse rounded-3xl bg-white/5" />
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-100">
                {error}
              </div>
            ) : activeTab === "posts" ? (
              renderedPosts.length > 0 ? (
                <div className="space-y-4">
                  {renderedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
                  <p className="text-lg font-semibold text-white">No posts matched this search.</p>
                  <p className="mt-2 text-sm text-white/55">
                    Try a broader keyword or switch to the People tab.
                  </p>
                </div>
              )
            ) : renderedPeople.length > 0 ? (
              <div className="space-y-4">
                {renderedPeople.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
                <p className="text-lg font-semibold text-white">No people matched this search.</p>
                <p className="mt-2 text-sm text-white/55">
                  Try a username, a full name, or a topic they mention in their bio.
                </p>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-white/40">
              <ArrowUpRight className="h-4 w-4 text-emerald-300" />
              Quick start
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-white">Search by topic, name, or handle.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
              Use the top search bar to jump directly into a result set. Search pages share the same polished experience from the sidebar explore route and the dedicated search URLs.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/35">Posts</p>
                <p className="mt-2 text-sm text-white/70">Surface the latest discussions, creators, and ideas.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/35">People</p>
                <p className="mt-2 text-sm text-white/70">Find profiles with matching names, handles, or bios.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-white/40">Suggestions</p>
            <div className="mt-4 space-y-3">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => router.push(`/search/${encodeURIComponent(prompt)}`)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left transition hover:border-emerald-300/25 hover:bg-emerald-300/8"
                >
                  <span className="text-sm font-medium text-white/80">#{prompt}</span>
                  <Check className="h-4 w-4 text-emerald-300" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
