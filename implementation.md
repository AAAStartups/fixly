# FIXLY Flutter Mobile App — Master UI/UX Production Quality Upgrade Plan

## 1. Executive Summary & Design Vision

FIXLY (Punarafix) is an on-demand, doorstep smartphone repair and lab diagnostic application. This plan outlines the comprehensive visual, ergonomic, and architectural UI/UX upgrade for the **Flutter mobile application (`flutter_app/`)**.

Our objective is to transform the existing mobile app into an **Apple-, Linear-, and Stripe-caliber** experience while maintaining 100% functional parity with the existing 3 bottom navigation tabs, the 5-step booking wizard, live repair tracking, user dashboard, and notifications.

### Core Design Principles:
1. **Deep Obsidian Canvas & Layered Surfaces**: Replace harsh monotone backgrounds with a refined dark elevation scale (`#0A0A0C` canvas, `#121215` card surface, `#1A1A20` elevated surface, `#22222A` highlight).
2. **Zero-Green Mandate & Pure Crimson Red (`#FF2B42`)**: Eliminate the jarring `#E8F7F7` mint and `#008080` teal from the issue cards. All accents, active states, progress indicators, and status badges will adhere to the iconic FIXLY Crimson identity (`#FF2B42` / `#E50914`).
3. **Curated Google Fonts Typography**: Integrate `GoogleFonts.plusJakartaSans` (clean modern geometric sans for interfaces, buttons, labels) and `GoogleFonts.outfit` (for prominent headings, brand marks, and price figures) with strict typographic scale, optical sizing, and mathematical line heights.
4. **Tactile Ergonomics & Micro-Interactions**: Minimum 44x44 dp touch targets, subtle hair-line borders (`#22222A` / `#2A2A35`), responsive ink ripples, smooth step transitions, and clear active states.
5. **Preserve Business Logic & Architecture**: Retain all Riverpod state models (`BookingState`, `DeviceBrand`, `DeviceModel`, `RepairService`), route navigation, and existing widget test assertions (`flutter test`).

---

## 2. Comprehensive Flutter Codebase Audit

### 2.1 Critical Inconsistencies & Visual Bugs Identified:
* **Jarring Color Clash on HomeScreen (Lines 267–268)**:
  `home_screen.dart` renders the 8 issue cards using `AppColors.issueCardBg` (`#E8F7F7` bright mint/cyan) with `AppColors.issueCardIcon` (`#008080` teal) and `Colors.black87` text. In a sleek dark OLED application, this mint/cyan block looks like an unstyled wireframe and contradicts the crimson brand identity.
* **Typographic Hierarchy**:
  Currently, styles use standard fallback `Inter` or unstyled `TextStyle` without font weight consistency, optical tracking, or line-height scaling.
* **Component Tactility & Touch Targets**:
  Bottom navigation tabs (`FixlyBottomNav`) lack active pill backgrounds or glowing indicators.
  The stepper header (`FixlyStepperHeader`) uses basic containers without subtle borders or smooth progress glow.
  Buttons lack pressed states, inner highlight borders, and elevation depth.
* **Screen Layouts**:
  - `SelectBrandScreen`: Search bar and brand cards need high-contrast OEM logos and refined card borders.
  - `SelectModelScreen`: Needs categorized filter chips (Pro, Note, Number series) and detailed hardware spec tags.
  - `SelectServiceScreen`: Service cards need clear price hierarchy, strike-through MRP, savings tags, and warranty chips.
  - `ChoosePickupTimeScreen`: Date chips and time slots need an Apple-like segmented pill design.
  - `BookingDetailsScreen`: Needs a modern receipt-voucher design with itemized bill breakdown.
  - `BookingsTabScreen`: Active repair tracking card needs an animated status pulse and clear timeline indicator.
  - `DashboardTabScreen`: Profile header, warranty vault, and quick actions need clean surface layers and subtle metric cards.
  - `LiveTrackingScreen`: 5-step milestone tracking stepper needs high-fidelity progress pulses and direct technician quick-actions.

---

## 3. Design System Foundation (`lib/theme/app_theme.dart`)

