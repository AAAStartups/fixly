# FIXLY (QuickFix / Punarafix) — Project Master Architecture & Implementation Plan

> **Note:** Frontend mobile screens are provided by the client. This document establishes the complete architectural blueprint, feature workflows, data models, API roadmap, and operational guidelines to prepare for immediate development.

---

## 1. Executive Summary & Business Architecture

**FIXLY** (formerly Punarafix / QuickFix) is an on-demand smartphone repair and doorstep logistics platform engineered for rapid turnaround, pricing transparency, and customer trust.

### Core Value Propositions
* **Free Diagnosis:** Zero-cost device evaluation at the repair workshop.
* **Transparent Pricing:** Clear itemized parts and labor pricing with no hidden charges.
* **Doorstep Convenience:** Flat **₹79** pickup-and-drop logistics fee.
* **30-Day Repair Warranty:** Guaranteed quality backing for all repaired components with tracked claim lifecycle.

### Key Stakeholders & Touchpoints
```
                      ┌──────────────────────────────────────────────┐
                      │              QuickFix Platform               │
                      └──────────────────────┬───────────────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             ▼                               ▼                               ▼
    [ Customer Mobile App ]       [ Operations Dashboard ]        [ Technicians & Riders ]
     (Flutter / iOS & Android)       (Next.js Web Portal)          (Field & Lab Workflows)
     • Device selection              • Order orchestration          • Pickup & drop confirmation
     • Pickup booking                • Dispatch riders              • Diagnostic report entry
     • Live repair tracking          • Assign technicians           • Spare parts allocation
     • Estimate approval & pay       • Inventory & parts pricing    • Quality check signoff
     • 30-day warranty claims        • Revenue analytics
```

---

## 2. Technology Stack

| Layer | Technology | Key Specifications & Libraries |
| :--- | :--- | :--- |
| **Mobile App** | **Flutter + Dart** | Material 3 UI, `flutter_riverpod` (State), `go_router` (Navigation), `dio` (Networking), `cached_network_image`, `flutter_animate` |
| **Admin Dashboard** | **Next.js + TypeScript** | React 19 / Next.js App Router, Tailwind CSS, shadcn/ui, TanStack Table, Recharts |
| **Backend Services** | **Node.js + NestJS** | TypeScript, Modular NestJS Architecture, REST API + WebSockets/Socket.IO gateway |
| **Database & ORM** | **PostgreSQL + Prisma ORM** | Relational integrity, ACID compliance, migrations, connection pooling (`pgbouncer`) |
| **Media & Object Storage** | **Cloudflare R2 / AWS S3** | S3-compatible pre-signed URLs for customer damage media, technician proof, PDF invoices |
| **Authentication** | **Firebase Auth / SMS OTP** | Fast2SMS / MSG91 or Firebase phone number authentication with JWT session tokens |
| **Maps & Logistics** | **Google Maps Platform** | Places Autocomplete, Geocoding API, Directions & Distance Matrix |
| **Payment Gateway** | **Razorpay** | UPI, Cards, Netbanking, Webhooks for async payment confirmation, Automated refunds |
| **Notifications** | **Firebase Cloud Messaging** | Multi-channel push alerts for order stage milestones and pickup alerts |
| **Realtime Engine** | **Socket.IO** | Bi-directional events for live rider tracking and repair progress state |
| **Monitoring & DevOps** | **Sentry + Docker + AWS** | Full error tracing, containerized deployment (AWS ECS/EC2 or Railway/Render) |

---

## 3. Global Design System & UI Architecture

### 🚨 Strict Zero-Green Design Directive
> **MANDATE:** No green or mint-teal accents (`#2DD4BF`, `#34D399`, `#10B981`) are permitted anywhere across the booking wizard or global app navigation. All screens must strictly follow the visual identity established in **Screen 1 (Home Screen)**:
> 1. **Primary Accent:** **Crimson Red (`#FF2B42`)** for all CTAs, active stepper states, active tab indicators, selected card borders, badges, and notification dots.
> 2. **Base Canvas:** Deep OLED Dark (`#0D0D0D`).
> 3. **Surfaces & Cards:** Charcoal (`#161616` / `#1A1A1A`) with subtle 1px border (`#262626` / `#2A2A2A`).
> 4. **Typography:** Pure White (`#FFFFFF`) for primary titles, Muted Gray (`#8E8E93` / `#A1A1AA`) for secondary metadata.
> 5. **Primary CTA Pattern:** Full-width rounded pill (radius: 32px), solid Crimson Red (`#FF2B42`), bold white text, with a nested black circular badge housing a white right arrow (`→`).

---

## 4. Product Features & Detailed User Journeys

### 4.1 Customer Mobile App (Flutter)

#### A. Screen 1: Home Screen (Verified Design Specification)
* **Visual Theme & Base Palette:**
  - **Background:** Deep dark mode (`#0D0D0D`).
  - **Primary Brand Accent:** Vibrant Crimson Red (`#FF2B42`) used on the `LY` logo accent, `Device` headline highlight, `Select Phone Model` CTA, and active `Home` nav tab.
  - **Secondary Accent (Issue Cards):** Mint/Pale Cyan tint (`#E8F7F7`) with teal line-art illustration strokes (`#008080` / `#0D9488`).
  - **Surface & Cards:** Dark charcoal (`#161616` / `#1A1A1A`) with subtle 1px border (`#2A2A2A`).
  - **Typography:** Sans-serif (Outfit / Inter / Plus Jakarta Sans) in Pure White (`#FFFFFF`) and Muted Gray (`#8E8E93`).

