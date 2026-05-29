import crypto from "crypto";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are missing.");
  }

  return { cloudName, apiKey, apiSecret };
}

export function createCloudinarySignature(params) {
  const { apiSecret } = getCloudinaryConfig();
  const signatureBase = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(signatureBase + apiSecret)
    .digest("hex");
}

export async function destroyCloudinaryAsset(publicId, resourceType = "image") {
  if (!publicId) return;

  const { cloudName, apiKey } = getCloudinaryConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    public_id: publicId,
    timestamp,
  };

  const form = new FormData();
  form.append("public_id", publicId);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", createCloudinarySignature(params));

  await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
    {
      method: "POST",
      body: form,
    }
  );
}

export function getCloudinaryUploadConfig() {
  const { cloudName, apiKey } = getCloudinaryConfig();

  return { cloudName, apiKey };
}
