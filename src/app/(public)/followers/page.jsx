import LeftSidebar from "../../../components/layout/LeftSidebar";
import RightSidebar from "../../../components/layout/RightSidebar";
import MobileTopNav from "../../../components/layout/mobile/MobileTopNav";
import Link from "next/link";
import FollowButton from "../../../components/profile/FollowButton";
import { connect } from "../../../lib/mongodb/mongoes";
import { getCurrentDbUser } from "../../../lib/auth/current-user";
import User from "../../../lib/models/user.model";

export default async function FollowersPage() {
  await connect();
  const currentUser = await getCurrentDbUser().catch(() => null);

  if (!currentUser) {
    return (
      <div className="min-h-screen text-foreground">
        <MobileTopNav />
        <div className="mx-auto flex max-w-[1420px] justify-center">
          <LeftSidebar />
          <main className="min-h-screen w-full max-w-[680px] border-x emerald-divider bg-[#02120e]/70 p-6">
            <p className="text-sm text-emerald-100/60">Please sign in to see your followers.</p>
          </main>
          <RightSidebar />
        </div>
      </div>
    );
  }

  const followers = await User.find({ _id: { $in: currentUser.followers || [] } }).lean();

  return (
    <div className="min-h-screen text-foreground">
      <MobileTopNav />

      <div className="mx-auto flex max-w-[1420px] justify-center">
        <LeftSidebar />

        <main className="min-h-screen w-full max-w-[680px] border-x emerald-divider bg-[#02120e]/70 pt-14 pb-10 shadow-[0_0_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:pt-0">
          <div className="p-4">
            <h1 className="text-xl font-bold text-white">Followers</h1>
            <p className="mt-2 text-sm text-emerald-100/60">People who follow you</p>

            <div className="mt-6 space-y-3">
              {followers.length === 0 ? (
                <div className="text-emerald-100/60">No followers yet.</div>
              ) : (
                followers.map((u) => (
                  <div key={u._id} className="flex items-center gap-3 rounded-md p-3 hover:bg-white/2">
                    <Link href={`/user/${u.username}`} className="flex items-center gap-3 flex-1">
                      <img src={u.avatar || "/default-avatar.png"} className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{u.firstName ? `${u.firstName} ${u.lastName || ""}`.trim() : u.username}</span>
                          <span className="text-emerald-100/60">@{u.username}</span>
                        </div>
                        <p className="text-sm text-emerald-100/60 mt-1">{u.bio}</p>
                      </div>
                    </Link>
                    <div>
                      <FollowButton username={u.username} initialFollowing={false} initialCount={u.followers?.length || 0} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
