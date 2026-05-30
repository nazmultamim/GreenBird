"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  User,
  MessageSquare,
  Bell,
  Users,
  Settings,
  LogOut,
  X,
  Gem,
} from "lucide-react";

import logo from "../../../../public/assets/logo.png";
import Image from "next/image";

/* ── NAV ITEMS ── */
const sidebarNav = [
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Users, label: "Follow", href: "/follow" },
  { icon: Bell, label: "Notifications", href: "/notifications", badge: 2 },
  { icon: MessageSquare, label: "Chat", href: "/chat", badge: 5, },
  { icon: Gem, label: "Premium", href: "/update", tag: "50% off", },
  { icon: Settings, label: "Settings and privacy", href: "/settings" },
];

export default function MobileSidebar({ open, onClose }) {
  const { user } = useUser();
  const { signOut } = useClerk();

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* ── BACKDROP ── */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`
          sm:hidden fixed inset-0 z-50
          bg-black/60 backdrop-blur-[2px]
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* ── DRAWER ── */}
      <aside
        style={{
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
        className="
          sm:hidden
          fixed top-0 left-0 z-50
          w-[82vw] max-w-[340px] h-full
             bg-[rgba(11,28,22,0.88)]
              backdrop-blur-xl
             shadow-[0_10px_40px_rgba(16,185,129,0.08),0_18px_60px_rgba(0,0,0,0.45)]
          flex flex-col
          overflow-y-auto
        "
      >
        {/* ── HEADER: avatar + close ── */}
        <div className="flex items-start justify-between px-4 pt-5 pb-3">
          {/* Avatar */}
          <img
            src={user?.imageUrl ?? "/default-avatar.png"}
            alt={user?.fullName ?? "User"}
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── USER INFO ── */}
        <div className="px-4 pb-4">
          <p className="font-bold text-white text-base leading-tight">
            {user?.fullName ?? "User"}
          </p>
          <p className="text-zinc-500 text-sm mt-0.5">
            @{user?.username ?? user?.firstName ?? "user"}
          </p>

          {/* Following / Followers */}
          <div className="flex items-center gap-4 mt-3">
            <Link href="/following" className="flex items-center gap-1 hover:underline">
              <span className="text-white font-bold text-sm">1</span>
              <span className="text-zinc-500 text-sm">Following</span>
            </Link>
            <Link href="/followers" className="flex items-center gap-1 hover:underline">
              <span className="text-white font-bold text-sm">0</span>
              <span className="text-zinc-500 text-sm">Followers</span>
            </Link>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="h-px bg-white/10 mx-4" />

        {/* ── NAV ITEMS ── */}
        <nav className="flex flex-col py-2 flex-1">
          {sidebarNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="
                  flex items-center gap-5
                  px-4 py-3.5
                  hover:bg-white/5
                  transition-colors
                  text-white
                "
              >
                <Icon size={22} strokeWidth={1.75} className="shrink-0" />
                <span className="text-xl font-medium flex-1">{item.label}</span>

                {/* Badge */}
                {item.badge && (
                  <span className="
                    bg-emerald-600 text-white
                    text-[11px] font-bold
                    rounded-full min-w-[20px] h-5 px-1
                    flex items-center justify-center
                  ">
                    {item.badge}
                  </span>
                )}

                {item.tag && (
                  <span
                    className="
                      bg-emerald-900/60
                      text-emerald-400
                      text-xs font-bold
                      px-2 py-0.5 rounded
                      whitespace-nowrap
                    "
                  >
                    {item.tag}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── DIVIDER ── */}
        <div className="h-px bg-white/10 mx-4" />

        {/* ── FOOTER: X logo + logout ── */}
        <div className="px-4 py-5 flex items-center justify-between">
          <Image
            src={logo}
            alt="Green Bird"
            className="w-12 h-12 object-contain
            "
          />

          <button
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            className="
              flex items-center gap-2 px-2 py-1.5
              text-sm
                rounded-sm
                 border 
                 backdrop-blur-xl
                 text-zinc-300
                 bg-red-500/10
                 border-red-500/20
                 hover:text-red-300
                 transition-all duration-300
                 shadow-[0_4px_18px_rgba(0,0,0,0.18)]
            "
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
