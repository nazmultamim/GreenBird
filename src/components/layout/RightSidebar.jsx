import { Search, MoreHorizontal, X, ShieldCheck, TrendingUp } from "lucide-react";

const news = [
  {
    title: "AI startups see record funding as global demand surges",
    time: "2h ago",
    category: "Technology",
    posts: "18.2K posts",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
  },
  {
    title: "Oil prices climb amid rising geopolitical tensions",
    time: "4h ago",
    category: "Business",
    posts: "9,430 posts",
    image: "https://images.unsplash.com/photo-1581093588401-22c9b9d6c4c9"
  },
  {
    title: "New study reveals major climate change tipping points",
    time: "6h ago",
    category: "Science",
    posts: "12.7K posts",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    title: "Champions League final draws record global audience",
    time: "8h ago",
    category: "Sports",
    posts: "22.1K posts",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2"
  },
  {
    title: "Major social platform rolls out new creator monetization tools",
    time: "10h ago",
    category: "Social",
    posts: "7,820 posts",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868"
  }
];

const trends = [
  {
    category: "Technology · Trending",
    title: "#AIRevolution",
    posts: "120K posts"
  },
  {
    category: "Politics · Trending",
    title: "Election 2026",
    posts: "85.4K posts"
  },
  {
    category: "Sports · Trending",
    title: "UCL Final",
    posts: "64.2K posts"
  },
  {
    category: "Entertainment · Trending",
    title: "New Marvel Trailer",
    posts: "41.8K posts"
  },
  {
    category: "Business · Trending",
    title: "Stock Market Crash",
    posts: "29.3K posts"
  }
];

const whoToFollow = [
  {
    name: "Sarah Johnson",
    handle: "sarahcodes",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Michael Chen",
    handle: "mikebuilds",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Aisha Rahman",
    handle: "aishatech",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    name: "David Kim",
    handle: "devdavid",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg"
  }
];

export default function RightSidebar() {
  return (
    <aside className="hidden lg:block w-[370px] shrink-0 px-6 py-2 space-y-4 sticky top-0 h-screen overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className=" top-0 pt-1 pb-2 z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search"
            className="w-full rounded-full border border-emerald-300/20 bg-emerald-950/30 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-300/60 focus:bg-background focus:ring-1 focus:ring-emerald-300/40"
          />
        </div>
      </div>

      <div className="emerald-panel rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-extrabold">Subscribe to Premium</h2>
          <span className="bg-emerald-300/12 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded text-nowrap">50% off</span>
        </div>
        <p className="text-sm mb-3 text-emerald-50/72">Get rid of ads, see your analytics, boost your replies and unlock 20+ features.</p>
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-emerald-100/70">
          <span className="flex items-center gap-1.5 rounded-lg border border-emerald-300/12 bg-black/10 px-2 py-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            Verified reach
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-emerald-300/12 bg-black/10 px-2 py-2">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
            Pro analytics
          </span>
        </div>
        <button className="premium-button font-bold rounded-full px-4 py-1.5 hover:opacity-90 transition-opacity cursor-pointer">
          Subscribe
        </button>
      </div>

      <div className="emerald-panel overflow-hidden rounded-xl">
        <div className="flex items-center justify-between p-4 pb-2">
          <h2 className="text-xl font-extrabold">Today's News</h2>
          <button className="p-1 rounded-full hover:bg-emerald-300/10"><X className="w-4 h-4" /></button>
        </div>
        {news.map((n, i) => (
          <button key={i} className="w-full text-left flex gap-3 p-4 hover:bg-emerald-300/8 transition-colors backdrop-blur-sm last:rounded-b-xl">
            <img src={n.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[15px] leading-snug line-clamp-2">{n.title}</p>
              <p className="text-muted-foreground text-xs mt-1">{n.time} · {n.category} · {n.posts}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="emerald-panel overflow-hidden rounded-xl">
        <h2 className="text-xl font-extrabold p-4 pb-2">What's happening</h2>
        {trends.map((t, i) => (
          <button key={i} className="w-full text-left flex items-start justify-between p-4 hover:bg-emerald-300/8 transition-colors backdrop-blur-sm">
            <div>
              <p className="text-xs text-muted-foreground">{t.category}</p>
              <p className="font-bold text-[15px]">{t.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.posts}</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
        <button className="w-full text-left p-4 text-emerald-300 hover:bg-emerald-300/10 transition-colors rounded-b-xl text-sm">
          Show more
        </button>
      </div>

      <div className="emerald-panel overflow-hidden rounded-xl backdrop-blur-sm">
        <h2 className="text-xl font-extrabold p-4 pb-2">Who to follow</h2>
        {whoToFollow.map((u) => (
          <div key={u.handle} className="flex items-center gap-3 p-4 hover:bg-emerald-300/8 transition-colors backdrop-blur-sm">
            <img src={u.avatar} alt="" className="w-10 h-10 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{u.name}</p>
              <p className="text-muted-foreground text-sm truncate">@{u.handle}</p>
            </div>
            <button className="bg-emerald-50 text-[#00140f] font-bold rounded-full px-4 py-1.5 text-sm hover:bg-emerald-100 transition-colors cursor-pointer">
              Follow
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground px-2">© 2026 Green Bird</p>
    </aside>
  );
}
