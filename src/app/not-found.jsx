"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen  text-white">
      {/* Center content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        
        {/* 404 */}
        <h1 className="text-6xl font-bold text-gray-300">404</h1>

        {/* Title */}
        <h2 className="mt-4 text-xl font-semibold">
          This page doesn’t exist
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-400 max-w-sm">
          The link may be broken or the page may have been removed.
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium hover:bg-emerald-600 transition"
          >
            Go home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="rounded-full border border-gray-600 px-5 py-2 text-sm text-gray-300 hover:bg-gray-800 transition"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}