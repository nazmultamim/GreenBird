import LeftSidebar from "../../../components/layout/LeftSidebar";
import RightSidebar from "../../../components/layout/RightSidebar";
import MobileTopNav from "../../../components/layout/mobile/MobileTopNav";
import SearchResults from "../../../components/search/SearchResults";

export const metadata = {
  title: "Search",
  description: "Discover posts and people on Green Bird.",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen text-foreground">
      <MobileTopNav />

      <div className="mx-auto flex max-w-[1420px] justify-center">
        <LeftSidebar />

        <main className="min-h-screen w-full max-w-[680px] border-x border-white/10 bg-[rgba(2,18,14,0.7)] pt-14 shadow-[0_0_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:pt-0">
          <SearchResults initialQuery="" />
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
