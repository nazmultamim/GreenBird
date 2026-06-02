import { NextResponse } from "next/server";
import { connect } from "../../../../lib/mongodb/mongoes";
import { getCurrentDbUser } from "../../../../lib/auth/current-user";

export const runtime = "nodejs";

export async function GET() {
  try {
    const currentUser = await getCurrentDbUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const user = await require("../../../../lib/models/user.model").default
      .findById(currentUser._id)
      .select("username firstName lastName avatar bio verificationBadge followers following");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
