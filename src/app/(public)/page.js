import Feed from '../../components/feed/Feed'
import LeftSidebar from '../../components/layout/LeftSidebar'
import RightSidebar from '../../components/layout/RightSidebar'
import MobileTopNav from '../../components/layout/mobile/MobileTopNav'

function page() {
  return (
    <div className="app-shell min-h-screen text-foreground dark">
      {/* Mobile nav - invisible on sm and above */}
      <MobileTopNav />

      <div className="flex max-w-[1420px] mx-auto justify-center">
        <LeftSidebar />
        <Feed />
        <RightSidebar />
      </div>
    </div>
  )
}

export default page;