* **Section 1: App Header / Top Bar**
  - **Brand Logo:** `FIXLY` (`FIX` in bold white, `LY` in accent crimson red `#FF2B42`).
  - **Notification Bell Action:** Dark circular button (`#1A1A1A`) with white bell icon and unread indicator support.

* **Section 2: Hero Header**
  - **Background Media:** Dark, moody photography of a precision technician repair mat with disassembled iPhone, screwdrivers, and components.
  - **Subtitle:** `PROFESSIONAL REPAIR SERVICE` (all caps, tracked out, `#8E8E93`, 11px font size).
  - **Main Heading:** `Expert Care` (white) \n `for Your Device` (`for Your` white, `Device` in `#FF2B42`).
  - **Tagline:** `Fast. Reliable. Transparent.` (muted white/gray, 14px font size).

* **Section 3: Issue Diagnostic Category Grid (2 Rows × 4 Columns = 8 Cards)**
  - Card style: Mint-cyan background (`#E8F7F7`), ~14px border radius, top-right diagonal arrow icon (↗), high-contrast line illustrations:
    1. **Display Issues:** Cracked screen phone line illustration + ↗ arrow.
    2. **Battery Issues:** Phone with battery & exclamation mark inside + ↗ arrow.
    3. **Back Glass Broken:** Phone rear view with camera module & cracked glass lines + ↗ arrow.
    4. **Audio Issues:** Phone with speaker and muted audio icon + ↗ arrow.
    5. **Charging Issues:** Phone with unplugged charging cable + ↗ arrow.
    6. **Dead Phone:** Phone with skull & crossbones line icon + ↗ arrow.
    7. **Network Issues:** Phone with cellular antenna tower & waves + ↗ arrow.
    8. **Water Damage:** Phone submerged in water waves + ↗ arrow.
  - *Interaction:* Tapping any category pre-selects the issue and transitions directly to the device selector.

* **Section 4: Primary Call-to-Action (CTA)**
  - **Button Design:** Full-width rounded pill (radius: 32px), solid crimson red background (`#FF2B42`).
  - **Label:** `Select Phone Model` (Bold White, 16px).
  - **Accessory Icon:** Nested black circular badge with a white right arrow (`→`).
  - *Interaction:* Direct entry point to Screen 2 (Brand & Model Picker).

* **Section 5: "Popular Repairs" Carousel**
  - **Section Header:** `Popular Repairs` (Bold White, 18px) with `View All ›` link (`#8E8E93`).
  - **Horizontal Scroll Cards:** Dark surface (`#161616`), 1px border (`#2A2A2A`), rounded corners (~16px), vertical padding:
    - Card 1: Cracked screen icon | **Screen Replacement** | `From ₹1,499`
    - Card 2: Battery icon | **Battery Replacement** | `From ₹999`
    - Card 3: Back glass icon | **Back Glass Repair** | `From ₹1,299`
    - Card 4: Charging port icon | **Charging Port Repair** | `From ₹799`

* **Section 6: Bottom Navigation Bar (4 Tabs)**
  - Surface: Dark (`#0D0D0D`) with subtle divider and safe-area inset.
  - **Home (Active):** Red house icon + red `Home` label (`#FF2B42`).
  - **Booking:** Muted delivery truck icon + `Booking` label (`#8E8E93`).
  - **Live:** Muted broadcast/camera icon with red indicator dot + `Live` label.
  - **Dashboard:** Muted 2×2 grid icon + `Dashboard` label.

#### B. Book a Repair Flow (5-Step Wizard)

##### Screen 2: 1/5 Select Brand (Theme Redesign Specification)
> **Theme Harmonization:** The original draft of this screen used a mismatched mint-green accent (`#2DD4BF`). For brand consistency, this screen is redesigned to strictly adhere to FIXLY's **Crimson Red (`#FF2B42`)** and deep dark palette (`#0D0D0D`).

* **Header & Stepper Area:**
  - **Top Navigation Bar:**
    - Left: Circular back button (`#1A1A1A` surface with white back arrow `←`).
    - Center: Subtitle `New Order` (muted `#8E8E93`, uppercase, tracked) + Title `1/5 Select Brand` (White bold, 18px).
    - Right: Circular cart button (`#1A1A1A`) with an active **Crimson Red badge (`#FF2B42`)** indicating items in cart.
  - **Progress Stepper Bar:**
    - Segmented 5-step horizontal bar or smooth progress indicator.
    - Active segment (Step 1/5): Solid **Crimson Red (`#FF2B42`)** fill (replaces original green).
    - Inactive track (Steps 2-5): Muted dark gray (`#262626`).

* **Search Bar:**
  - **Container:** Dark surface (`#161616`), 1px subtle border (`#2A2A2A`), rounded pill or 14px radius.
  - **Icon:** Magnifying glass search icon in muted gray (`#8E8E93`).
  - **Placeholder:** `Search for brand or model (eg. iPhone 14, Galaxy S23)`.
  - **Interaction:** Live client-side filtering of brand cards; typing specific models (e.g. "iPhone 14") allows jumping directly to model selection.

