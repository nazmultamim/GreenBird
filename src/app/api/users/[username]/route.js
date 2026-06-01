import { NextResponse } from "next/server";
import { connect } from "../../../../lib/mongodb/mongoes";
import { getCurrentDbUser } from "../../../../lib/auth/current-user";
import User from "../../../../lib/models/user.model";

export const runtime = "nodejs";

export async function PATCH(request, { params }) {
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

  if (profileUser._id.toString() !== currentUser._id.toString()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  // allow updating select fields
  const updates = {};
  if (typeof body.bio === "string") updates.bio = body.bio.slice(0, 160);
  if (typeof body.avatar === "string") updates.avatar = body.avatar;
  if (typeof body.banner === "string") updates.banner = body.banner;
  if (typeof body.firstName === "string") updates.firstName = body.firstName;
  if (typeof body.lastName === "string") updates.lastName = body.lastName;

  Object.assign(profileUser, updates);
  await profileUser.save();

  return NextResponse.json({ user: profileUser });
}

export async function GET(_request, { params }) {
  await connect();
  const username = params.username?.toLowerCase();
  const profileUser = await User.findOne({ username }).select("username firstName lastName avatar banner bio followers following verificationBadge createdAt");

  if (!profileUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: profileUser });
}
