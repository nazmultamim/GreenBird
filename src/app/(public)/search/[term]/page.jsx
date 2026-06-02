import LeftSidebar from "../../../../components/layout/LeftSidebar";
import RightSidebar from "../../../../components/layout/RightSidebar";
import MobileTopNav from "../../../../components/layout/mobile/MobileTopNav";
import SearchResults from "../../../../components/search/SearchResults";

export async function generateMetadata({ params }) {
  const { term } = await params;
  const decoded = decodeURIComponent(term || "");

  return {
    title: `${decoded || "Search"} | Green Bird`,
    description: `Search results for ${decoded || "Green Bird"}.`,
  };
}

export default async function SearchTermPage({ params }) {
  const { term } = await params;
  const decoded = decodeURIComponent(term || "");

  return (
    <div className="min-h-screen text-foreground">
      <MobileTopNav />

      <div className="mx-auto flex max-w-[1420px] justify-center">
        <LeftSidebar />

        <main className="min-h-screen w-full max-w-[680px] border-x border-white/10 bg-[rgba(2,18,14,0.7)] pt-14 shadow-[0_0_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:pt-0">
          <SearchResults initialQuery={decoded} />
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
