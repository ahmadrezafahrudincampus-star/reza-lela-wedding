import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeInstagramUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase().replace(/\/+$/, "");
  if (
    lower === "instagram.com" ||
    lower === "www.instagram.com" ||
    lower === "http://instagram.com" ||
    lower === "http://www.instagram.com" ||
    lower === "https://instagram.com" ||
    lower === "https://www.instagram.com"
  ) {
    return lower.startsWith("http") ? lower : `https://${lower}`;
  }

  if (trimmed.startsWith("@")) {
    const handle = trimmed.slice(1).trim();
    return handle ? `https://instagram.com/${handle}` : "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (
    trimmed.toLowerCase().startsWith("instagram.com/") ||
    trimmed.toLowerCase().startsWith("www.instagram.com/")
  ) {
    return `https://${trimmed}`;
  }

  if (/^[a-zA-Z0-9._]+$/.test(trimmed)) {
    return `https://instagram.com/${trimmed}`;
  }

  return `https://${trimmed}`;
}

export function isValidInstagramUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const normalized = normalizeInstagramUrl(url);
  if (!normalized) return false;

  const lower = normalized.toLowerCase().replace(/\/+$/, "");
  if (
    lower === "https://instagram.com" ||
    lower === "https://www.instagram.com" ||
    lower === "http://instagram.com" ||
    lower === "http://www.instagram.com"
  ) {
    return false;
  }

  try {
    const parsed = new URL(normalized);
    const host = parsed.hostname.toLowerCase();
    if (host !== "instagram.com" && host !== "www.instagram.com") {
      return false;
    }
    const path = parsed.pathname.replace(/^\/+|\/+$/g, "");
    return path.length > 0;
  } catch {
    return false;
  }
}