* **Brand Grid (3 Columns × 4 Rows = 12 Brands):**
  - **Card Surface (Unselected):** Dark charcoal (`#161616`), 1px border (`#262626`), ~14px border radius.
  - **Card Surface (Selected - e.g. Xiaomi / Apple):**
    - High-contrast 2px border in **Crimson Red (`#FF2B42`)** (replaces original green outline).
    - Subtle crimson red gradient glow/tint (`rgba(255, 43, 66, 0.08)`).
  - **Supported Brands & Logos:**
    1. **Apple** (Iconic white Apple logo)
    2. **Samsung** (Samsung wordmark in crisp white)
    3. **OnePlus** (1+ red square logo)
    4. **Google** (Google four-color 'G' emblem)
    5. **Xiaomi** (Mi orange squircle badge)
    6. **Vivo** (Vivo brandmark in blue)
    7. **Motorola** (Batwing 'M' emblem in cyan/blue)
    8. **Realme** (Realme yellow badge)
    9. **OPPO** (OPPO green wordmark)
    10. **POCO** (POCO yellow badge)
    11. **iQOO** (iQOO yellow wordmark)
    12. **Huawei** (Huawei petal emblem in red)

* **Bottom Sticky Cart Summary & Action Bar:**
  - Positioned above the bottom navigation bar with a subtle blur/dark backdrop (`#121212 / #0D0D0D`).
  - **Left (Cart Overview):**
    - Label: `Current cart` (muted gray `#8E8E93`, 12px).
    - Line 1: `+ Vivo T3 5G` (Bold White, 14px).
    - Line 2: `+ PRO service` (Bold White, 14px).
  - **Right (Primary Action Button):**
    - Redesigned from the original green button to **FIXLY Signature Crimson Red (`#FF2B42`)**.
    - Pill shape (radius: 28px) with bold white text: `Select Model ›` (or `Select Pickup ›` if pre-configured).
    - High touch target (min 48px height) with active press micro-animation.

* **Bottom Navigation Bar Synchronization:**
  - Active tab: **Booking** (highlighted in **Crimson Red `#FF2B42`** instead of green, maintaining cohesive global theming).

##### Screen 3: 2/5 Select Model (Theme Redesign Specification)
> **Theme Harmonization:** Just like Screen 2, the draft screenshot for Screen 3 had mint-green (`#2DD4BF`) accents on the stepper progress, step counter, "Change Brand" action, selected model border, cart summary button, and active tab. All these elements are redesigned to **FIXLY's Crimson Red (`#FF2B42`)** and deep dark palette (`#0D0D0D`).

* **Header & Stepper Area:**
  - **Top Bar:** Back button (`←`) in circular dark button (`#1A1A1A`), centered title `New Order` + `2/5 Select Model` (White bold, with `2/5` in White / subtle Red accent), right circular cart button with Crimson Red badge (`#FF2B42`).
  - **Progress Stepper Bar:** Step 2 of 5 filled to 40% in **Crimson Red (`#FF2B42`)** over dark track (`#262626`).

* **Search Input:**
  - Container: Dark surface (`#161616`), 1px border (`#2A2A2A`), rounded pill or 14px radius.
  - Contextual placeholder: `Search for model (eg. Xiaomi 11, Redmi Note 12)`.
  - Client-side fast search filtering the list below in real-time.

* **Selected Brand Header & Switch Action:**
  - **Left:** Selected brand icon badge (e.g. Orange Xiaomi `Mi` badge) + Brand name `Xiaomi` (Bold White, 18px).
  - **Right Action:** `Change Brand ›` styled in clean muted gray (`#8E8E93`) with hover/tap transition to Crimson Red (`#FF2B42`), allowing instant step-back to Screen 2.

* **Model Vertical List Cards:**
  - **Card Surface (Unselected):** Dark surface (`#161616`), 1px subtle border (`#262626`), ~14px border radius.
  - **Card Surface (Selected - e.g. Xiaomi 11i 5G):**
    - High-contrast 2px border in **Crimson Red (`#FF2B42`)** (replaces original green).
    - Subtle crimson red gradient glow (`rgba(255, 43, 66, 0.08)`).
    - Chevron arrow right: Highlighted in **Crimson Red (`#FF2B42`)**.
  - **Card Content Structure:**
    - **Device Thumbnail (Left):** Rounded square container (`#FFFFFF` or light background) displaying a high-resolution phone render.
    - **Device Details (Center):**
      - Title: Phone Model Name (e.g. `Xiaomi 11i 5G`, `Xiaomi 11i HyperCharge`, `Xiaomi 11 Lite NE 5G`, `Xiaomi 11T Pro 5G`, `Xiaomi 12 Series 12 Pro 5G`, `Xiaomi 7A`, `Xiaomi 8`) in Bold White (15px).
      - Metadata: Release Year & Network generation (e.g. `2022 | 5G`, `2019 | 4G`) in muted gray (`#8E8E93`, 13px).
    - **Navigation Chevron (Right):** Arrow right (`›`) indicating selection and progression.

* **Bottom Sticky Cart Summary & Action Bar:**
  - Left: `Current cart` summary displaying selected items (e.g. `+ Xiaomi 11i 5G`, `+ Free Diagnosis`).
  - Right: Primary Action Button redesigned to **Crimson Red pill button (`#FF2B42`)** with text: `Select Issue ›` (or `Select Pickup ›` if issue was pre-selected from Home Screen).

* **Bottom Navigation Bar Synchronization:**
  - Active tab: **Booking** retained in **Crimson Red (`#FF2B42`)**.

##### Screen 4: 3/5 Select Service (Theme Redesign Specification)
> **Theme Harmonization:** The draft screenshot for Screen 4 used mint-green (`#2DD4BF`) accents on the stepper progress (3/5), "Change" button, trust badge icons, selected service border, "Select" buttons, cart summary button, and active bottom tab. These are redesigned into **FIXLY's Crimson Red (`#FF2B42`)** accent on dark charcoal surfaces (`#161616`) and deep dark background (`#0D0D0D`).

