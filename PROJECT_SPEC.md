# PROJECT SPECIFICATION: WEDDING INVITATION WEB APPLICATION

## 1. Project Overview & Architectural Vision
This project is a high-performance, responsive digital wedding invitation application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. It is reverse-engineered from an Elementor/WordPress reference site (`Motion Art Burgundy`) and reimagined as a clean, decoupled, and reusable modern web application.

### Key Tenets
1. **Zero Legacy Overhead**: Completely free from WordPress, Elementor, WeddingPress, jQuery, and extraneous third-party bloat.
2. **Mobile-First Luxury Experience**: Designed primarily for mobile smartphone screens (where 98%+ wedding invitations are viewed), while gracefully adapting to tablets and desktops.
3. **Desktop Presentation Model**: Rather than expanding into an awkward desktop layout, desktop displays an artistic split screen: a fixed left branding/prewedding banner paired with an elegant, centered portrait mobile invitation frame (`max-w-[480px]`).
4. **Data-Driven Architecture**: Every couple, event, bank, and greeting detail is decoupled from UI components into strongly-typed configuration in `data/wedding.ts`.
5. **Fluid, Romantic Animations**: Recreated using hardware-accelerated Framer Motion instead of heavy AOS or CSS-class spaghetti.

---

## 2. Complete Section Inventory & Order

Based on thorough inspection of the reference DOM tree, the invitation consists of the following 14 distinct sections and elements:

> **Note:** Live Streaming is **not used** in this wedding invitation. The feature has been intentionally excluded from the project.

