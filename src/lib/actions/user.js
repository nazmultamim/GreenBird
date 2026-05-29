import User from "../models/user.model";
import { connect } from "../mongodb/mongoes";

export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email_addresses,
  username
) => {
  try {
    await connect();

    const email = email_addresses?.[0]?.email_address;

    if (!email) {
      throw new Error("Email missing from Clerk payload");
    }

    const safeUsername =
      username?.toLowerCase()?.trim() || `user_${id.slice(-6)}`;

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name || "",
          lastName: last_name || "",
          avatar: image_url || "",
          email,
          username: safeUsername,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return user;
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await connect();

    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};