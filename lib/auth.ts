import { cookies } from "next/headers";
import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "wedding_admin_session";
const SESSION_SECRET = process.env.ADMIN_SECRET_KEY || "wedding-admin-super-secure-session-key-2026";

export interface AdminSession {
  username: string;
  expiresAt: number;
}

/**
 * Creates a signed session token
 */
export function createSessionToken(username: string): string {
  // Session valid for 7 days
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ username, expiresAt })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

/**
 * Verifies a signed session token
 */
export function verifySessionToken(token: string | undefined | null): AdminSession | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as AdminSession;
    if (Date.now() > data.expiresAt) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Server-side helper to check if admin is authenticated via cookies
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