| # | Section Name | Key Purpose & Content | Visual & Interactive Behavior |
|---|--------------|------------------------|--------------------------------|
| **1** | **Cover / Opening Screen** | Fullscreen welcome screen displaying wedding title, recipient greeting (*"Kepada Yth. Bapak/Ibu/Saudara/i: [Nama Tamu]"*), and the primary CTA button *"Buka Undangan"*. | Prevents background scrolling until unlocked. Clicking button starts music playback, unlocks body scrolling, reveals the floating music toggle, and smoothly scrolls into the Hero section. |
| **2** | **Hero Section (`#bukaUndangan`)** | Cinematic entry section displaying couple names (*"The Wedding of Dilan & Milea"*) and wedding date. | Full-height container with video background or hero imagery. Text elements animate in using a graceful delayed zoom-in transition. |
| **3** | **Quote Section** | Spiritual foundation featuring a decorative monogram (*"D & M"*) and holy Quranic verse (QS. Ar-Rum: 21). | Centered typography with calligraphic script accents and clean citation footer. |
| **4** | **Couple Profiles** | Introductions for the Groom (*Ahmad Reza Fahrudin / Reza*) and Bride (*Laila Nur A'immah / Lela*), detailing parent names and social links (Instagram). | Card-based layout with portrait frames, elegant typography, ampersand separator, and rounded social icon buttons. |
| **5** | **Prewedding Slideshow** | Visual divider showcasing prewedding photography. | Smooth cross-fade transition carousel acting as an atmospheric breather between sections. |
| **6** | **Countdown & Save the Date** | Real-time countdown timer (Hari, Jam, Menit, Detik) and Google Calendar integration. | 4-block countdown digits grid + CTA button *"Simpan Tanggal"* linking directly to a pre-filled Google Calendar event. |
| **7** | **Event Information** | Detailed cards for **Akad Nikah** and **Resepsi Pernikahan**. Shows day, date, time (*WIB*), venue name, and address. | Distinct event cards with custom date pill, map pin icon, and Google Maps direction button. |
| **8** | **Gift & Cashless Angpao** | Digital gift options via direct bank transfer (BCA, Mandiri) and physical gift delivery address. | Account cards with bank logos/names, account numbers, account holder name, and instant *"Salin No. Rekening"* / *"Salin Alamat"* copy-to-clipboard button with copied toast/feedback. |
| **9** | **Photo Gallery** | Curated collection of prewedding and engagement photos. | 2-column mobile masonry grid with subtle hover overlays and lightbox modal support for full-screen inspection. |
| **10** | **Love Story** | Chronological timeline of the couple's relationship milestones (e.g., First Met, Engagement, The Proposal). | Alternating or vertical timeline cards with dates and narrative blurbs. |
| **11** | **RSVP Form** | Guest attendance confirmation. | Input fields: Guest Name, Attendance Confirmation (*Hadir / Tidak Hadir / Masih Ragu*), Number of Guests, and Wishes textarea with submit handler. |
| **12** | **Guest Book / Wishes Stream** | Public board of blessings, messages, and prayers left by guests. | Scrollable list of comments with initial avatars, attendance status badge (Green = Hadir, Red = Tidak Hadir, Amber = Masih Ragu), timestamp, and text. |
| **13** | **Closing & Gratitude** | Heartfelt closing prayer, thank you note from the couple and family, and romantic farewell. | Centered typography, decorative monogram, and subtle creator attribution watermark. |
| **14** | **Floating Music Player** | Persistent audio controller available throughout the entire invitation journey. | Fixed floating circular button in bottom corner. Slides up when cover is opened. Continuously rotates while music plays; toggles play/pause on click. |

---

## 3. Visual Identity & Design Tokens

### 3.1 Color Palette
The aesthetic is anchored in a luxurious **Burgundy & Warm Rose** palette:

| Token Name | Hex Code | Purpose |
|------------|----------|---------|
| `burgundy-primary` | `#3D0F20` | Primary brand color, headers, hero backgrounds, primary CTAs |
| `burgundy-medium` | `#531E32` | Secondary cards, borders, rich gradients |
| `burgundy-accent` | `#7E2546` | Button hover states, accent borders, highlights |
| `burgundy-deep` | `#2C0A17` | Deep contrast backgrounds, dark overlays |
| `rose-tint` | `#FFF4F3` | Soft card background, subtle section alternate tint |
| `sage-accent` | `#6D8554` | Nature/floral accents, attending status badge |
| `text-dark` | `#1D1D1D` | Primary body typography for high legibility |
| `text-muted` | `#6B7280` | Parent descriptions, labels, timestamps |
| `white` | `#FFFFFF` | Card surfaces, button text on dark backgrounds |

### 3.2 Typography Hierarchy
- **Calligraphic Script**: `Pinyon Script` (Google Fonts)
  - Used for couple initials, decorative monograms (*"D & M"*, *"R & L"*), and romantic hero subheadings.
- **Classical Serif**: `Cormorant Infant` (Google Fonts)
  - Used for couple names (*"Ahmad Reza & Laila"*), section titles (*"Save the Date"*, *"Akad Nikah"*), and Quranic quotes.
- **Modern Sans-serif**: `Poppins` (Google Fonts)
  - Used for body copy, buttons, badges, countdown digits, addresses, and form controls for optimal readability on mobile screens.

### 3.3 Spacing & Border Radii
- Base container max-width: `480px` (or `max-w-md` / `max-w-[480px]`) centered.
- Section padding: `py-16 px-6` (generous vertical rhythm).
- Card radii: `rounded-2xl` and `rounded-3xl` for soft, elegant, wedding-invitation aesthetic.
- Shadow tokens: Soft ambient drop shadows (`shadow-sm`, `shadow-md`, `shadow-xl` with low opacity black/burgundy tints).

---

## 4. Key Interactive Behaviors

### 4.1 Opening Cover & Scroll Unlock
1. Initially, document scrolling is locked (`overflow: hidden`).
2. The user sees a centered cover card with couple names and recipient name dynamically retrieved from URL query parameters (e.g., `?to=Nama+Tamu`) or fallback data.
3. Clicking *"Buka Undangan"*:
   - Initiates audio playback via the `<audio>` controller.
   - Smoothly scrolls the viewport into the Hero section (`#bukaUndangan`).
   - Unlocks document scrolling (`overflow: auto`).
   - Floats in the music control button from below with an ease transition.

### 4.2 Floating Music Toggle
- Position: Fixed at bottom-right or bottom-left (`fixed bottom-6 right-6 z-50`).
- Visual: Circular disc with audio wave or disc icon.
- Spin animation: Rotates continuously at a relaxing tempo (e.g., 4s per revolution) while playing; stops rotating when paused.
- Tap interaction: Directly toggles audio `play()` and `pause()`.

### 4.3 Copy to Clipboard
- Used in the Gift section for Bank Account numbers and Shipping Address.
- Clicking the copy button copies text using `navigator.clipboard.writeText()`.
- Provides instant tactile UI feedback: button text changes to *"Tersalin ✓"* for 2 seconds before reverting.

### 4.4 Save to Google Calendar
- Formats date string into ISO standard UTC: `20260926T020000Z/20260926T070000Z`.
- Opens standard Google Calendar template URL in a new tab with pre-filled title, details, and location.

---

## 5. Responsive Layout Strategy

### Mobile Viewport (< 768px)
- The entire application behaves as a full-bleed, vertically flowing mobile story.
- Content fills `100vw` with appropriate horizontal gutter padding (`px-4` to `px-6`).
- Cover is fullscreen `100dvh`.

### Desktop Viewport (>= 768px)
- The application adopts a premium two-pane or framed layout:
  - **Left Pane**: Fixed artistic backdrop featuring a prewedding portrait, couple monogram, date, and greeting.
  - **Right Pane / Center Frame**: A scrollable portrait invitation container (`max-w-[480px]` / `w-[450px]`) that preserves the exact mobile layout intended for the wedding invitation.
- This approach prevents mobile wedding invitations from looking stretched or broken on wide desktop monitors.
