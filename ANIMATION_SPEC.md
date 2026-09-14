# ANIMATION SPECIFICATION: WEDDING INVITATION

## 1. Overview & Strategy
In the original reference website, animations were driven by two separate mechanisms:
1. **AOS (Animate On Scroll)**: Library applying CSS classes (`zoom-in-up`, duration: `1000ms`, anchor-placement: `center`) across 60+ containers.
2. **Elementor Motion Effects**: Hardcoded CSS keyframes (`zoomIn` with 4000ms delay, `fadeInUp`, and `folktoSpin`).

### The Modern Replacement: Framer Motion
Rather than loading bulky jQuery plugins and CSS animation libraries, we recreate every animation with **Framer Motion**:
- Hardware-accelerated GPU transforms (`translate3d`, `scale`, `opacity`).
- Natural spring physics and cubic-bezier easings (romantic and cinematic feel, avoiding abrupt stops).
- Viewport intersection triggers (`whileInView` / `useInView` with `once: true` and configurable threshold/margin).
- Unified, modular `<Reveal>` wrapper component with zero layout shift.

---

## 2. Animation Inventory by Section & Element

| Section / Element | Animation Type | Trigger | Duration | Delay | Direction / Transform | Easing | Mobile Behavior |
|---|---|---|---|---|---|---|---|
| **Cover Screen Entrance** | `fade` / `zoom-in` | On Page Load | 1.0s | 0.2s | `scale: 0.95 -> 1.0`, `opacity: 0 -> 1` | `[0.22, 1, 0.36, 1]` | Identical on mobile and desktop |
| **Cover "Buka Undangan" Button** | Gentle Pulse / Glow | Idle (Loop) | 2.5s | 0.8s | Subtle scale oscillation (`1.0 -> 1.04 -> 1.0`) | `easeInOut` | Touch feedback on tap (`scale: 0.96`) |
| **Cover Exit (Opening Invitation)** | `fade-down` / Slide Up | On Click "Buka Undangan" | 0.8s | 0s | `opacity: 1 -> 0`, `y: 0 -> -20px` (smooth scroll starts) | `[0.22, 1, 0.36, 1]` | Body scroll unlocked, scroll to `#bukaUndangan` |
| **Hero Background Video / Image** | `fade` | Immediate upon scroll into hero | 1.2s | 0s | `opacity: 0 -> 1` | `easeOut` | Native HTML5 video / Next.js Image with `priority` |
| **Hero Couple Names ("The Wedding of Reza & Laila")** | `zoom-in-up` | After Cover Opens / Viewport Enter | 1.2s | 0.4s | `scale: 0.9 -> 1.0`, `y: 30px -> 0`, `opacity: 0 -> 1` | `[0.22, 1, 0.36, 1]` | Readable on all screen widths |
| **Hero Date ("26 . 09 . 2026")** | `fade-up` | Staggered after names | 0.8s | 0.8s | `y: 20px -> 0`, `opacity: 0 -> 1` | `easeOut` | Elegant typography reveal |
| **Quote Section Monogram ("R & L")** | `zoom-in` | Viewport enter (amount: 0.3) | 1.0s | 0.1s | `scale: 0.85 -> 1.0`, `opacity: 0 -> 1` | `[0.22, 1, 0.36, 1]` | Crisp SVG/Script rendering |
| **Quote Verse (QS. Ar-Rum: 21)** | `fade-up` | Viewport enter | 0.9s | 0.3s | `y: 25px -> 0`, `opacity: 0 -> 1` | `easeOut` | Comfortable reading speed |
| **Couple Section Header ("We are Getting Married!")** | `fade-up` | Viewport enter | 0.8s | 0.1s | `y: 20px -> 0`, `opacity: 0 -> 1` | `[0.22, 1, 0.36, 1]` | Centered headline |
| **Groom Profile Card** | `zoom-in-up` | Viewport enter | 1.0s | 0.2s | `scale: 0.95 -> 1.0`, `y: 30px -> 0`, `opacity: 0 -> 1` | `[0.22, 1, 0.36, 1]` | Portrait photo frame zoom |
| **Bride Profile Card** | `zoom-in-up` | Viewport enter | 1.0s | 0.3s | `scale: 0.95 -> 1.0`, `y: 30px -> 0`, `opacity: 0 -> 1` | `[0.22, 1, 0.36, 1]` | Smooth staggered entrance |
| **Prewedding Photo Divider** | `fade` (Cross-fade) | Viewport enter | 1.5s | 0s | Subtle Ken-Burns pan / cross-fade | `easeInOut` | Low memory footprint |
| **Countdown Block Units (Hari, Jam, Menit, Detik)** | Staggered `zoom-in` | Viewport enter | 0.7s | Stagger 0.1s | `scale: 0.9 -> 1.0`, `opacity: 0 -> 1` | `[0.34, 1.56, 0.64, 1]` | Pop-in bounce feel |
| **"Simpan Tanggal" Calendar Button** | `fade-up` | Viewport enter | 0.8s | 0.5s | `y: 20px -> 0`, `opacity: 0 -> 1` | `easeOut` | Clear tap target |
| **Akad Nikah Card** | `fade-left` / `zoom-in-up` | Viewport enter | 0.9s | 0.1s | `x: -20px -> 0` or `y: 30px -> 0`, `opacity: 0 -> 1` | `[0.22, 1, 0.36, 1]` | Full width card on mobile |
| **Resepsi Pernikahan Card** | `fade-right` / `zoom-in-up` | Viewport enter | 0.9s | 0.2s | `x: 20px -> 0` or `y: 30px -> 0`, `opacity: 0 -> 1` | `[0.22, 1, 0.36, 1]` | Balanced visual symmetry |
| **Live Streaming Card** | `zoom-in-up` | Viewport enter | 0.8s | 0.1s | `scale: 0.95 -> 1.0`, `y: 20px -> 0` | `easeOut` | Pulse red live dot indicator |
| **Gallery Masonry Items** | Staggered `zoom-in` | Viewport enter | 0.8s | Stagger 0.08s | `scale: 0.92 -> 1.0`, `opacity: 0 -> 1` | `[0.22, 1, 0.36, 1]` | Progressive image reveal |
| **Gallery Lightbox Modal** | Spring `zoom-in` | On Image Click | 0.35s | 0s | `scale: 0.85 -> 1.0`, `opacity: 0 -> 1` | `spring` (damping: 25) | Pinch-to-zoom / tap to close |
| **Love Story Milestones** | Alternating `fade-left` / `fade-right` | Viewport enter per item | 0.8s | 0.15s | `x: +/-25px -> 0`, `opacity: 0 -> 1` | `easeOut` | Clean timeline progression |
| **Bank Account Cards** | `zoom-in-up` | Viewport enter | 0.9s | 0.1s | `y: 30px -> 0`, `scale: 0.96 -> 1.0` | `[0.22, 1, 0.36, 1]` | Card elevation |
| **Copy Button Tap Feedback** | Micro-bounce | On Click | 0.2s | 0s | `scale: 0.94 -> 1.0` with toast / checkmark | `easeOut` | Immediate tactile confirmation |
| **RSVP Form Container** | `fade-up` | Viewport enter | 0.8s | 0.1s | `y: 30px -> 0`, `opacity: 0 -> 1` | `easeOut` | Form input focus glow |
| **Guest Book Comment Cards** | `fade-up` | Viewport enter / on new post | 0.6s | Stagger 0.05s | `y: 15px -> 0`, `opacity: 0 -> 1` | `easeOut` | Smooth virtual scroll / pagination |
| **Closing Greeting & Signature** | `zoom-in-up` | Viewport enter | 1.0s | 0.2s | `scale: 0.95 -> 1.0`, `y: 20px -> 0` | `[0.22, 1, 0.36, 1]` | Romantic outro |
| **Floating Music Player Disc** | Infinite Rotate (`spin`) | While Audio is Playing | 4.0s / rev | 0s | Continuous `rotate: 0deg -> 360deg` (loop: Infinity) | `linear` | Pauses rotation when audio paused |
| **Floating Music Player Entrance** | `slide-up` | Triggered by "Buka Undangan" | 0.8s | 0.2s | `y: 80px -> 0`, `opacity: 0 -> 1` | `[0.22, 1, 0.36, 1]` | Fixed overlay button |

