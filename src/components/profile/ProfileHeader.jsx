"use client";

import { useState, useRef } from "react";
import {X, Camera, Pen } from "lucide-react";
import Link from "next/link";
import { MdVerified } from "react-icons/md";
import BackButton from "../ui/BackBtn";

export default function ProfileHeader({
  user,
  displayName,
  postCount,
  isFollowing,
  isCurrentUser,
}) {
  const [following, setFollowing] = useState(isFollowing);
  const [followers, setFollowers] = useState(user.followersCount ?? 0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");


  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(user.avatar || "");
  const [bannerUrlState, setBannerUrlState] = useState(user.banner || "");
  const [bioValueState, setBioValue] = useState(user.bio || "");

  const bannerUrl =
    user.banner ||
    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f";

  const joinedAt = user.joinedAt || "";

  // 🔁 Follow
  const handleToggleFollow = async () => {
    if (pending || isCurrentUser) return;

    setPending(true);
    setError("");

    try {
      const res = await fetch(`/api/users/${user.username}/follow`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error);

      setFollowing(data.followed);
      setFollowers(data.followersCount);
    } catch (err) {
      setError(err.message || "Action failed");
    } finally {
      setPending(false);
    }
  };

  // 📤 Upload
  const uploadFile = async (file) => {
    if (!file) return null;

    const form = new FormData();
    form.append("file", file);

    try {
      setUploading(true);

      const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error);

      return data.url;
    } catch (err) {
      setError(err.message || "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // 💾 Save
  const handleSaveProfile = async () => {
    setPending(true);
    setError("");

    try {
      const res = await fetch(`/api/users/${user.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: bioValueState,
          avatar: avatarUrl,
          banner: bannerUrlState,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error);

      setEditing(false);
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <section className="border-b border-white/10 text-white">
        <div className="flex items-center gap-4 px-4 py-3">
          <BackButton />

          <div>
            <h2 className="text-lg font-semibold">{displayName}</h2>
            <p className="text-xs text-gray-400">{postCount} posts</p>
          </div>
        </div>

        <div className="h-40 bg-gray-800">
          <img
            src={bannerUrlState || bannerUrl}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-start justify-between">
            <div className="-mt-12 h-24 w-24 rounded-full border-4 border-black overflow-hidden bg-gray-700">
              <img
                src={avatarUrl || "/default-avatar.png"}
                className="h-full w-full object-cover"
              />
            </div>

            <button
              onClick={
                isCurrentUser ? () => setEditing(true) : handleToggleFollow
              }
              className={`mt-3 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition
                ${isCurrentUser
                  ? "border border-accent/50 text-gray-300 hover:bg-accent/20"
                  : following
                    ? "border border-gray-600 hover:bg-white/10"
                    : "bg-white text-black hover:bg-gray-200"
                }
              `}
            > <Pen size={16} />
              {isCurrentUser
                ? "Edit profile"
                : following
                  ? "Following"
                  : "Follow"}
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-1">
              <h1 className="text-xl font-bold">{displayName}</h1>
              {user.verificationBadge && (
                <span title="Verified account" className="inline-flex text-emerald-200 shrink-0 items-center justify-center ">
                  <MdVerified size={19} />
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">@{user.username}</p>
          </div>

          {bioValueState && (
            <p className="mt-3 text-sm text-gray-200">{bioValueState}</p>
          )}

          {joinedAt && (
            <p className="mt-2 text-sm text-gray-400">
              Joined {joinedAt}
            </p>
          )}

          <div className="mt-3 flex gap-4 text-sm">
            <Link href={`/user/${user.username}/followers`}>
              <strong>{followers}</strong>{" "}
              <span className="text-gray-400 hover:underline">Followers</span>
            </Link>
            <Link href={`/user/${user.username}/following`}>
              <strong>{user.followingCount ?? 0}</strong>{" "}
              <span className="text-gray-400 hover:underline">Following</span>
            </Link>
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/80 px-4 backdrop-blur-sm">

          <div className="w-full max-w-2xl max-h-[85vh] mt-20 flex flex-col rounded-2xl bg-[#03231b] border border-white/10 shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <h3 className="text-xl font-semibold text-white">Edit Profile</h3>

              <button
                onClick={() => setEditing(false)}
                className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Hidden Inputs */}
              <input
                type="file"
                ref={avatarInputRef}
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  const url = await uploadFile(file);
                  if (url) setAvatarUrl(url);
                }}
              />

              <input
                type="file"
                ref={bannerInputRef}
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  const url = await uploadFile(file);
                  if (url) setBannerUrlState(url);
                }}
              />

              {/* Avatar */}
              <div className="text-center">
                <p className="text-xs uppercase text-gray-400 mb-2">Avatar</p>

                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className="group relative h-24 w-24 mx-auto cursor-pointer rounded-full overflow-hidden border-2 border-white/20"
                >
                  <img
                    src={avatarUrl || "/default-avatar.png"}
                    className="h-full w-full object-cover group-hover:blur-[2px]"
                    alt="Avatar"
                  />

                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100">
                    <Camera className="h-5 w-5 text-white" />
                    <span className="text-xs text-white mt-1">Change</span>
                  </div>
                </div>
              </div>

              {/* Banner */}
              <div>
                <p className="text-xs uppercase text-gray-400 mb-2">Banner</p>

                <div
                  onClick={() => bannerInputRef.current?.click()}
                  className="group relative h-40 w-full cursor-pointer rounded-xl overflow-hidden border border-white/10"
                >
                  <img
                    src={bannerUrlState || bannerUrl}
                    className="h-full w-full object-cover group-hover:blur-[1px]"
                    alt="Banner"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg">
                      <Camera className="h-4 w-4 text-white" />
                      <span className="text-xs text-white">Upload</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs uppercase text-gray-400 mb-2 block">
                  Bio
                </label>

                <textarea
                  value={bioValueState}
                  onChange={(e) => setBioValue(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white outline-none focus:border-white/30"
                  placeholder="Tell the world about yourself..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-white/5 p-4">
              <button
                onClick={() => setEditing(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveProfile}
                disabled={pending || uploading}
                className="bg-white text-black px-6 py-2 rounded-xl font-semibold disabled:opacity-50"
              >
                {pending || uploading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}