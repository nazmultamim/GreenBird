"use client";

import React from "react";
import { MessageSquareCode, Construction } from "lucide-react";
import BackButton from "../../../components/ui/BackBtn"; 

export default function Chat() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">

      <div className="absolute left-6 top-6">
        <BackButton />
      </div>

      <div className="relative flex flex-col items-center max-w-sm rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(2,20,16,0.6))] p-8 shadow-[0_24px_100px_rgba(0,0,0,0.2)] backdrop-blur-md">
        

        <div className="absolute -z-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
        
      
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
          <MessageSquareCode className="h-8 w-8" />
          <Construction className="absolute -bottom-1 -right-1 h-5 w-5 text-amber-400" />
        </div>

        {/* টেক্সট কন্টেন্ট */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 uppercase tracking-wider">
          Coming Soon
        </span>
        
        <h2 className="mt-4 text-xl font-bold text-white tracking-wide">
          Chat Feature
        </h2>
        
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          This page is currently under development. We are working hard to bring you a seamless messaging experience!
        </p>

        {/* ডামি প্রোগ্রেস বার (ভিজুয়াল অ্যাপিলের জন্য) */}
        <div className="mt-6 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}