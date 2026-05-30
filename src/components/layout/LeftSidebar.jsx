"use client";

import Link from "next/link";
import logo from "../../../public/assets/logo.png";


import {
  Search,
  Bell,
  Bookmark,
  User,
  Users,
  MessageSquare,
  Plus,
  LogOut,
  UserPlus,
  ChevronDown,
  Settings,
  X,
  Gem,
} from "lucide-react";

import {
  useUser,
  useClerk,
} from "@clerk/nextjs";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import CreatePost from "../feed/CreatePost";
import { useState } from "react";
import Image from "next/image";



/* =========================
   HOME ICON
========================= */
const HomeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M10.059 2.593c1.175-.784 2.707-.784 3.882 0l6.5 4.333C21.415 7.575 22 8.668 22 9.838V18.5c0 1.933-1.567 3.5-3.5 3.5h-4.25v-5.25c0-1.243-1.007-2.25-2.25-2.25s-2.25 1.007-2.25 2.25V22H5.5C3.567 22 2 20.433 2 18.5V9.838c0-1.17.585-2.263 1.559-2.912l6.5-4.333z" />
  </svg>
);

/* =========================
   NAV ITEMS
========================= */
const navItems = [
  { icon: HomeIcon, label: "Home", href: "/", active: true },
  { icon: Search, label: "Explore", href: "/explore" },
  { icon: Bell, label: "Notifications", href: "/notifications", badge: 2 },
  { icon: Users, label: "Follow", href: "/follow" },
  { icon: MessageSquare, label: "Chat", href: "/chat" },
  { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
  {
    icon: Gem,
    label: "Premium",
    href: "/premium",
    tag: "50% off",
  },
  { icon: User, label: "Profile", href: "/profile" },
];

/* =========================
   SIDEBAR
========================= */
export default function LeftSidebar() {


  const [openPost, setOpenPost] = useState(false);


  return (
    <aside
      className="
        hidden sm:flex sticky top-0
        h-screen flex-col justify-between
        px-2 xl:px-4 py-2
        xl:w-72 w-20 shrink-0
      "
    >

      {/* TOP */}
      <div className="flex flex-col gap-1">

        {/* LOGO */}
        <Link
          href="/"
          className="
    group relative flex h-14 w-14 items-center justify-center ml-4
    rounded-2xl border border-white/10 
    bg-white/5 backdrop-blur-md
    shadow-[0_4px_12px_rgba(0,0,0,0.5)]
    transition-all duration-300 ease-out
    hover:border-emerald-500/50 hover:bg-emerald-500/10
    hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]
  "
          aria-label="Green Bird home"
        >
          <Image
            src={logo}
            alt="Green Bird"
            className="
    h-15 w-15 object-contain
    transition-all duration-500 ease-in-out 
    group-hover:scale-110 
    group-hover:brightness-125 
    group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]
  "
          />
        </Link>

        {/* NAV */}
        <nav className="flex flex-col gap-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  flex items-center gap-5
                  px-3 py-2.5 rounded-full
                  hover:bg-emerald-300/10
                  transition-colors
                  w-fit backdrop-blur-sm
                  ${item.active ? "font-bold" : ""}
                `}
              >
                {/* ICON */}
                <div className="relative">
                  <Icon
                    className="w-7 h-7"
                    strokeWidth={item.active ? 2.5 : 2}
                  />

                  {/* BADGE */}
                  {item.badge && (
                    <span
                      className="
                        absolute -top-1 -right-2
                        bg-emerald-400 text-[#00140f]
                        text-[10px] font-bold
                        rounded-full w-4 h-4
                        flex items-center justify-center
                      "
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* LABEL */}
                <span className="hidden xl:inline text-xl pr-4">
                  {item.label}
                </span>

                {/* TAG */}
                {item.tag && (
                  <span
                    className="
                      hidden xl:inline-flex
                      bg-emerald-300/12
                      text-emerald-300
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

        {/* POST BUTTON */}
        <Dialog.Root open={openPost} onOpenChange={setOpenPost}>
          {/* BUTTON */}
          <Dialog.Trigger asChild>
            <button
              className="
                  mt-3 btn-gradient
                 text-white font-bold
                  rounded-full
                  py-3.5 xl:px-8
                  xl:w-[90%]
                  w-12 h-12 xl:h-auto
                  flex items-center justify-center
                  mx-auto xl:mx-0
                  cursor-pointer
                  hover:opacity-90
                  transition
                  "
            >
              <span className="hidden xl:inline">
                Post
              </span>

              <span className="xl:hidden">
                <Plus size={25} strokeWidth={1.75} />
              </span>
            </button>
          </Dialog.Trigger>

          {/* PORTAL */}
          <Dialog.Portal>

            {/* OVERLAY */}
            <Dialog.Overlay
              className="
        fixed inset-0
        bg-black/60
        backdrop-blur-sm
        z-50
        animate-in fade-in
      "
            />

            {/* DIALOG */}

            <Dialog.Content
              className="
    fixed left-1/2 top-5
    z-50
    w-full max-w-2xl

    -translate-x-1/2

    rounded-2xl
    border border-white/10
        bg-[rgba(4,22,20,0.88)]
      backdrop-blur-xl
      shadow-[0_10px_40px_rgba(16,185,129,0.04)]

    max-h-[90vh]
    overflow-hidden

    animate-in zoom-in-95 fade-in
  "
            >

              <Dialog.Title className="sr-only">
                Create Post
              </Dialog.Title>

              {/* HEADER */}
              <div
                className="
      sticky top-0 z-20
      flex items-center justify-between
      border-b border-white/10
      bg-[rgba(4,22,20,0.88)]
      backdrop-blur-xl
      shadow-[0_10px_40px_rgba(16,185,129,0.04)]
      transition-all
      px-4 py-3
    "
              >
                <Dialog.Close asChild>
                  <button
                    className="
          flex h-9 w-9
          items-center justify-center
          rounded-full
          hover:bg-white/10
          transition
          cursor-pointer
        "
                  >
                    <X size={22} />
                  </button>
                </Dialog.Close>

                <button
                  className="
        text-sm font-semibold
        text-emerald-500
        cursor-pointer
      "
                >
                  Drafts
                </button>
              </div>

              {/* CONTENT */}
              <div
                className="
      overflow-y-auto
      max-h-[calc(90vh-65px)]

      scrollbar-thin
      scrollbar-thumb-white/10
      scrollbar-track-transparent
    "
              >
                <CreatePost />
              </div>

            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

      </div>

      {/* AUTH */}
      <div className="mb-10">
        <ProfileMenu />
      </div>
    </aside>
  );
}

/* =========================
   PROFILE MENU
========================= */
function ProfileMenu() {
  const { user } = useUser();

  const {
    signOut,
    openUserProfile,
    openSignIn,
  } = useClerk();

  return (
    <DropdownMenu.Root>

      {/* TRIGGER */}
      <DropdownMenu.Trigger asChild>
        <button
          className="
            flex items-center justify-between
            gap-3 p-3 rounded-2xl
            border border-emerald-300/24
            hover:bg-emerald-300/10
            transition-all
            cursor-pointer
            w-full backdrop-blur-sm
          "
        >
          {/* USER INFO */}
          <div className="flex items-center gap-3 overflow-hidden">

            {/* IMAGE */}
            <img
              src={user?.imageUrl}
              alt={user?.fullName || "User"}
              className="
                w-10 h-10 rounded-full
                object-cover shrink-0
              "
            />

            {/* TEXT */}
            <div className="hidden xl:block text-left overflow-hidden">
              <p className="font-bold text-sm leading-tight truncate">
                {user?.fullName}
              </p>

              <p
                className="
                  text-muted-foreground
                  text-sm leading-tight
                  truncate
                "
              >
                @
                {user?.username ||
                  user?.firstName ||
                  "user"}
              </p>
            </div>
          </div>

          {/* ICON */}
          <ChevronDown
            className="
              hidden xl:block
              w-4 h-4
              text-muted-foreground
              shrink-0
            "
          />
        </button>
      </DropdownMenu.Trigger>

      {/* DROPDOWN */}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="top"
          align="start"
          sideOffset={10}
          className="
            z-50 min-w-[260px]
            rounded-2xl
            bg-[rgba(11,28,22,0.88)]
              backdrop-blur-xl
               border border-[rgba(17,196,137,0.33)]
             shadow-[0_10px_40px_rgba(16,185,129,0.08),0_18px_60px_rgba(0,0,0,0.45)]
            p-2
          "
        >
          {/* HEADER */}
          <div
            className="
              px-3 py-3 mb-1
              border-b border-border
            "
          >
            <div className="flex items-center gap-3">

              <img
                src={user?.imageUrl}
                alt={user?.fullName || "User"}
                className="
                  w-11 h-11 rounded-full
                  object-cover
                "
              />

              <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate">
                  {user?.fullName}
                </p>

                <p
                  className="
                    text-xs text-muted-foreground
                    truncate
                  "
                >
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>

            </div>
          </div>

          {/* MANAGE ACCOUNT */}
          <button
            onClick={() => openUserProfile()}
            className="
              flex items-center gap-3
              w-full rounded-xl
              px-3 py-2.5 text-sm
              hover:bg-accent/10
              transition
              cursor-pointer
            "
          >
            <Settings className="w-4 h-4" />
            Manage Account
          </button>

          {/* ADD ACCOUNT */}
          <button
            onClick={() => openSignIn()}
            className="
              flex items-center gap-3
              w-full rounded-xl
              px-3 py-2.5 text-sm
              hover:bg-accent/10
              transition
              cursor-pointer
            "
          >
            <UserPlus className="w-4 h-4" />
            Add Another Account
          </button>

          {/* LOGOUT */}
          <button
            onClick={() =>
              signOut({
                redirectUrl: "/sign-in",
              })
            }
            className="
              flex items-center gap-3
              w-full rounded-xl
              px-3 py-2.5 text-sm
              text-red-400
              hover:bg-red-500/10
              transition
              cursor-pointer
            "
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

        </DropdownMenu.Content>
      </DropdownMenu.Portal>

    </DropdownMenu.Root>
  );
}
