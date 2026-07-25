import { createHash } from "node:crypto";

import { env } from "@/config/env";

export function getCloudinaryFolder(
  kind: "products" | "categories" | "collections" | "home" | "branding",
) {
  return `dazzling-diva/${kind}`;
}

export async function getCloudinaryConfigState() {
  return {
    configured: Boolean(
      env.Cloud_Name && env.Cloudinary_API_Key && env.Cloudinary_API_Secret,
    ),
    cloudName: env.Cloud_Name,
  };
}

function signParams(params: Record<string, string>) {
  const base = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${base}${env.Cloudinary_API_Secret}`)
    .digest("hex");
}

export async function uploadImageToCloudinary(file: File, folder: string) {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = signParams({ folder, timestamp });
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  formData.append("api_key", env.Cloudinary_API_Key);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${env.Cloud_Name}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed.");
  }

  return (await response.json()) as {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
}

export async function deleteImageFromCloudinary(publicId: string) {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = signParams({ public_id: publicId, timestamp });
  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", env.Cloudinary_API_Key);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${env.Cloud_Name}/image/destroy`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    throw new Error("Cloudinary delete failed.");
  }
}
