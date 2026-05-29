import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient } from "@clerk/nextjs/server";
import { createOrUpdateUser, deleteUser } from "../../../lib/actions/user";


export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing WEBHOOK_SECRET");
  }

  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (!evt?.data || !evt?.type) {
    return new Response("Invalid event", { status: 400 });
  }

  const eventType = evt.type;
  const data = evt.data;

  console.log(`Webhook event: ${eventType}`);

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const user = await createOrUpdateUser(
        data.id,
        data.first_name,
        data.last_name,
        data.image_url,
        data.email_addresses,
        data.username
      );

      if (user?._id && eventType === "user.created") {
        const client = await clerkClient();

        await client.users.updateUserMetadata(data.id, {
          publicMetadata: {
            userMongoId: user._id,
          },
        });
      }
    }

    if (eventType === "user.deleted") {
      await deleteUser(data.id);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response("Server error", { status: 500 });
  }
}