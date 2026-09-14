import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Checks if Supabase credentials are validly configured (not blank and not placeholder)
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes("your-project.supabase.co") &&
      !supabaseAnonKey.includes("your-anon-key")
  );
}

// Browser / Public Supabase client
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Server-side / Admin client with Service Role Key (if available)
export function getServiceSupabase(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  return createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    serviceKey || "placeholder-key",
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

/**
 * Utility: Clean and generate a URL-safe slug from a guest name.
 * Handles titles, special characters, and Indonesian honorifics.
 */
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    // Replace dots, slashes, ampersands, commas, parentheses with space
    .replace(/[./\\&,+()_-]/g, " ")
    // Replace multiple spaces with single hyphen
    .replace(/\s+/g, "-")
    // Remove characters that aren't alphanumeric or hyphen
    .replace(/[^a-z0-9-]/g, "")
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, "") || "tamu";
}

/**
 * Utility: Normalize WhatsApp phone number to international 62... format
 */
export function normalizePhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }
  if (digits.startsWith("62")) {
    return digits;
  }
  return `62${digits}`;
}