* **Header & Stepper Area:**
  - **Top Navigation Bar:** Circular dark back button (`←`), title `New Order` + `3/5 Select Service` (White bold, with `3/5` in White / subtle Crimson Red accent), right circular cart button with Crimson Red notification badge (`#FF2B42`).
  - **Progress Stepper Bar:** Step 3 of 5 filled to 60% in solid **Crimson Red (`#FF2B42`)** over dark track (`#262626`).

* **Selected Device Summary Card (Top):**
  - **Container:** Dark card (`#161616`), 1px border (`#2A2A2A`), rounded corners (~16px), horizontal layout.
  - **Left Thumbnail:** Rounded square light container showing high-resolution render of selected phone (e.g. `Xiaomi 11T Pro 5G`).
  - **Center Text:** Device name `Xiaomi 11T Pro 5G` (Bold White, 16px) with metadata `2021 | 5G` (Muted gray `#8E8E93`, 13px).
  - **Right Action:** `Change ›` styled in clean muted gray (`#8E8E93`) with **Crimson Red (`#FF2B42`)** hover/press state (allows 1-tap jump back to model picker).

* **Section Header & Value Assurance Chips:**
  - **Section Title:** `Repair Services` (Bold White, 20px).
  - **Section Subtitle:** `Choose the issue you want to get repaired` (Muted gray `#8E8E93`, 14px).
  - **Horizontal Value Assurance Chips (3 Items):**
    1. ⏱ **60 min repair:** Express turnaround badge with clock icon.
    2. 🔴 **Live stream:** Red pulsing broadcast indicator badge (aligns directly with the bottom bar `Live` tab).
    3. 🛡 **Warranty assurance:** Shield badge indicating warranty coverage (e.g. up to 6 months on OEM parts).

* **Repair Services List (Rich Vertical Service Cards):**
  - **Card Surface (Unselected):** Dark charcoal (`#161616`), 1px subtle border (`#262626`), ~16px radius.
  - **Card Surface (Selected - e.g. Display):**
    - High-contrast 2px border in **Crimson Red (`#FF2B42`)** (replaces original green outline).
    - Subtle crimson red glow/tint (`rgba(255, 43, 66, 0.08)`).
    - Selection button converts to solid Crimson Red pill or `Selected ✓` badge.
  - **Card Structure & Items:**
    1. **Display:**
       - Left: Phone with cracked screen line-art icon.
       - Center: `● LIVE` badge (Red pill) + **Display** title (Bold White) + `Screen replacement (OEM)` subtitle + `✔ Warranty included` chip.
       - Right: Price `₹4,299` (Bold White, 16px) + `Select` button pill.
    2. **Battery:**
       - Left: Battery icon + `● LIVE` badge + **Battery** title + `Battery replacement (OEM)` + `✔ Warranty included`.
       - Right: Price `₹2,249` + `Select` button pill.
    3. **Charging Port:**
       - Left: Cable port icon + `● LIVE` badge + **Charging Port** title + `Charging issue / port replacement` + `✔ Warranty included`.
       - Right: Price `₹1,299` + `Select` button pill.
    4. **Camera:**
       - Left: Camera lens icon + `● LIVE` badge + **Camera** title + `Front / Back camera replacement` + `✔ Warranty included`.
       - Right: Price `₹2,999` + `Select` button pill.
    5. **Speaker:**
       - Left: Speaker soundwaves icon + `● LIVE` badge + **Speaker** title + `Sound issue / speaker replacement` + `✔ Warranty included`.
       - Right: Price `₹1,499` + `Select` button pill.
    6. **Water Damage:**
       - Left: Water droplet icon + `● LIVE` badge + **Water Damage** title + `Diagnosis & repair` + `✔ Warranty included`.
       - Right: Price `₹1,999` + `Select` button pill.

* **Sticky Bottom Cart Summary & Action Bar:**
  - Left: `Current cart` summary displaying:
    - `+ Xiaomi 11T Pro 5G` (Device model)
    - `+ Display Replacement (₹4,299)` (Selected repair service)
  - Right: Primary Action Button redesigned to **Crimson Red pill button (`#FF2B42`)** with white text: `Select Pickup ›` (Advances to Step 4/5: Address & Slot).

* **Bottom Navigation Bar Synchronization:**
  - Active tab: **Booking** maintained in **Crimson Red (`#FF2B42`)**.

##### Screen 5: 4/5 Choose Pickup Time (Strict Zero-Green Redesign Specification)
> **Theme Harmonization & Zero-Green Rule:** The draft screenshot used green/mint accents on the stepper bar, header counter, 3D rider scooter, heading highlight, checkmark bullet icons, selected date border, selected time slot border, address pin, and "Continue" button. **All green is eliminated** and replaced with FIXLY's signature **Crimson Red (`#FF2B42`)** and dark mode palette.

* **Header & Stepper Area:**
  - **Top Navigation Bar:** Circular dark back button (`←`), title `New Order` + `4/5 Choose Pickup Time` (White bold, with `4/5` in White / subtle Crimson Red accent), right circular cart button with Crimson Red notification badge (`#FF2B42`).
  - **Progress Stepper Bar:** Step 4 of 5 filled to 80% in solid **Crimson Red (`#FF2B42`)** over dark track (`#262626`).

