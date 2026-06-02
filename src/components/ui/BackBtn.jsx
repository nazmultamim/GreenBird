"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useNavigationLoader } from "./navigation-loader";

export default function BackButton() {
  const router = useRouter();
  const { startLoading } = useNavigationLoader();

  return (
    <button
      onClick={() => {
        startLoading();
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      className="rounded-full p-2 text-emerald-100/70 transition hover:bg-emerald-300/10 hover:text-emerald-100"
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
