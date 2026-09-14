# Wedding Invitation Web Application

A modern, high-performance, and responsive digital wedding invitation application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with custom Burgundy & Warm Rose design tokens
- **Typography**: Google Fonts via `next/font/google` (`Poppins`, `Cormorant Infant`, `Pinyon Script`)
- **Animation System**: Framer Motion with custom hardware-accelerated `<Reveal />` component
- **Icons**: Lucide React

---

## 📁 Project Structure

```
project/
├── app/
│   ├── globals.css         # Tailwind base, components, utilities & custom scrollbars
│   ├── layout.tsx          # Root layout, Google Fonts integration & metadata
│   └── page.tsx            # Foundation verification & preview page
│
├── components/
│   ├── ui/
│   │   └── Reveal.tsx      # Reusable Framer Motion animation engine
│   │
│   └── wedding/            # Modular wedding sections (Phase 6+)
│       ├── Cover.tsx
│       ├── Hero.tsx
│       ├── Quote.tsx
│       ├── Couple.tsx
│       ├── Countdown.tsx
│       ├── Event.tsx
│       ├── Story.tsx
│       ├── Gallery.tsx
│       ├── Video.tsx
│       ├── Gift.tsx
│       ├── RSVP.tsx
│       ├── GuestBook.tsx
│       ├── Closing.tsx
│       └── MusicPlayer.tsx
│
├── data/
│   └── wedding.ts          # Strongly-typed central configuration for all wedding data
│
├── lib/
│   └── utils.ts            # clsx & tailwind-merge helper
│
├── public/
│   ├── images/             # Prewedding photos & graphical assets
│   ├── music/              # Background audio tracks
│   └── fonts/              # Custom local fonts (if applicable)
│
├── PROJECT_SPEC.md         # Full design & section architecture specification
├── ANIMATION_SPEC.md       # Comprehensive animation inventory & Framer Motion specs
└── README.md               # Project documentation
```

---

## 🎨 Design System & Typography

### Typography
- **Romantic Script**: `Pinyon Script` — Monograms, initials, romantic accents.
- **Classical Serif**: `Cormorant Infant` — Section titles, couple names, religious verses.
- **Modern Sans**: `Poppins` — Body text, buttons, metadata, countdown numbers.

### Color Palette
- **Primary Burgundy**: `#3D0F20`
- **Medium Burgundy**: `#531E32`
- **Rose Accent Tint**: `#FFF4F3`
- **Sage Olive Accent**: `#6D8554`
- **Dark Neutral**: `#1D1D1D`

---

## ⚡ Animation System: `<Reveal />`

The project includes a unified Framer Motion animation component in `components/ui/Reveal.tsx`.

### Supported Variants
- `fade`
- `fade-up`
- `fade-down`
- `fade-left`
- `fade-right`
- `zoom-in`
- `zoom-out`
- `zoom-in-up`
- `zoom-in-down`

### Usage Example
```tsx
import { Reveal } from "@/components/ui/Reveal";

export function Section() {
  return (
    <Reveal animation="zoom-in-up" duration={0.9} delay={0.2}>
      <div className="card">...</div>
    </Reveal>
  );
}
```

---

## 📝 Configuration (`data/wedding.ts`)

All wedding data is decoupled from UI components. Update `data/wedding.ts` to change:
- Invitation details (Date, Year, Title)
- Recipient details (Name, Address, Greeting)
- Couple details (Groom & Bride names, descriptions, Instagram links)
- Quotes & Religious verses
- Event details (Akad Nikah & Resepsi locations, times, map links)
- Countdown target date
- Bank accounts & Gift mailing address
- Music audio file & artist info

---

## 🛠️ Development & Building

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Run Type Checking
```bash
npx tsc --noEmit
```

### 4. Build for Production
```bash
npm run build
```
