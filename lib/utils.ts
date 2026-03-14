/**
 * Generate a URL-friendly slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

/**
 * Format a date to a readable string.
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Truncate a string to a given max length.
 */
export function truncate(str: string, maxLength = 120): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + "…";
}

/**
 * Get the primary image from a product images array, or a fallback.
 */
export function getPrimaryImage(
  images: { url: string; isPrimary?: boolean }[],
  fallback = "/images/placeholder.jpg"
): string {
  if (!images?.length) return fallback;
  const primary = images.find((img) => img.isPrimary);
  return primary?.url || images[0]?.url || fallback;
}

/**
 * Build a WhatsApp link with a pre-filled message.
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encoded}`;
}

/**
 * Simple class name merger (replacement for cn/clsx).
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Upload a file to Cloudinary via the /api/upload endpoint.
 */
export async function uploadFile(
  file: File,
  folder = "arev-lights",
  resourceType: "image" | "raw" | "auto" = "image"
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  formData.append("resourceType", resourceType);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const result = await res.json();
  if (!result.success) throw new Error(result.message || "Upload failed");
  return result.data;
}
