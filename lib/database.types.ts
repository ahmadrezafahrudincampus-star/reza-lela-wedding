export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type RsvpStatus = "pending" | "hadir" | "tidak_hadir" | "ragu";
export type AccountType = "bank" | "ewallet";

export interface Guest {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  invitation_token: string | null;
  opened_at: string | null;
  last_opened_at: string | null;
  open_count: number;
  rsvp_status: RsvpStatus | null;
  created_at: string;
  updated_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string | null;
  timezone: string;
  venue: string;
  address: string | null;
  google_maps_url: string | null;
  latitude: number | null;
  longitude: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BankAccount {
  id: string;
  type: AccountType;
  bank_name: string;
  account_number: string;
  account_holder: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AdminMessage {
  id: string;
  message: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GuestbookEntry {
  id: string;
  guest_id: string | null;
  guest_name: string;
  message: string;
  attendance_status: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface RsvpSubmission {
  id: string;
  guest_id: string | null;
  guest_name: string;
  attendance_status: "hadir" | "tidak_hadir" | "ragu";
  guest_count: number;
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  username: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}
