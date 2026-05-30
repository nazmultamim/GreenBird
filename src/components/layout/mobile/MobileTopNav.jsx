"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Menu } from "lucide-react";
import MobileSidebar from "./MobileSidebar";
import logo from "../../../../public/assets/logo.png";
import Image from "next/image";

export default function MobileTopNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (currentY < 10) {
          // Always show at top
          setVisible(true);
        } else if (delta > 6) {
          // Scrolling down — hide
          setVisible(false);
        } else if (delta < -6) {
          // Scrolling up — show
          setVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── TOP NAV ── */}
      <header
        style={{
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
        className="
          sm:hidden
          fixed top-0 left-0 right-0 z-40
          flex items-center justify-between
          px-4 h-14
           bg-[rgba(11,28,22,0.88)]
              backdrop-blur-xl
             shadow-[0_10px_40px_rgba(16,185,129,0.08),0_18px_60px_rgba(0,0,0,0.45)]
          border-b border-white/10
        "
      >
        {/* LEFT — Logo */}
        <Link
          href="/"
          className="
    group relative flex h-14 w-14 items-center justify-center 
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

        {/* RIGHT — Actions */}
        <div className="flex items-center gap-1">
          {/* Plus */}
          <button
            onClick={() => router.push("/createpost")}
            className="
              p-2 rounded-full
              hover:bg-white/10
              transition-colors text-white
            "
          >
            <Plus size={22} strokeWidth={2} />
          </button>

          {/* Search */}
          <Link
            href="/explore"
            className="
              p-2 rounded-full
              hover:bg-white/10
              transition-colors text-white
            "
          >
            <Search size={22} strokeWidth={2} />
          </Link>

          {/* Menu → opens sidebar */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="
              p-2 rounded-full
              hover:bg-white/10
              transition-colors text-white
            "
          >
            <Menu size={22} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* ── SIDEBAR ── */}
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
}