---

## 3. Reusable Reveal Component API

The `<Reveal>` component acts as the unified animation engine throughout the application.

### Component Signature
```tsx
import { ReactNode } from "react";

export type AnimationVariant =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "zoom-in-up"
  | "zoom-in-down";

export interface RevealProps {
  children: ReactNode;
  animation?: AnimationVariant;
  duration?: number;
  delay?: number;
  once?: boolean;
  amount?: number | "some" | "all";
  easing?: [number, number, number, number] | string;
  className?: string;
  style?: React.CSSProperties;
}
```

### Variant Transform Matrix
| Variant | Initial State | Visible State |
|---|---|---|
| `fade` | `{ opacity: 0 }` | `{ opacity: 1 }` |
| `fade-up` | `{ opacity: 0, y: 40 }` | `{ opacity: 1, y: 0 }` |
| `fade-down` | `{ opacity: 0, y: -40 }` | `{ opacity: 1, y: 0 }` |
| `fade-left` | `{ opacity: 0, x: 40 }` | `{ opacity: 1, x: 0 }` |
| `fade-right` | `{ opacity: 0, x: -40 }` | `{ opacity: 1, x: 0 }` |
| `zoom-in` | `{ opacity: 0, scale: 0.88 }` | `{ opacity: 1, scale: 1 }` |
| `zoom-out` | `{ opacity: 0, scale: 1.12 }` | `{ opacity: 1, scale: 1 }` |
| `zoom-in-up` | `{ opacity: 0, scale: 0.9, y: 40 }` | `{ opacity: 1, scale: 1, y: 0 }` |
| `zoom-in-down`| `{ opacity: 0, scale: 0.9, y: -40 }` | `{ opacity: 1, scale: 1, y: 0 }` |

### Default Settings
- **Default Duration**: `0.85` seconds (replaces AOS 1000ms with a crisper feel).
- **Default Easing**: `[0.22, 1, 0.36, 1]` (Cubic Bezier for soft deceleration).
- **Default Trigger Threshold**: `amount: 0.2` (triggers when 20% of element is in view).
- **Default Once**: `true` (elements stay visible once scrolled into view, eliminating flickering).
