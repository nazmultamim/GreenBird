
import LeftSidebar from "../../../../../components/layout/LeftSidebar";
import RightSidebar from "../../../../../components/layout/RightSidebar";
import MobileTopNav from "../../../../../components/layout/mobile/MobileTopNav";
import Link from "next/link";
import FollowButton from "../../../../../components/profile/FollowButton";
import { notFound } from "next/navigation";
import { connect } from "../../../../../lib/mongodb/mongoes";
import { getCurrentDbUser } from "../../../../../lib/auth/current-user";
import User from "../../../../../lib/models/user.model";
import BackButton from "../../../../../components/ui/BackBtn";

function getDisplayName(user) {
  return user.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user.username;
}

export default async function FollowingPage({ params }) {
  const username = String((await params).username || "").toLowerCase();

  await connect();

  const profileUser = await User.findOne({ username }).lean();
  if (!profileUser) notFound();

  const currentUser = await getCurrentDbUser().catch(() => null);

  const following = await User.find({
    _id: { $in: profileUser.following || [] },
  }).lean();

  const currentFollowingSet = new Set(
    (currentUser?.following || []).map((id) => id.toString())
  );

  const displayName = getDisplayName(profileUser);

  return (
    <div className="min-h-screen">
      <MobileTopNav />

      <div className="mx-auto flex max-w-[1420px]">
        <LeftSidebar />

        {/* MAIN */}
        <main className="w-full max-w-[680px] border-x border-emerald-500/10 backdrop-blur-xl mt-14 sm:mt-0">

          {/* HEADER */}
          <div className="sticky top-0 z-20 flex items-center border-b border-emerald-500/10 bg-black/10 backdrop-blur-xl">
           <span className="ml-2"><BackButton /></span>
            <div className="px-4 py-4">
              <h1 className="text-lg font-bold tracking-tight">
                {displayName}
              </h1>
              <p className="text-sm text-gray-400">
                Following · {following.length}
              </p>
            </div>
          </div>

          {/* LIST */}
          <div className="px-3 py-4 space-y-3">

            {following.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-500/10 bg-white/[0.02] py-14 text-center">
                <p className="text-lg font-semibold text-white">
                  No following yet
                </p>
                <p className="mt-2 text-sm text-emerald-300/50 max-w-xs">
                  When {displayName} follows people, they’ll show up here.
                </p>
              </div>
            ) : (
              following.map((u) => {
                const name = getDisplayName(u);
                const isFollowing = currentFollowingSet.has(
                  u._id?.toString()
                );

                return (
                  <div
                    key={u._id}
                    className="group relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-4 transition-all duration-300 hover:border-emerald-400/30 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center justify-between gap-4 w-full">

                      {/* AVATAR */}
                      <Link href={`/user/${u.username}`}>
                        <img
                          src={u.avatar || "/default-avatar.png"}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-400/20 transition group-hover:ring-emerald-400/40"
                        />
                      </Link>

                      {/* INFO */}
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/user/${u.username}`}
                          className="block"
                        >
                          <p className="truncate font-semibold text-white group-hover:underline">
                            {name}
                          </p>
                          <p className="text-sm text-gray-400">
                            @{u.username}
                          </p>
                        </Link>
                      </div>

                      {/* ACTION */}
                      <div className="shrink-0">
                        <FollowButton
                          username={u.username}
                          initialFollowing={isFollowing}
                          initialCount={u.followers?.length || 0}
                        />
                      </div>
                    </div>

                    {/* subtle hover glow */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                      <div className="absolute inset-0 bg-emerald-400/5 blur-xl" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}