### 3.1 Color Palette
* **Canvas Background**: `Color(0xFF0A0A0C)` (True deep obsidian)
* **Surface Default**: `Color(0xFF121215)` (Cards, modal sheets)
* **Surface Elevated**: `Color(0xFF18181D)` (Input fields, chips, secondary surfaces)
* **Surface Highlight**: `Color(0xFF22222A)` (Hover, pressed, active backgrounds)
* **Hairline Borders**: `Color(0xFF1E1E24)` (Subtle dividers), `Color(0xFF2A2A34)` (Card borders)
* **Brand Crimson Red**: `Color(0xFFFF2B42)` (Primary accent)
* **Crimson Red Dark**: `Color(0xFFE50914)` (Gradients & shadows)
* **Crimson Red Glow**: `Color(0x33FF2B42)` (Pulsing badges, progress glow)
* **Typography Tokens**:
  - `textPrimary`: `Color(0xFFFFFFFF)`
  - `textSecondary`: `Color(0xFF9E9EA7)`
  - `textMuted`: `Color(0xFF6B6B76)`

### 3.2 Typography System (Google Fonts)
* **Headings & Display**: `GoogleFonts.outfit` (Bold / SemiBold / ExtraBold)
* **Body, Forms & UI**: `GoogleFonts.plusJakartaSans` (Regular / Medium / SemiBold / Bold)

---

## 4. Reusable Custom Widgets Upgrade (`lib/widgets/custom_widgets.dart`)

1. **`FixlyStepperHeader`**:
   - Modernized circular back button with smooth touch feedback and subtle border.
   - Elegant "Step X of 5" badge and screen title.
   - Cart button with notification dot and total badge.
   - Smooth animated segmented crimson progress bar with glow effect.
2. **`FixlyCrimsonButton`**:
   - Linear/Apple style tactile button with crimson gradient (`0xFFFF2B42` to `0xFFE50914`).
   - Subtle inner top-edge highlight and soft drop shadow.
   - Circular arrow indicator with high contrast.
3. **`FixlyStickyCart`**:
   - Elevated floating bottom dock with glassmorphism border and clear price hierarchy.
4. **`FixlyBottomNav`**:
   - Hairline top border (`#1E1E24`), active crimson pill background with subtle glow, crisp icons and labels.
5. **`FixlyCard` & `FixlyBadge`**:
   - Standardized card container with rounded corners (16px), subtle border, and optional crimson hover border.

---

## 5. Screen-by-Screen Upgrade Plan

| Screen | Key Improvements |
| :--- | :--- |
| **HomeScreen** | Replace mint/teal issue cards with dark obsidian tiles (`#141418`) featuring subtle hairline borders, crimson highlights, and crisp typography; refine hero banner with trust badges; upgrade Popular Repairs horizontal carousel with turnaround time and warranty badges. |
| **SelectBrandScreen** | Sleek search bar with clear button; modern grid of brand cards with OEM badges, clean typography, and active crimson border selection. |
| **SelectModelScreen** | Sticky brand summary banner with "Change" action; series filter chips; model cards with release year, screen size, and selection checkmark. |
| **SelectServiceScreen** | Device summary card; service cards with price hierarchy, strike-through MRP, savings tags ("Save ₹800"), warranty badge ("6 Months"), and radio selector. |
| **ChoosePickupTimeScreen** | Logistics hero card with doorstep van icon; horizontal date picker with active crimson gradient pills; 3-tier time slot selector (Morning, Afternoon, Evening); address summary card. |
| **BookingDetailsScreen** | Premium receipt voucher design; itemized rows for brand, model, issue, warranty, pickup slot; transparent price breakdown (Repair, Doorstep Pickup Free, Safety Fee ₹79, GST 18%, Total); confirm CTA. |
| **BookingsTabScreen** | Segmented filter (All / Active / Completed); active repair card with real-time pulsing status pill, ETA, device thumbnail, and "Live Track" CTA; past repair cards with warranty countdown and invoice action. |
| **DashboardTabScreen** | User profile card with avatar ring and verified badge; 3 metric counters (Total Repairs, Active Warranties, Saved Amount); Device Vault cards; support shortcuts. |
| **NotificationsScreen** | Grouped notification cards (Today / Earlier); status icons; "Mark all read" action; direct tap to Live Tracking. |
| **LiveTrackingScreen** | Interactive 5-stage milestone stepper with animated pulsing node; assigned technician card with phone & WhatsApp buttons; secure 4-digit handover OTP card. |

---

## 6. Functional Parity & Testing Strategy

- Preserve all state mutations in `MainAppController`:
  - Tab 0: Home
  - Tab 1: Bookings
  - Tab 2: Dashboard
  - Step 1..5: 5-Step Booking Wizard
  - Step 6: Live Tracking
  - Step 7: Notifications
- Keep all existing string keys and icon identifiers tested by `test/widget_test.dart`.
- Run `flutter test` and `flutter analyze` after every change to verify zero regressions.
