import { NextRequest, NextResponse } from "next/server";

const MAX_JSON_BYTES = 1024 * 1024;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;

type RateLimitState = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitState>();

const SENSITIVE_QUERY_KEYS = new Set([
  "token",
  "access_token",
  "refresh_token",
  "id_token",
  "secret",
  "api_key",
  "apikey",
  "key",
  "password",
  "signature",
]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function sanitizeString(value: string) {
  return escapeHtml(value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim());
}

export function sanitizeUnknown<T>(value: T): T {
  if (typeof value === "string") {
    return sanitizeString(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeUnknown(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, currentValue]) => [key, sanitizeUnknown(currentValue)])
    ) as T;
  }

  return value;
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function assertSafeQueryParams(req: NextRequest) {
  for (const key of req.nextUrl.searchParams.keys()) {
    if (SENSITIVE_QUERY_KEYS.has(key.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: "Sensitive data must not be sent in the URL." },
        { status: 400 }
      );
    }
  }

  return null;
}

export function enforceContentLength(req: NextRequest, maxBytes = MAX_JSON_BYTES) {
  const contentLength = req.headers.get("content-length");
  if (!contentLength) return null;

  const parsedLength = Number.parseInt(contentLength, 10);
  if (Number.isNaN(parsedLength) || parsedLength <= maxBytes) return null;

  return NextResponse.json(
    { success: false, message: "Request body is too large." },
    { status: 413 }
  );
}

export function enforceUploadSize(size: number, maxBytes = MAX_UPLOAD_BYTES) {
  if (size <= maxBytes) return null;

  return NextResponse.json(
    { success: false, message: "Uploaded file is too large." },
    { status: 413 }
  );
}

export function checkRateLimit(req: NextRequest, bucket: string, limit: number) {
  const now = Date.now();
  const key = `${bucket}:${getClientIp(req)}`;
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  if (current.count >= limit) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((current.resetAt - now) / 1000)),
        },
      }
    );
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return null;
}