* **Logistics Hero Banner Card:**
  - **Container:** Dark surface (`#161616`), 1px border (`#2A2A2A`), rounded corners (~20px), padding (20px).
  - **Hero Text (Left):**
    - Headline: `We'll ` (white) + `pickup` (**Crimson Red `#FF2B42`** instead of green) + `\nyour device` (white).
    - Subtitle: `Safe | Verified | Tracked` (Muted gray `#8E8E93`, 13px).
    - Trust Bullet Points (Vertical list):
      - 🛡 **Verified pickup partner:** Crisp white/gray shield icon.
      - 🗺 **Live tracking on app:** Crisp white/gray map icon.
      - ⚡ **Secure & insured handling:** Crisp white/gray lightning icon.
  - **Hero 3D Graphic (Right):**
    - Delivery rider on scooter with delivery box and map marker.
    - Accents & map pin rendered in **Crimson Red (`#FF2B42`)** / monochrome styling instead of mint green.

* **Pickup Date Selector Section:**
  - **Header Row:** Calendar icon + `Select pickup date` (Bold White, 16px) with right-aligned dropdown `This Week ⌵` (`#8E8E93`).
  - **Horizontal 7-Day Chips (`Mon 19 Oct` to `Sun 25 Oct`):**
    - **Unselected Chips:** Dark charcoal card (`#161616`), 1px border (`#2A2A2A`), day/date in white & muted gray.
    - **Selected Chip (e.g. `Mon 19 Oct`):**
      - High-contrast 2px border in **Crimson Red (`#FF2B42`)** (replaces original green outline).
      - Day name & date number highlighted in **Crimson Red (`#FF2B42`)** or crisp white with crimson accent indicator.
      - Subtle ambient glow (`rgba(255, 43, 66, 0.08)`).

* **Pickup Time Slot Selector Section:**
  - **Header Row:** Clock icon + `Select pickup time` (Bold White, 16px) + `ⓘ Repair in 60 mins` info pill (`#8E8E93`).
  - **3×3 Time Slot Grid (`10:00 AM`, `11:30 AM`, `1:00 PM`, `2:30 PM`, `4:00 PM`, `5:30 PM`, `6:30 PM`):**
    - **Unselected Slots:** Dark charcoal button (`#161616`), 1px border (`#2A2A2A`), white text (14px).
    - **Selected Slot (e.g. `10:00 AM`):**
      - High-contrast 2px border in **Crimson Red (`#FF2B42`)** (replaces original green outline).
      - Time label in **Crimson Red (`#FF2B42`)** or Crisp White with red accent.

* **Pickup Address Card:**
  - **Container:** Dark card (`#161616`), 1px border (`#2A2A2A`), rounded corners (~16px), horizontal layout.
  - **Left Pin Container:** Dark rounded container with **Crimson Red Map Pin icon (`#FF2B42`)** (replaces original green pin).
  - **Center Text:** Title `Pickup Address` (Bold White, 15px) + `We'll pickup from your location` (Muted gray) + `Exact address will be confirmed after order`.
  - **Right Action:** `Change ›` styled in clean muted gray (`#8E8E93`) with **Crimson Red (`#FF2B42`)** hover/press state.

* **Primary Call-to-Action (CTA):**
  - Redesigned from the original green pill to **FIXLY Signature Crimson Red (`#FF2B42`)** full-width pill button.
  - Label: `Continue` in bold white.
  - Accessory: Nested circular black badge with white right arrow (`→`), exactly matching Screen 1's CTA.

---

##### Screen 6: 5/5 Booking Details (Strict Zero-Green Redesign Specification)
> **Theme Harmonization & Zero-Green Rule:** In the draft screenshot, the progress bar, step counter (5/5), every single "Change" link, all row icons (cracked phone, shield, calendar, pin, invoice), the "View Details" button, and the final "Confirm Booking" button used mint-green. **Every trace of green is eliminated** and replaced with FIXLY's signature **Crimson Red (`#FF2B42`)**, charcoal surfaces (`#161616`), and crisp white typography.

* **Header & Stepper Area:**
  - **Top Navigation Bar:** Circular dark back button (`←`), title `New Order` + `5/5 Booking Details` (White bold, with `5/5` in White / subtle Crimson Red accent), right circular cart button with Crimson Red badge (`#FF2B42`).
  - **Progress Stepper Bar:** Step 5 of 5 filled to 100% in solid **Crimson Red (`#FF2B42`)** over dark track (`#262626`).

* **Itemized Booking Summary Stack (7 Vertical Cards):**
  - All cards use dark charcoal surfaces (`#161616`), 1px border (`#262626`), rounded corners (~14px).
  - All `Change ›` action links styled in clean muted gray (`#8E8E93`) with **Crimson Red (`#FF2B42`)** hover/press state.
  1. **Brand Card:**
     - Left: Orange `Mi` badge.
     - Center: Label `Brand` (Muted gray, 12px) + `Xiaomi` (Bold White, 15px).
     - Right: `Change ›`.
  2. **Model Card:**
     - Left: Rounded white container with high-res phone render.
     - Center: Label `Model` (Muted gray, 12px) + `Xiaomi 11T Pro 5G` (Bold White, 15px).
     - Right: `Change ›`.
  3. **Issue Card:**
     - Left: Phone line-art icon (Crisp white / muted).
     - Center: Label `Issue` + `Display Service` (Bold White) + `● LIVE` red pill badge.
     - Right: `Change ›`.
  4. **Warranty Card:**
     - Left: Warranty shield icon (Crisp white / muted).
     - Center: Label `Warranty` + `6 months` (Bold White, 15px).
  5. **Pickup Time Card:**
     - Left: Calendar/clock icon (Crisp white / muted).
     - Center: Label `Pickup Time` + `10:00 AM, 19 Oct` (Bold White, 15px).
     - Right: `Change ›`.
  6. **Pickup Location Card:**
     - Left: Map pin icon in **Crimson Red (`#FF2B42`)**.
     - Center: Label `Pickup Location` + `Home` (Bold White, 15px).
     - Right: `Change ›`.
  7. **Total Amount & Payment Terms Card:**
     - Left: Receipt/invoice document icon (Crisp white / muted).
     - Center: Label `Total Amount` + Value `₹5,073` (Bold White, 20px) + Subtext `Pay after the repair is done` (Muted gray `#8E8E93`, 12px).
     - Right: `View Details ›` button pill styled with a subtle 1px border (`#333333`) and white text.

