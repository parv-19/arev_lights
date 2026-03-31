import { v2 as cloudinary } from "cloudinary";

const REQUIRED_ENV_VARS = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    throw new Error(`Missing required Cloudinary environment variable: ${key}`);
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
}

/**
 * Upload a base64 or URL to Cloudinary and return a clean response.
 */
export async function uploadToCloudinary(
  file: string,
  folder = "arev-lights",
  resourceType: "image" | "video" | "raw" | "auto" = "image"
): Promise<{ url: string; publicId: string }> {
  if (!folder.startsWith("arev-lights")) {
    throw new Error("Invalid Cloudinary folder");
  }

  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: resourceType,
    overwrite: false,
  });
  return { url: result.secure_url, publicId: result.public_id };
}

/**
 * Delete an asset from Cloudinary by its public_id.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
