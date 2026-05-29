"use client";


export default function TopNav({ activeTab, onTabChange }) {
  const tabs = ["For you", "Following"];

  return (
    <div className="sticky top-0 z-10
      border-b emerald-divider
      bg-[rgba(2,18,14,0.86)]
      backdrop-blur-xl
      shadow-[0_16px_42px_rgba(0,0,0,0.2)]">
      <div className="flex">
            {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`relative flex-1 py-4 text-sm font-semibold tracking-wide transition-colors duration-200
              ${activeTab === tab ? "text-white" : "text-emerald-100/45 hover:bg-emerald-300/5 hover:text-emerald-100"}`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-1/2 h-[3px] w-16 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-500 shadow-[0_0_18px_rgba(52,211,153,0.55)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