* **Trust & Security Banner (Bottom):**
  - **Container:** Dark card (`#161616`), 1px border (`#262626`), rounded corners (~14px).
  - **Left Icon:** Shield checkmark in clean white or Crimson Red outline.
  - **Text:** Title `Safe & Secure Service` (Bold White, 14px) + Subtitle `Verified pickup partner · Live tracking · Original parts` (Muted gray, 12px).

* **Final Booking Confirmation CTA:**
  - Redesigned from the original green pill to **FIXLY Signature Crimson Red (`#FF2B42`)** full-width pill button.
  - Label: `Confirm Booking` in bold white (16px).
  - Accessory: Nested circular black badge with white right arrow (`→`), exactly matching Screen 1's CTA.
  - *Interaction:* Dispatches order to backend (`POST /api/v1/orders/create`), triggers SMS/WhatsApp confirmation, and transitions customer directly to **Screen 7: Live Repair Tracking**.

#### C. Live 5-Stage Repair Tracking
Visual milestone stepper updated via real-time WebSockets and FCM push notifications:
```
[1. Pickup Scheduled] ──▶ [2. Device Received] ──▶ [3. Diagnosis Completed] ──▶ [4. Repair In Progress] ──▶ [5. Quality Check & Delivery]
```
* **Stage 1 (Pickup Scheduled):** Rider assigned, contact details, estimated arrival time.
* **Stage 2 (Device Received):** Device safely checked in at the central repair lab; intake checklist verified.
* **Stage 3 (Diagnosis Completed):** Technician analysis uploaded; itemized estimate ready for customer review.
* **Stage 4 (Repair In Progress):** Component replacement and micro-soldering underway.
* **Stage 5 (Quality Check & Delivery):** Multi-point hardware test passed; delivery rider out for drop-off.

#### D. Payments, Invoices & Warranty
* **Estimate Approval:** Interactive review screen detailing parts cost, labor cost, ₹79 pickup fee, and applied discounts. Customer can **Approve** or **Decline**.
* **Online Payment Gateway:** Integrated Razorpay checkout supporting GPay, PhonePe, Paytm, Cards, and Netbanking.
* **Instant Invoice Download:** Auto-generated GST-compliant PDF invoice stored on S3/R2.
* **30-Day Warranty Tracker:** Real-time countdown timer for active repair warranty with a 1-tap "Claim Warranty" option.
* **Past Orders:** Complete archive of historical repairs with device records, receipts, and warranty status.

---

### 4.2 Operations & Admin Web Dashboard (Next.js)

#### A. Operations Overview & Live Monitor
* Key performance metrics: Total Bookings, Active Repairs in Lab, Pending Customer Approvals, Today's Deliveries, and Gross Revenue.
* Real-time operational map showing active pickup and delivery riders.

#### B. Order & Booking Management
* Filterable data table and Kanban board (New, Assigned, In Lab, Awaiting Approval, In Repair, Ready for Delivery, Completed, Cancelled).
* Detail drawer for each order: customer information, uploaded media, device physical condition notes, and communication logs.

#### C. Logistics & Rider Dispatch
* Rider roster management: Active vs. Offline riders, current load.
* 1-click pickup & delivery dispatch with geofenced delivery confirmation.

#### D. Technician Workbench & Diagnosis
* Assign repair orders to certified technicians based on specialization (Screen/Glass, Board level, Battery).
* Digital diagnosis sheet: Fault confirmation, photos of opened device, required spare parts picker.

#### E. Bill & Dynamic Parts Price Management
* Dynamic parts price lookup during bill creation (cost price + startup margin).
* Auto-compiles ₹79 logistics fee, spare parts, labor, and taxes into a finalized quotation sent directly to the customer's mobile app.

#### F. Spare Parts Inventory Control
* SKU catalog with compatible models, stock counts, re-order trigger thresholds, supplier information, and purchase costs.
* Automatic stock deduction when an estimate is approved and repair begins.

#### G. Revenue, TAT & Quality Analytics
* Revenue graphs, average repair turnaround time (TAT), technician productivity metrics, and failure/warranty claim rate analytics.

---

## 5. Database Schema Design (PostgreSQL / Prisma)

