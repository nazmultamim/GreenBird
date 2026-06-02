import LeftSidebar from "../../../components/layout/LeftSidebar";
import RightSidebar from "../../../components/layout/RightSidebar";
import MobileTopNav from "../../../components/layout/mobile/MobileTopNav";
import NotificationCenter from "../../../components/notifications/NotificationCenter";

export const metadata = {
  title: "Notifications",
  description: "Follow alerts and post updates on Green Bird.",
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen text-foreground">
      <MobileTopNav />

      <div className="mx-auto flex max-w-[1420px] justify-center">
        <LeftSidebar />

        <main className="min-h-screen w-full max-w-[680px] border-x border-white/10 bg-[rgba(2,18,14,0.7)] pt-14 shadow-[0_0_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:pt-0">
          <NotificationCenter />
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
