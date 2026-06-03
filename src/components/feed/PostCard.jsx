"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share,
  MoreHorizontal,
  Trash2,
  Pencil,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";

import { MdVerified } from "react-icons/md";


function formatCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function formatRelativeTime(value) {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "now";
  }

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 30) return "now";
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

function linkifyText(text = "") {
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = urlPattern.exec(text)) !== null) {
    const url = match[0];
    const start = match.index;
    const end = start + url.length;
    const hasProtocol = url.startsWith("http://") || url.startsWith("https://");
    const href = hasProtocol ? url : `https://${url}`;

    parts.push(text.slice(lastIndex, start));
    parts.push(
      <a
        key={`${start}-${href}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-300 underline transition hover:text-emerald-100"
      >
        {url}
      </a>
    );

    lastIndex = end;
  }

  parts.push(text.slice(lastIndex));
  return parts;
}

function CustomVideoPlayer({ src, className = "" }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = (event) => {
    event?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); } else { video.pause(); }
  };

  const toggleMute = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSeek = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video || !duration) return;
    const nextProgress = Number(event.target.value);
    video.currentTime = (nextProgress / 100) * duration;
    setProgress(nextProgress);
  };

  return (
    <div
      className={`group relative flex h-full w-full items-center justify-center bg-black ${className}`}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-contain"
        preload="metadata"
        playsInline
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
        onClick={(event) => { event.stopPropagation(); togglePlay(event); }}
      />

      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-black/85"
          aria-label="Play video"
        >
          <Play size={21} fill="currentColor" />
        </button>
      )}

      <div
        className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-3 pt-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:bg-emerald-100"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>

        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="h-1 min-w-0 flex-1 accent-emerald-300"
          aria-label="Video progress"
        />

        <button
          type="button"
          onClick={toggleMute}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/20"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}

// FIX 1: Standalone MediaPreview component that renders via React Portal
// This escapes the <article overflow-hidden> that was clipping the overlay
function MediaPreview({ visibleMedia, previewIndex, setPreviewIndex }) {
  const previewItem = previewIndex === null ? null : visibleMedia[previewIndex];

  useEffect(() => {
    if (previewIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setPreviewIndex(null);
      if (event.key === "ArrowLeft") {
        setPreviewIndex((i) => (i === null ? i : (i - 1 + visibleMedia.length) % visibleMedia.length));
      }
      if (event.key === "ArrowRight") {
        setPreviewIndex((i) => (i === null ? i : (i + 1) % visibleMedia.length));
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewIndex, visibleMedia.length, setPreviewIndex]);

  if (!previewItem) return null;

  const showPrevious = (event) => {
    event.stopPropagation();
    setPreviewIndex((i) => (i === null ? i : (i - 1 + visibleMedia.length) % visibleMedia.length));
  };

  const showNext = (event) => {
    event.stopPropagation();
    setPreviewIndex((i) => (i === null ? i : (i + 1) % visibleMedia.length));
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 px-3 py-4 backdrop-blur-sm sm:px-8"
      onClick={() => setPreviewIndex(null)}
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
    >
      <button
        type="button"
        onClick={(event) => { event.stopPropagation(); setPreviewIndex(null); }}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Close media preview"
      >
        <X size={22} />
      </button>

      {visibleMedia.length > 1 && (
        <>
          <button
            type="button"
            onClick={showPrevious}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
            aria-label="Previous media"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            type="button"
            onClick={showNext}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
            aria-label="Next media"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <div
        className="flex h-full max-h-[88vh] w-full max-w-4xl items-center justify-center overflow-hidden rounded-md"
        onClick={(event) => event.stopPropagation()}
      >
        {previewItem.type === "video" ? (
          <CustomVideoPlayer
            key={previewItem.url}
            src={previewItem.url}
            className="rounded-md"
          />
        ) : (
          <img
            src={previewItem.url}
            alt="Post media preview"
            className="max-h-[88vh] max-w-full rounded-md object-contain"
          />
        )}
      </div>

      {visibleMedia.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
          {previewIndex + 1} / {visibleMedia.length}
        </div>
      )}
    </div>,
    document.body
  );
}

function PostCard({ post, onDeleted, onUpdated, trackView = false }) {
  const [liked, setLiked] = useState(post.liked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes ?? 0);
  const [retweeted, setRetweeted] = useState(false);
  const [rtCount, setRtCount] = useState(post.retweets ?? 0);
  const [viewCount, setViewCount] = useState(Number(post.views ?? 0));
  const [comments, setComments] = useState(post.comments ?? []);
  const [commentCount, setCommentCount] = useState(post.replies ?? 0);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text || "");
  const [editMedia, setEditMedia] = useState(post.media || []);
  const [error, setError] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [previewIndex, setPreviewIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const menuRef = useRef(null);
  const [timeLabel, setTimeLabel] = useState(
    post.createdAt ? formatRelativeTime(post.createdAt) : post.time || "now"
  );

  useEffect(() => {
    if (!post.createdAt) {
      setTimeLabel(post.time || "now");
      return;
    }

    const updateTime = () => setTimeLabel(formatRelativeTime(post.createdAt));
    updateTime();

    const interval = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(interval);
  }, [post.createdAt, post.time]);

  useEffect(() => {
    setViewCount(Number(post.views ?? 0));
  }, [post.id, post.views]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (!trackView || !post.id) return;

    const controller = new AbortController();

    async function incrementViews() {
      try {
        const response = await fetch(`/api/posts/${post.id}/view`, {
          method: "POST",
          signal: controller.signal,
        });

        if (!response.ok) return;
        const data = await response.json();

        if (typeof data.views === "number") {
          setViewCount(data.views);
        }
      } catch {
        // ignore fetch failures or aborts
      }
    }

    incrementViews();
    return () => controller.abort();
  }, [post.id, trackView]);

  // Cleanup: close preview if index goes out of range after media edit
  useEffect(() => {
    if (previewIndex !== null && previewIndex >= visibleMedia.length) {
      setPreviewIndex(null);
    }
  }, [previewIndex, editMedia]);

  const handleLike = async () => {
    if (!post.id || String(post.id).length !== 24) return;

    const previousLiked = liked;
    const previousCount = likeCount;
    setLiked(!previousLiked);
    setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Like failed.");
      }

      setLiked(data.liked);
      setLikeCount(data.likes);
    } catch (err) {
      setLiked(previousLiked);
      setLikeCount(previousCount);
      setError(err.message || "Like failed.");
    }
  };

  const handleRt = () => {
    setRetweeted((prev) => !prev);
    setRtCount((prev) => (retweeted ? prev - 1 : prev + 1));
  };

  const actions = [
    {
      icon: MessageCircle,
      count: commentCount,
      activeColor: "text-sky-400",
      active: showComments,
      onClick: () => setShowComments((value) => !value),
    },
    {
      icon: Repeat2,
      count: rtCount,
      activeColor: "text-emerald-400",
      active: retweeted,
      onClick: handleRt,
    },
    {
      icon: Heart,
      count: likeCount,
      activeColor: "text-pink-500",
      active: liked,
      onClick: handleLike,
    },
    {
      icon: Share,
      count: null,
      activeColor: "text-emerald-300",
      active: false,
      onClick: handleShare,
    },
  ];

  const media = post.media?.length
    ? post.media
    : post.image
      ? [{ url: post.image, type: "image" }]
      : [];
  const visibleMedia = isEditing ? editMedia : media;
  const mediaGridClass =
    { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-2", 4: "grid-cols-2" }[
    visibleMedia.length
    ] ?? "grid-cols-2";
  const isVerified = Boolean(post.verified || post.verificationBadge);
  const hasSingleMedia = visibleMedia.length === 1;

  const openPreview = (event, index) => {
    event.stopPropagation();
    if (isEditing) return;
    setPreviewIndex(index);
  };

  function getPostUrl() {
    if (typeof window === "undefined") return `/posts/${post.id}`;
    return `${window.location.origin}/posts/${post.id}`;
  }

  async function handleShare(event) {
    event?.stopPropagation?.();

    const url = getPostUrl();
    const shareData = {
      title: `${post.name} on Green Bird`,
      text: post.text || "View this post on Green Bird",
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("Shared");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareStatus("Link copied");
      } else {
        window.prompt("Copy post link", url);
        setShareStatus("Link ready");
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        setShareStatus("Share failed");
      }
    }

    window.setTimeout(() => setShareStatus(""), 1800);
  }

  const handleDelete = async (event) => {
    event.stopPropagation();

    if (!post.isOwner) return;

    const response = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setIsDeleted(true);
      onDeleted?.(post.id);
      return;
    }

    const data = await response.json();
    setError(data?.error || "Post could not be deleted.");
  };

  const handleEdit = async (event) => {
    event.stopPropagation();

    const response = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText, media: editMedia }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data?.error || "Post could not be updated.");
      return;
    }

    onUpdated?.(data.post);
    setIsEditing(false);
  };

  const handleComment = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const comment = commentText.trim();
    if (!comment) return;

    const response = await fetch(`/api/posts/${post.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data?.error || "Comment could not be saved.");
      return;
    }

    setComments((prev) => [...prev, data.comment]);
    setCommentCount(data.replies);
    setCommentText("");
    setShowComments(true);
  };

  if (isDeleted) {
    return null;
  }

  return (
    <>
      <article className="emerald-panel emerald-panel-hover group w-full cursor-pointer overflow-hidden rounded-xl mb-4">
        <div className="px-4 pt-4">
          <div className="flex items-start gap-3">
            <img
              src={post.avatar}
              alt={post.name}
              loading="lazy"
              decoding="async"
              className="h-11 w-11 shrink-0 rounded-full border border-emerald-300/20 bg-emerald-950/60 object-cover shadow-[0_0_20px_rgba(16,185,129,0.1)]"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex min-w-0 flex-wrap items-center gap-1">
                    <Link
                      href={`/user/${post.username || (post.handle?.replace("@", ""))}`}
                      onClick={(e) => e.stopPropagation()}
                      className="truncate text-[15px] font-bold leading-tight text-white hover:underline"
                    >
                      {post.name}
                    </Link>
                    {isVerified && (
                      <span title="Verified account" className="inline-flex text-emerald-200 shrink-0 items-center justify-center ">
                        <MdVerified size={19} />
                      </span>
                    )}
                    {post.verifiedOrg && (
                      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-sky-500 text-[9px] font-bold text-white">
                        {post.verifiedOrg}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/user/${post.username || (post.handle?.replace("@", ""))}`}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 block truncate text-xs font-medium text-emerald-100/42 hover:underline"
                  >
                    {post.handle} · {timeLabel}
                  </Link>
                </div>
              </div>
            </div>

            {/* 3-dot dropdown — only button visible, edit/delete inside */}
            <div className="relative shrink-0" ref={menuRef}>
              <button
                className="flex-shrink-0 rounded-full p-1.5 text-emerald-100/45 transition-colors hover:bg-emerald-300/10 hover:text-emerald-200"
                onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
                aria-label="More options"
              >
                <MoreHorizontal size={16} />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-8 z-20 min-w-[140px] overflow-hidden rounded-xl border border-emerald-300/15 bg-[#0d2318] shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.isOwner && !isEditing && (
                    <button
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-emerald-100/80 transition-colors hover:bg-emerald-300/10 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditText(post.text || "");
                        setEditMedia(media);
                        setIsEditing(true);
                        setMenuOpen(false);
                      }}
                    >
                      <Pencil size={14} />
                      Edit post
                    </button>
                  )}
                  {post.isOwner && (
                    <button
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                      onClick={(e) => { handleDelete(e); setMenuOpen(false); }}
                    >
                      <Trash2 size={14} />
                      Delete post
                    </button>
                  )}
                  {!post.isOwner && (
                    <button
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-emerald-100/80 transition-colors hover:bg-emerald-300/10 hover:text-white"
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}
                    >
                      Report post
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Text */}
          {isEditing ? (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <textarea
                value={editText}
                onChange={(event) => setEditText(event.target.value)}
                maxLength={280}
                className="min-h-24 w-full resize-none rounded-lg border border-white/10 bg-transparent p-3 text-sm text-white outline-none focus:border-emerald-500"
              />

              {editMedia.length > 0 && (
                <div className={`mt-2 grid gap-1 overflow-hidden rounded-xl border border-emerald-300/15 bg-black/20 ${
                  { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-2", 4: "grid-cols-2" }[editMedia.length] ?? "grid-cols-2"
                }`}>
                  {editMedia.map((item, index) => {
                    const isSingle = editMedia.length === 1;
                    const isSingleVideo = isSingle && item.type === "video";
                    const isSinglePortrait = isSingle && item.type === "image" && item.width && item.height && item.height > item.width;

                    return (
                      <div
                        key={item._tempId || item.publicId || item.url}
                        className={`relative overflow-hidden bg-black ${editMedia.length === 3 && index === 0 ? "row-span-2" : ""}`}
                        style={{
                          aspectRatio: isSingleVideo
                            ? undefined                                          // video: no forced ratio, natural height
                            : isSingle
                              ? isSinglePortrait ? undefined : "4/3"            // portrait image: natural, landscape: 4/3
                              : "1/1",                                           // multi: square cells
                          height: isSingleVideo
                            ? "min(68vh, 540px)"                                // video: tall container like PostCard
                            : isSinglePortrait
                              ? "min(68vh, 540px)"
                              : undefined,
                          maxHeight: isSingle ? "min(68vh, 540px)" : undefined,
                        }}
                      >
                        {item.type === "video" ? (
                          isSingle ? (
                            /* Full custom player for single video */
                            <CustomVideoPlayer src={item.url} className="rounded-none" />
                          ) : (
                            /* Thumbnail with play icon for multi-grid */
                            <>
                              <video src={item.url} className="h-full w-full object-cover" muted playsInline />
                              <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white">
                                <Play size={18} fill="currentColor" />
                              </span>
                            </>
                          )
                        ) : (
                          <img
                            src={item.url}
                            alt="media"
                            loading="lazy"
                            decoding="async"
                            className={isSingle ? "h-full max-h-full w-auto max-w-full object-contain mx-auto" : "h-full w-full object-cover"}
                          />
                        )}
                        {item.uploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <svg className="h-5 w-5 animate-spin text-emerald-300" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                            </svg>
                          </div>
                        )}
                        {!item.uploading && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditMedia((prev) => prev.filter((m) => (m._tempId || m.publicId || m.url) !== (item._tempId || item.publicId || item.url)));
                            }}
                            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition hover:bg-black/90"
                            aria-label="Remove media"
                          >
                            <X size={14} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add image button */}
              <label
                className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-emerald-300/20 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-300/10"
                onClick={(e) => e.stopPropagation()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Add image
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  disabled={editMedia.length >= 4}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (!files.length) return;
                    const slots = 4 - editMedia.length;

                    // 1. Show instant local previews with uploading flag
                    const previews = files.slice(0, slots).map((file) => ({
                      url: URL.createObjectURL(file),
                      type: file.type.startsWith("video/") ? "video" : "image",
                      publicId: null,
                      uploading: true,
                      _tempId: Math.random().toString(36).slice(2),
                    }));
                    setEditMedia((prev) => [...prev, ...previews]);

                    // 2. Upload each file to Cloudinary and replace preview with real data
                    await Promise.all(
                      files.slice(0, slots).map(async (file, i) => {
                        const tempId = previews[i]._tempId;
                        try {
                          const fd = new FormData();
                          fd.append("file", file);
                          const res = await fetch("/api/cloudinary/upload", { method: "POST", body: fd });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data?.error || "Upload failed");

                          // Replace the preview entry with real Cloudinary data
                          setEditMedia((prev) =>
                            prev.map((m) =>
                              m._tempId === tempId
                                ? {
                                    url: data.url,
                                    type: data.resourceType === "video" ? "video" : "image",
                                    publicId: data.publicId,
                                    width: data.width,
                                    height: data.height,
                                    uploading: false,
                                  }
                                : m
                            )
                          );
                        } catch {
                          // Remove failed preview
                          setEditMedia((prev) => prev.filter((m) => m._tempId !== tempId));
                          setError("Upload failed. Please try again.");
                        }
                      })
                    );
                    e.target.value = "";
                  }}
                />
              </label>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
                  aria-label="Cancel edit"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={handleEdit}
                  disabled={editMedia.some((m) => m.uploading)}
                  className="rounded-full bg-white p-2 text-black hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Save edit"
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-emerald-50/95">
              {linkifyText(post.text)}
            </p>
          )}

          {error && <p className="mt-2 text-xs font-medium text-red-400">{error}</p>}
        </div>

        {/* Media grid — hidden during editing (thumbnails shown in edit form above) */}
        {visibleMedia.length > 0 && !isEditing && (
          <div className="mt-3 border-y border-emerald-300/12 bg-[#000c09]/70">
            <div className={`grid ${mediaGridClass} gap-1 overflow-hidden`}>
              {visibleMedia.map((item, index) => {
                const isSinglePortrait =
                  hasSingleMedia && item.width && item.height && item.height > item.width;
                const singleAspect =
                  hasSingleMedia && item.width && item.height
                    ? `${item.width}/${item.height}`
                    : "4/3";

                return (
                  <div
                    key={item.publicId || item.url}
                    className={`relative flex items-center justify-center overflow-hidden bg-[#1a24219e] ${visibleMedia.length === 3 && index === 0 ? "row-span-2" : ""
                      }`}
                    onClick={(event) => openPreview(event, index)}
                    style={{
                      aspectRatio: hasSingleMedia
                        ? isSinglePortrait
                          ? undefined
                          : singleAspect
                        : "1/1",
                      height: isSinglePortrait ? "min(68vh, 540px)" : undefined,
                      maxHeight: hasSingleMedia ? "min(68vh, 540px)" : undefined,
                    }}
                  >
                    {item.type === "video" ? (
                      <>
                        <video
                          src={item.url}
                          className={
                            hasSingleMedia
                              ? "h-full max-h-full w-auto max-w-full object-contain"
                              : "h-full w-full object-cover"
                          }
                          preload="metadata"
                          muted
                          playsInline
                        />
                        {!isEditing && (
                          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm">
                            <Play size={21} fill="currentColor" />
                          </span>
                        )}
                      </>
                    ) : (
                      <img
                        src={item.url}
                        alt="post media"
                        className={
                          hasSingleMedia
                            ? "h-full max-h-full w-auto max-w-full object-contain"
                            : "h-full w-full object-cover"
                        }
                      />
                    )}
                    {isEditing && (
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setEditMedia((prev) =>
                            prev.filter((mediaItem) => mediaItem.publicId !== item.publicId)
                          );
                        }}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition hover:bg-black/90"
                        aria-label="Remove media"
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="px-4 pb-3 pt-2">
          <div className="flex items-center justify-between gap-3 text-xs font-medium text-emerald-100/42">
            <span>{likeCount > 0 ? `${formatCount(likeCount)} reactions` : "Be first to react"}</span>
            <div className="flex items-center gap-2">
              <span>{commentCount > 0 ? `${formatCount(commentCount)} comments` : "No comments"}</span>
              <span>·</span>
              <span>{Number.isFinite(viewCount) ? `${formatCount(viewCount)} views` : "0 views"}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-2 grid grid-cols-4 gap-2 border-y border-emerald-300/12 py-2">
            {actions.map(({ icon: Icon, count, activeColor, active, onClick }, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
                aria-label={Icon === MessageCircle ? "Comments" : Icon === Repeat2 ? "Repost" : Icon === Heart ? "Like" : "Share post"}
                className={`flex h-10 items-center justify-center gap-1.5 rounded-full border border-emerald-300/10 bg-white/[0.03] px-3 text-xs font-semibold text-emerald-100/60 transition-all
                  hover:border-emerald-300/25 hover:bg-emerald-300/10 ${active ? `border-current/30 ${activeColor} bg-current/10` : ""}`}
              >
                <Icon
                  size={16}
                  className={active ? activeColor : "text-emerald-100/70"}
                  fill={active && Icon === Heart ? "currentColor" : "none"}
                />
                {count > 0 && (
                  <span className={`tabular-nums ${active ? activeColor : "text-emerald-100/70"}`}>
                    {formatCount(count)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {shareStatus && (
            <p className="mt-1 text-xs font-semibold text-emerald-300">
              {shareStatus}
            </p>
          )}

          {showComments && (
            <div className="mt-3 space-y-3" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleComment} className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Post your reply"
                  maxLength={280}
                  className="min-w-0 flex-1 rounded-full border border-emerald-300/15 bg-black/10 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="premium-button rounded-full px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/50"
                >
                  Reply
                </button>
              </form>
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2 border-t border-emerald-300/12 pt-3">
                  <img
                    src={comment.profileImg}
                    alt={comment.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-500">
                      <span className="font-bold text-white">{comment.name}</span>{" "}
                      @{comment.username}
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-white">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* FIX 1: Portal renders the preview outside <article> so overflow-hidden can't clip it */}
      <MediaPreview
        visibleMedia={visibleMedia}
        previewIndex={previewIndex}
        setPreviewIndex={setPreviewIndex}
      />
    </>
  );
}

export default PostCard;
