"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MessageCircle,
  Repeat2,
  Heart,
  BarChart2,
  Bookmark,
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

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
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

    const nextTime = (Number(event.target.value) / 100) * duration;
    video.currentTime = nextTime;
    setProgress(Number(event.target.value));
  };

  return (
    <div
      className={`group relative flex items-center justify-center bg-black ${className}`}
      style={{ width: "100%", height: "100%" }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        className="block max-h-full max-w-full object-contain"
        style={{ width: "100%", height: "100%" }}
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
      />

      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-black/85"
          aria-label="Play video"
        >
          <Play size={24} fill="currentColor" />
        </button>
      )}

      <div
        className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-4 pt-10 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:bg-emerald-100"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
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
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/20"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
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
        className="flex w-full max-w-4xl items-center justify-center rounded-md overflow-hidden"
        style={{ height: "min(88vh, 720px)" }}
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

function PostCard({ post, onDeleted, onUpdated }) {
  const [liked, setLiked] = useState(post.liked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes ?? 0);
  const [retweeted, setRetweeted] = useState(false);
  const [rtCount, setRtCount] = useState(post.retweets ?? 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [viewCount, setViewCount] = useState(post.views ?? 0);
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
    if (!post.id || String(post.id).length !== 24) return;

    fetch(`/api/posts/${post.id}/view`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        if (typeof data.views === "number") {
          setViewCount(data.views);
        }
      })
      .catch(() => { });
  }, [post.id]);

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
      hoverBg: "hover:bg-sky-400/10",
      active: showComments,
      onClick: () => setShowComments((value) => !value),
    },
    {
      icon: Repeat2,
      count: rtCount,
      activeColor: "text-emerald-400",
      hoverBg: "hover:bg-emerald-400/10",
      active: retweeted,
      onClick: handleRt,
    },
    {
      icon: Heart,
      count: likeCount,
      activeColor: "text-pink-500",
      hoverBg: "hover:bg-pink-500/10",
      active: liked,
      onClick: handleLike,
    },
    {
      icon: BarChart2,
      count: viewCount,
      activeColor: "text-sky-400",
      hoverBg: "hover:bg-sky-400/10",
      active: false,
      onClick: () => { },
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

  const getPostUrl = () => {
    if (typeof window === "undefined") return `/posts/${post.id}`;
    return `${window.location.origin}/posts/${post.id}`;
  };

  const handleShare = async (event) => {
    event.stopPropagation();

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
  };

  const handleDelete = async (event) => {
    event.stopPropagation();

    if (!post.isOwner) return;

    const response = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
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

  return (
    <>
      <article className="emerald-panel emerald-panel-hover group w-full cursor-pointer overflow-hidden rounded-xl">
        <div className="px-4 pt-4">
          <div className="flex items-start gap-3">
            <img
              src={post.avatar}
              alt={post.name}
              className="h-11 w-11 shrink-0 rounded-full border border-emerald-300/20 bg-emerald-950/60 object-cover shadow-[0_0_20px_rgba(16,185,129,0.1)]"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex min-w-0 flex-wrap items-center gap-1">
                    <span className="truncate text-[15px] font-bold leading-tight text-white">
                      {post.name}
                    </span>
                    {isVerified && (
                      <span title="Verified account" className="inline-flex text-emerald-200 shrink-0 items-center justify-center ">
                        <MdVerified size={16} />
                      </span>
                    )}
                    {post.verifiedOrg && (
                      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-sky-500 text-[9px] font-bold text-white">
                        {post.verifiedOrg}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs font-medium text-gray-400">
                    {post.handle} · {timeLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              {post.isOwner && !isEditing && (
                <button
                  className="flex-shrink-0 rounded-full p-1.5 text-emerald-100/45 transition-colors hover:bg-emerald-300/10 hover:text-emerald-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditText(post.text || "");
                    setEditMedia(media);
                    setIsEditing(true);
                  }}
                  aria-label="Edit post"
                >
                  <Pencil size={16} />
                </button>
              )}
              {post.isOwner && (
                <button
                  className="flex-shrink-0 rounded-full p-1.5 text-emerald-100/45 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  onClick={handleDelete}
                  aria-label="Delete post"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                className="flex-shrink-0 rounded-full p-1.5 text-emerald-100/45 transition-colors hover:bg-emerald-300/10 hover:text-emerald-200"
                onClick={(e) => e.stopPropagation()}
                aria-label="More"
              >
                <MoreHorizontal size={16} />
              </button>
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
                  className="rounded-full bg-white p-2 text-black hover:bg-white/90"
                  aria-label="Save edit"
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-emerald-50/95">
              {post.text}
            </p>
          )}

          {error && <p className="mt-2 text-xs font-medium text-red-400">{error}</p>}
        </div>

        {/* Media */}
        {visibleMedia.length > 0 && (
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
          <div className="flex items-center justify-between text-xs font-medium text-emerald-100/42">
            <span>{likeCount > 0 ? `${formatCount(likeCount)} reactions` : "Be first to react"}</span>
            <span>
              {commentCount > 0 ? `${formatCount(commentCount)} comments` : "No comments"}
              {viewCount > 0 ? ` · ${formatCount(viewCount)} views` : ""}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-2 grid grid-cols-6 border-y border-emerald-300/12 py-1">
            {actions.map(({ icon: Icon, count, activeColor, hoverBg, active, onClick }, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-semibold text-emerald-100/58 transition-colors
                  ${hoverBg} ${active ? activeColor : "hover:text-current"}`}
              >
                <Icon
                  size={17}
                  className={active ? activeColor : ""}
                  fill={active && (i === 2) ? "currentColor" : "none"}
                />
                {count > 0 && (
                  <span className={active ? activeColor : ""}>{formatCount(count)}</span>
                )}
              </button>
            ))}

            <div className="col-span-2 grid grid-cols-2">
              <button
                onClick={(e) => { e.stopPropagation(); setBookmarked(p => !p); }}
                className={`flex items-center justify-center rounded-md p-2 text-emerald-100/58 transition-colors hover:bg-emerald-300/10 hover:text-emerald-300
                  ${bookmarked ? "text-emerald-300" : ""}`}
                aria-label="Bookmark post"
              >
                <Bookmark size={17} fill={bookmarked ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center rounded-md p-2 text-emerald-100/58 transition-colors hover:bg-emerald-300/10 hover:text-emerald-300"
                aria-label="Share post"
              >
                <Share size={17} />
              </button>
            </div>
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