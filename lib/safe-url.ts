const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
const PUBLIC_EMBED_HOSTS = new Set([
  "www.google.com",
  "maps.google.com",
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "www.instagram.com",
  "instagram.com",
]);

function normalizeUrl(value?: string | null) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  try {
    return new URL(trimmed).toString();
  } catch {
    return null;
  }
}

export function getSafeHref(value?: string | null, fallback = "#") {
  const normalized = normalizeUrl(value);
  if (!normalized) return fallback;
  if (normalized.startsWith("/")) return normalized;

  try {
    const parsed = new URL(normalized);
    return ALLOWED_PROTOCOLS.has(parsed.protocol) ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
}

export function getSafeExternalHref(value?: string | null, fallback = "#") {
  const normalized = normalizeUrl(value);
  if (!normalized || normalized.startsWith("/")) return fallback;

  try {
    const parsed = new URL(normalized);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
}

export function getSafeEmailHref(value?: string | null, fallback = "mailto:arev.lights@gmail.com") {
  const email = value?.trim();
  if (!email || /[\r\n]/.test(email)) return fallback;
  return `mailto:${email}`;
}

export function getSafeTelHref(value?: string | null, fallback = "tel:+919274776616") {
  const normalized = value?.replace(/[^\d+]/g, "") ?? "";
  return normalized ? `tel:${normalized}` : fallback;
}

export function getSafeEmbedSrc(value?: string | null) {
  const normalized = normalizeUrl(value);
  if (!normalized || normalized.startsWith("/")) return null;

  try {
    const parsed = new URL(normalized);
    return PUBLIC_EMBED_HOSTS.has(parsed.hostname) ? parsed.toString() : null;
  } catch {
    return null;
  }
}