```
┌──────────────┐       ┌──────────────────┐       ┌────────────────────┐
│    users     │◀─────▶│  customer_addr   │       │   device_models    │
└──────┬───────┘       └──────────────────┘       └─────────┬──────────┘
       │                                                    │
       ▼                                                    ▼
┌──────────────┐       ┌──────────────────┐       ┌────────────────────┐
│ repair_orders│◀─────▶│  order_timeline  │       │    spare_parts     │
└──────┬───────┘       └──────────────────┘       └─────────┬──────────┘
       │                                                    │
       ├───────────────────┬───────────────────┐            │
       ▼                   ▼                   ▼            ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐┌──────────────┐
│  estimates   │    │   payments   │    │  warranties  ││inventory_logs│
└──────┬───────┘    └──────────────┘    └──────────────┘└──────────────┘
       ▼
┌──────────────┐
│estimate_items│
└──────────────┘
```

### Core Entities & Relations

```prisma
// Prisma Schema Definition Blueprint

enum UserRole {
  CUSTOMER
  ADMIN
  TECHNICIAN
  RIDER
}

enum OrderStatus {
  PICKUP_SCHEDULED
  PICKUP_COMPLETED
  DEVICE_RECEIVED
  DIAGNOSIS_PENDING
  ESTIMATE_SENT
  ESTIMATE_APPROVED
  ESTIMATE_REJECTED
  REPAIR_IN_PROGRESS
  QUALITY_CHECK_PASSED
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

model User {
  id            String         @id @default(uuid())
  phoneNumber   String         @unique
  name          String?
  email         String?
  role          UserRole       @default(CUSTOMER)
  fcmToken      String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  addresses     Address[]
  customerOrders RepairOrder[] @relation("CustomerOrders")
  assignedRiderOrders RepairOrder[] @relation("RiderOrders")
  assignedTechOrders  RepairOrder[] @relation("TechOrders")
}

model Address {
  id           String        @id @default(uuid())
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  label        String        // Home, Office, Other
  addressLine  String
  landmark     String?
  city         String
  pincode      String
  latitude     Float?
  longitude    Float?
  orders       RepairOrder[]
}

model DeviceBrand {
  id        String        @id @default(uuid())
  name      String        @unique // Apple, Samsung, OnePlus
  iconUrl   String?
  models    DeviceModel[]
}

model DeviceModel {
  id          String        @id @default(uuid())
  brandId     String
  brand       DeviceBrand   @relation(fields: [brandId], references: [id])
  name        String        // iPhone 14, Galaxy S23
  imageUrl    String?
  spareParts  SparePart[]
  orders      RepairOrder[]
}

model SparePart {
  id            String         @id @default(uuid())
  modelId       String
  model         DeviceModel    @relation(fields: [modelId], references: [id])
  partName      String         // Original OLED Screen, Battery 3200mAh
  partCode      String         @unique
  costPrice     Decimal        @db.Decimal(10, 2)
  sellingPrice  Decimal        @db.Decimal(10, 2)
  stockQuantity Int            @default(0)
  minThreshold  Int            @default(5)
  estimateItems EstimateItem[]
}

model RepairOrder {
  id               String          @id @default(uuid())
  orderNumber      String          @unique // e.g. QF-2026-00123
  customerId       String
  customer         User            @relation("CustomerOrders", fields: [customerId], references: [id])
  modelId          String
  model            DeviceModel     @relation(fields: [modelId], references: [id])
  addressId        String
  pickupAddress    Address         @relation(fields: [addressId], references: [id])
  
  riderId          String?
  rider            User?           @relation("RiderOrders", fields: [riderId], references: [id])
  technicianId     String?
  technician       User?           @relation("TechOrders", fields: [technicianId], references: [id])

  status           OrderStatus     @default(PICKUP_SCHEDULED)
  pickupSlot       DateTime
  issueDescription String
  customerMedia    String[]        // S3 URLs of uploaded images/videos
  diagnosisNotes   String?
  pickupFee        Decimal         @default(79.00) @db.Decimal(10, 2)

  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt

  timeline         OrderTimeline[]
  estimate         Estimate?
  payments         Payment[]
  warranty         Warranty?
}

model OrderTimeline {
  id          String      @id @default(uuid())
  orderId     String
  order       RepairOrder @relation(fields: [orderId], references: [id])
  status      OrderStatus
  title       String
  description String
  timestamp   DateTime    @default(now())
}

model Estimate {
  id           String         @id @default(uuid())
  orderId      String         @unique
  order        RepairOrder    @relation(fields: [orderId], references: [id])
  pickupFee    Decimal        @default(79.00) @db.Decimal(10, 2)
  laborFee     Decimal        @default(0.00) @db.Decimal(10, 2)
  discount     Decimal        @default(0.00) @db.Decimal(10, 2)
  totalAmount  Decimal        @db.Decimal(10, 2)
  isApproved   Boolean?
  rejectionReason String?
  items        EstimateItem[]
  invoiceUrl   String?
  createdAt    DateTime       @default(now())
}

model EstimateItem {
  id          String     @id @default(uuid())
  estimateId  String
  estimate    Estimate   @relation(fields: [estimateId], references: [id])
  partId      String?
  part        SparePart? @relation(fields: [partId], references: [id])
  title       String
  amount      Decimal    @db.Decimal(10, 2)
}

model Payment {
  id                String        @id @default(uuid())
  orderId           String
  order             RepairOrder   @relation(fields: [orderId], references: [id])
  razorpayOrderId   String        @unique
  razorpayPaymentId String?       @unique
  amount            Decimal       @db.Decimal(10, 2)
  status            PaymentStatus @default(PENDING)
  createdAt         DateTime      @default(now())
}

model Warranty {
  id          String      @id @default(uuid())
  orderId     String      @unique
  order       RepairOrder @relation(fields: [orderId], references: [id])
  startDate   DateTime
  endDate     DateTime    // 30 days from delivery
  isActive    Boolean     @default(true)
  claimNotes  String?
}
```

