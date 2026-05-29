import { auth, clerkClient } from "@clerk/nextjs/server";
import User from "../models/user.model";
import { connect } from "../mongodb/mongoes";

export async function getCurrentDbUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  await connect();

  let user = await User.findOne({ clerkId: userId });

  if (user) {
    return user;
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  const username =
    clerkUser.username?.toLowerCase()?.trim() || `user_${userId.slice(-6)}`;

  user = await User.findOneAndUpdate(
    { clerkId: userId },
    {
      $set: {
        email: email || `${userId}@greenbird.local`,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        username,
        avatar: clerkUser.imageUrl || "",
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return user;
}
