import { NextResponse } from "next/server";
import {
  createCloudinarySignature,
  getCloudinaryUploadConfig,
} from "../../../../lib/cloudinary";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 80 * 1024 * 1024;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

export async function POST(request) {
  let cloudinary;

  try {
    cloudinary = getCloudinaryUploadConfig();
  } catch {
    return NextResponse.json(
      { error: "Cloudinary environment variables are missing." },
      { status: 500 }
    );
  }

  let form;

  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Upload request must be multipart form data." },
      { status: 400 }
    );
  }

  const file = form.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file was provided." }, { status: 400 });
  }

  const isVideo = file.type.startsWith("video/");
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  const maxSizeLabel = isVideo ? "500MB" : "80MB";

  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `File is larger than ${maxSizeLabel}.` },
      { status: 413 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const uploadParams = {
    folder: "greenbird/posts",
    timestamp,
  };

  const uploadForm = new FormData();
  uploadForm.append("file", file);
  uploadForm.append("api_key", cloudinary.apiKey);
  uploadForm.append("folder", uploadParams.folder);
  uploadForm.append("timestamp", String(timestamp));
  uploadForm.append("signature", createCloudinarySignature(uploadParams));

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/auto/upload`,
    {
      method: "POST",
      body: uploadForm,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data?.error?.message || "Cloudinary upload failed." },
      { status: response.status }
    );
  }

  return NextResponse.json({
    publicId: data.public_id,
    url: data.secure_url,
    resourceType: data.resource_type,
    format: data.format,
    width: data.width,
    height: data.height,
    bytes: data.bytes,
  });
}