---

## 6. API Specification Blueprint (NestJS REST + WebSockets)

### 6.1 Customer Endpoints
* `POST /api/v1/auth/otp/send` — Request OTP for login
* `POST /api/v1/auth/otp/verify` — Verify OTP & receive JWT token
* `GET  /api/v1/catalog/brands` — List supported phone brands
* `GET  /api/v1/catalog/brands/:id/models` — List models for selected brand
* `GET  /api/v1/catalog/estimates` — Instant estimated price range based on issue
* `POST /api/v1/orders/upload-media` — Get pre-signed S3/R2 upload URL
* `POST /api/v1/orders/create` — Create new repair booking
* `GET  /api/v1/orders/active` — Get active order details & timeline
* `GET  /api/v1/orders/history` — Get historical completed orders
* `POST /api/v1/orders/:id/estimate/respond` — Approve or reject technician estimate
* `POST /api/v1/payments/razorpay/create-order` — Create Razorpay order ID
* `POST /api/v1/payments/razorpay/verify` — Verify signature and confirm payment
* `GET  /api/v1/orders/:id/invoice` — Download generated PDF invoice
* `POST /api/v1/orders/:id/warranty/claim` — Initiate a 30-day warranty claim

### 6.2 Admin & Operations Endpoints
* `GET  /api/v1/admin/dashboard/stats` — Revenue, active repairs, TAT, warranty rate
* `GET  /api/v1/admin/orders` — Paginated list with multi-status filters
* `PATCH /api/v1/admin/orders/:id/assign-rider` — Assign logistics partner/rider
* `PATCH /api/v1/admin/orders/:id/assign-tech` — Assign workshop technician
* `POST  /api/v1/admin/orders/:id/diagnosis` — Submit diagnosis and parts needed
* `POST  /api/v1/admin/orders/:id/estimate` — Generate and dispatch estimate to customer
* `GET   /api/v1/admin/inventory/parts` — View spare parts stock and reorder warnings
* `POST  /api/v1/admin/inventory/parts` — Add/Update part prices and quantity
* `PATCH /api/v1/admin/orders/:id/status` — Advance repair order stage

### 6.3 WebSocket Events (Socket.IO Gateway)
* `order:subscribe` — Client subscribes to updates for `orderId`
* `order:status_updated` — Pushes instant stage change to customer mobile
* `rider:location_ping` — Emits live rider GPS coordinates during active pickup/delivery
* `estimate:issued` — Notifies customer that quotation is ready for sign-off

---

## 7. Implementation Roadmap

### Phase 1: Foundation & Backend Core (Weeks 1 - 2)
- [ ] Initialize NestJS repository with TypeScript, ESLint, and Prettier.
- [ ] Configure PostgreSQL with Prisma ORM and apply migration schema.
- [ ] Implement Authentication module (OTP verification, JWT generation, Role guards).
- [ ] Implement Catalog & Inventory management modules with dynamic parts pricing.
- [ ] Set up Cloudflare R2 / AWS S3 pre-signed upload handler for media & invoices.

### Phase 2: Booking Engine, Logistics & Realtime (Weeks 3 - 4)
- [ ] Build Order creation service (₹79 pickup fee, slot validation, address binding).
- [ ] Implement Order timeline state machine and validation rules.
- [ ] Integrate Socket.IO gateway for real-time tracking pings.
- [ ] Setup Firebase Cloud Messaging (FCM) push notification triggers for status changes.

### Phase 3: Payments, Invoicing & 30-Day Warranty (Weeks 5 - 6)
- [ ] Integrate Razorpay order generation and webhook verification.
- [ ] Implement PDF invoice generation worker using PDFKit or Puppeteer.
- [ ] Build 30-day warranty scheduler and automated expiration/claim logic.

### Phase 4: Mobile App (Flutter) Integration (Weeks 7 - 8)
- [ ] Receive UI screen assets and design tokens from user.
- [ ] Build Flutter screens (Home, Multi-step Booking, Live Stepper, Estimate Review, Invoices).
- [ ] Connect Riverpod state providers to NestJS REST APIs & WebSocket streams.
- [ ] Integrate Razorpay Flutter SDK & Google Maps plugin.

### Phase 5: Admin Web Dashboard (Next.js) & Operations (Weeks 9 - 10)
- [ ] Build Next.js dashboard layout with responsive sidebar and metrics widgets.
- [ ] Implement Orders Kanban board and Status update workflows.
- [ ] Build Technician Diagnosis modal & dynamic quotation builder.
- [ ] Build Parts Inventory catalog with price and stock management.

### Phase 6: Quality Assurance, Security & Deployment (Weeks 11 - 12)
- [ ] End-to-end integration testing for booking, estimation approval, and payment cycles.
- [ ] Sentry error monitoring and performance tracing setup.
- [ ] Containerize applications with Docker and deploy to production cloud infrastructure.

---

## 7. Next Steps & Prerequisites
1. **Frontend Assets:** Awaiting UI screen designs (Figma / screenshots / sketches) from the client to begin pixel-perfect Flutter UI development.
2. **Third-Party Credentials Setup:**
   * Firebase project (Authentication & FCM)
   * Razorpay test keys (API Key & Secret)
   * Google Maps API Key (Places & Geocoding)
   * S3 / Cloudflare R2 storage bucket & access credentials
