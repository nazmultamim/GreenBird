"use client";



import { useMemo, useRef, useState, useEffect } from "react";
import { Image, Smile, Calendar, MapPin, X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { BiPoll } from "react-icons/bi";
import { IoEarth } from "react-icons/io5";
import { useUser } from "@clerk/nextjs";



const MAX_LENGTH = 280;
const MAX_IMAGE_SIZE = 80 * 1024 * 1024;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

function formatBytes(bytes) {
  return `${Math.round(bytes / 1024 / 1024)}MB`;
}

function CustomVideoPlayer({ src }) {
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

    const nextProgress = Number(event.target.value);
    video.currentTime = (nextProgress / 100) * duration;
    setProgress(nextProgress);
  };

  return (
    <div
      className="group relative flex h-full w-full items-center justify-center bg-black"
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
        onClick={(event) => {
          event.stopPropagation();
          togglePlay(event);
        }}
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

function CreatePost({ onPost }) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();


  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const remaining  = MAX_LENGTH - text.length;
  const progress   = Math.min(text.length / MAX_LENGTH, 1);
  const isOverLimit = remaining < 0;
  const isEmpty    = !text.trim() && mediaFiles.length === 0;
  const canPost    = !isEmpty && !isOverLimit && !isPosting;

  const progressColor = useMemo(() => {
    if (isOverLimit) return "#F4212E";
    if (remaining <= 20) return "#FFD400";
    return "#34d399";
  }, [remaining, isOverLimit]);

  const radius       = 10;
  const circumference = 2 * Math.PI * radius;
  const dashOffset   = circumference - progress * circumference;

  /* ── auto-resize textarea ── */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [text]);

  /* ── handlers ── */
  const handlePost = async () => {
    if (!canPost) return;

    setIsPosting(true);
    setError("");

    try {
      const uploadedMedia = await Promise.all(
        mediaFiles.map(async (media) => {
          const formData = new FormData();
          formData.append("file", media.file);

          const response = await fetch("/api/cloudinary/upload", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data?.error || "Media upload failed.");
          }

          return {
            url: data.url,
            type: data.resourceType === "video" ? "video" : "image",
            publicId: data.publicId,
            width: data.width,
            height: data.height,
          };
        })
      );

      if (onPost) {
        await onPost({ text, media: uploadedMedia });
      } else {
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, media: uploadedMedia }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Post could not be saved.");
        }
      }
      mediaFiles.forEach((media) => URL.revokeObjectURL(media.url));
      setText("");
      setMediaFiles([]);
      setIsFocused(false);
    } catch (err) {
      setError(err.message || "Something went wrong while uploading media.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const slots = 4 - mediaFiles.length;
    setError("");

    files.slice(0, slots).forEach((file) => {
      const isVideo = file.type.startsWith("video/");
      const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

      if (file.size > maxSize) {
        setError(
          `${file.name} is too large. Images can be up to ${formatBytes(
            MAX_IMAGE_SIZE
          )}; videos can be up to ${formatBytes(MAX_VIDEO_SIZE)}.`
        );
        return;
      }

      const url  = URL.createObjectURL(file);
      const type = file.type.startsWith("video/") ? "video" : "image";
      setMediaFiles((prev) => [...prev, { file, url, type, name: file.name }]);
    });
    e.target.value = "";
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handlePoll     = () => alert("Poll coming soon");
  const handleEmoji    = () => alert("Emoji picker coming soon");
  const handleSchedule = () => alert("Schedule coming soon");
  const handleLocation = () => alert("Location coming soon");

  const LEFT_ICONS = [
    { icon: Image,    label: "Add image",   onClick: handleImageClick, disabled: mediaFiles.length >= 4 },
    { icon: BiPoll,   label: "Add poll",    onClick: handlePoll,       disabled: false },
    { icon: Smile,    label: "Add emoji",   onClick: handleEmoji,      disabled: false },
    { icon: Calendar, label: "Schedule",    onClick: handleSchedule,   disabled: false },
    { icon: MapPin,   label: "Add location",onClick: handleLocation,   disabled: false },
  ];

  const gridClass = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-2", 4: "grid-cols-2" }[mediaFiles.length] ?? "grid-cols-2";

  return (
    <div className="border-b emerald-divider bg-gradient-to-b from-emerald-950/18 to-transparent px-3 py-3 sm:px-4">

      {/* hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* CREATE POST */}
      <div className="emerald-panel rounded-xl px-3 pt-3 sm:px-4">

        {/* AVATAR */}
        <div className="shrink-0">
          <img src={user?.imageUrl} alt={user?.fullName || "User"} className="h-11 w-11 rounded-full border border-emerald-300/20 object-cover shadow-[0_0_24px_rgba(16,185,129,0.12)]" />
        </div>

        {/* RIGHT */}
        <div className="min-w-0 flex-1">

          {/* ── TEXTAREA + HIGHLIGHT OVERLAY ── */}
          <div className="relative pt-1">

            {/* Red highlight layer — only mounts when over limit */}
            {isOverLimit && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 whitespace-pre-wrap break-words pt-1 text-[21px] leading-7 text-white"
                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              >
                {/* normal portion — visible white text */}
                <span className="text-white">{text.slice(0, MAX_LENGTH)}</span>
                {/* overflow portion — red highlight */}
                <span className="bg-red-500/40 text-white">{text.slice(MAX_LENGTH)}</span>
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={text}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => setText(e.target.value)}
              rows={1}
              placeholder="What is happening?!"
              style={{
                /* hide text under highlight when over limit so it doesn't double-render */
                color: isOverLimit ? "transparent" : "white",
                caretColor: "white",
                resize: "none",
                overflow: "hidden",
              }}
              className="min-h-[52px] w-full bg-transparent text-[21px] leading-7 placeholder:text-emerald-100/36 outline-none"
            />
          </div>

          {/* ── UPGRADE BANNER ── */}
          {isOverLimit && (
            <div className="mb-3 mt-2 rounded-xl border border-amber-300/15 bg-amber-500/10 px-4 py-3">
              <p className="text-[14px] text-zinc-300">
                Upgrade to Premium to write longer posts and Articles.
              </p>
              <button className="mt-1 text-[14px] font-bold text-emerald-300 underline underline-offset-2 transition-colors hover:text-emerald-200">
                Upgrade for 50% off
              </button>
            </div>
          )}

          {error && (
            <p className="mb-3 mt-2 text-sm font-medium text-red-400">
              {error}
            </p>
          )}

          {/* MEDIA PREVIEW */}
          {mediaFiles.length > 0 && (
            <div className={`mt-3 grid ${gridClass} gap-1.5 overflow-hidden rounded-xl border border-emerald-300/15 bg-black/20`}>
              {mediaFiles.map((file, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden bg-zinc-900 ${
                    mediaFiles.length === 3 && index === 0 ? "row-span-2" : ""
                  }`}
                  style={{ aspectRatio: mediaFiles.length === 1 ? "16/9" : "1/1" }}
                >
                  {file.type === "video" ? (
                    <CustomVideoPlayer src={file.url} />
                  ) : (
                    <img src={file.url} alt={file.name} className="h-full w-full object-contain" />
                  )}
                  {file.type === "video" && (
                    <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                      VIDEO
                    </span>
                  )}
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition hover:bg-black/90"
                    aria-label="Remove media"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* EVERYONE CAN REPLY */}
          {isFocused && (
            <button className="mb-3 mt-3 flex items-center gap-2 rounded-full px-3 py-[2px] text-[14px] font-bold text-emerald-500 transition hover:bg-emerald-500/10">
              <IoEarth size={16} />
              Everyone can reply
            </button>
          )}

          {/* DIVIDER */}
          <div className={`border-b transition-colors ${isFocused ? "border-emerald-300/15" : "border-transparent"}`} />

          {/* ACTIONS */}
          <div className="flex items-center justify-between py-3">

            {/* LEFT ICONS */}
            <div className="flex items-center gap-0.5">
              {LEFT_ICONS.map(({ icon: Icon, label, onClick, disabled }) => (
                <button
                  key={label}
                  aria-label={label}
                  onClick={onClick}
                  disabled={disabled}
                  className={`group rounded-full p-2 transition-colors cursor-pointer ${
                    disabled ? "cursor-not-allowed opacity-30" : "hover:bg-emerald-300/10"
                  }`}
                >
                  <Icon size={22} strokeWidth={1.75} className="text-emerald-100/70 transition-transform group-hover:scale-110 group-hover:text-emerald-200" />
                </button>
              ))}
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              {/* PROGRESS — circle hides when over limit, replaced by red number */}
              {(text.length > 0 || isFocused) && (
                <div className="flex items-center gap-2">

                  {/* Circle — hidden when over limit */}
                  {!isOverLimit && (
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r={radius} fill="none" stroke="rgba(110,231,183,0.16)" strokeWidth="2" />
                      <circle
                        cx="12" cy="12" r={radius}
                        fill="none"
                        stroke={progressColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        transform="rotate(-90 12 12)"
                      />
                    </svg>
                  )}

                  {/* Counter: yellow warning ≤20, red negative when over */}
                  {(remaining <= 20) && (
                    <span className={`text-sm font-medium tabular-nums ${isOverLimit ? "text-red-500" : "text-zinc-400"}`}>
                      {remaining}
                    </span>
                  )}

                  <div className="h-5 w-px bg-white/10" />
                </div>
              )}

              {/* POST BUTTON */}
              <button
                onClick={handlePost}
                disabled={!canPost}
                className={`min-w-[72px] rounded-full px-4 py-[9px] text-[15px] font-bold transition-all duration-200 ${
                  canPost
                    ? "premium-button text-white"
                    : "cursor-not-allowed bg-white/10 text-white/40"
                }`}
              >
                {isPosting ? "Posting" : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost
