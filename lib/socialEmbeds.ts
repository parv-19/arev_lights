const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i;

export function isYouTubeUrl(url: string) {
  return /youtube\.com|youtu\.be/i.test(url);
}

export function getYouTubeEmbedUrl(url: string): string {
  const ytMatch = url.match(YOUTUBE_ID_PATTERN);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
  }

  return url;
}

export function isInstagramUrl(url: string) {
  return /instagram\.com/i.test(url);
}

export function normalizeInstagramUrl(url: string) {
  const fallback = url.split("?")[0].replace(/\/?$/, "/");

  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);

    if (parts.length === 0) {
      return fallback;
    }

    return `https://www.instagram.com/${parts.join("/")}/`;
  } catch {
    return fallback;
  }
}

export function getInstagramHandle(url?: string) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const [firstPart] = parsed.pathname.split("/").filter(Boolean);

    if (!firstPart || ["reel", "p", "tv", "stories", "guide"].includes(firstPart)) {
      return "";
    }

    return `@${firstPart}`;
  } catch {
    return "";
  }
}
