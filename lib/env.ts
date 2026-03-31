const FALLBACK_SITE_URL = "https://arevlights.com";

function normalizeUrl(value?: string | null) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  return (
    normalizeUrl(process.env.NEXTAUTH_URL) ??
    normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeUrl(process.env.VERCEL_URL) ??
    normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    FALLBACK_SITE_URL
  );
}

export function getAllowedOrigins() {
  const originSet = new Set<string>(["http://localhost:3000", "http://127.0.0.1:3000"]);

  for (const value of [
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ]) {
    const normalized = normalizeUrl(value);
    if (normalized) originSet.add(normalized);
  }

  return Array.from(originSet);
}

export function isAllowedOrigin(origin: string | null) {
  if (!origin) return false;

  const normalizedOrigin = normalizeUrl(origin);
  if (!normalizedOrigin) return false;

  if (getAllowedOrigins().includes(normalizedOrigin)) {
    return true;
  }

  try {
    const parsedOrigin = new URL(normalizedOrigin);
    return parsedOrigin.protocol === "https:" && parsedOrigin.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}
