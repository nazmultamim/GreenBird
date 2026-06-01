import { NextResponse } from "next/server";
import { connect } from "../../../../../lib/mongodb/mongoes";
import { getCurrentDbUser } from "../../../../../lib/auth/current-user";
import User from "../../../../../lib/models/user.model";

export async function POST(_request, { params }) {
  const currentUser = await getCurrentDbUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connect();

  const username = params.username?.toLowerCase();
  const profileUser = await User.findOne({ username });

  if (!profileUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (profileUser._id.toString() === currentUser._id.toString()) {
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
  }

  const alreadyFollowing = currentUser.following?.some(
    (id) => id.toString() === profileUser._id.toString()
  );

  if (alreadyFollowing) {
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: profileUser._id },
    });
    await User.findByIdAndUpdate(profileUser._id, {
      $pull: { followers: currentUser._id },
    });
  } else {
    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { following: profileUser._id },
    });
    await User.findByIdAndUpdate(profileUser._id, {
      $addToSet: { followers: currentUser._id },
    });
  }

  const refreshedProfileUser = await User.findById(profileUser._id).select("followers");

  return NextResponse.json({
    followed: !alreadyFollowing,
    followersCount: refreshedProfileUser.followers.length,
  });
}
