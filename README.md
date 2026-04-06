# Loom — Mobile App Frontend

Loom is an intelligent, localized platform for professional artisans in Nigeria. This repository contains the complete frontend mobile application built with React Native, Expo SDK 54, and TypeScript.

## 🌟 Modern Professional Aesthetic

The application features the **Loom Tactical Interface**, a high-fidelity design system optimized for Nigerian operational environments. 

### Key Visual Pillars:
- **Utility-First Styling:** Fully migrated to **NativeWind v4** (Tailwind CSS) for rapid, consistent, and performant UI development.
- **Tactical Typography:** System-wide deployment of **Plus Jakarta Sans** with a signature "Tactical Extrabold Italic" style for mission-critical headers.
- **Immersive Depth:** Rich use of elevated cards (`rounded-[32px]/[48px]`), premium shadows (`shadow-2xl/3xl`), and blurred backgrounds for a world-class operative experience.
- **Dynamic Feedback:** Integrated **React Native Reanimated** for smooth entry transitions (`FadeInUp`, `FadeInDown`) and interactive state changes.

## 🚀 Key Features

- **Dual Personas:** Seamlessly switch between **Client** and **Artisan** roles with specialized dashboard matrices.
- **Client Experience:** Browse artisans by sector, view top-rated pros, search with real-time filtering, and deploy mission requests via a multi-step logic flow.
- **Artisan Experience:** Track operative yield via financial charts, manage the mission queue, and update field status (On the way, In Progress, Completed) with real-time sync.
- **Communication:** Secure end-to-end encrypted channel UI with "Quick Replies" (optimized for Nigerian Pidgin context) and unread signal indicators.
- **Localization:** Multi-layer i18n support for **English, Nigerian Pidgin, and Yoruba**, featuring localized Naira (₦) formatting and cultural nuances.
- **Modular UI Kit:** A comprehensive, standardized library of tactical components in `components/ui/` including `DetailItem`, `SettingItem`, `LoomThread`, and `StatusTimeline`.

## 🛠️ Tech Stack

- **Framework:** Expo SDK 54, React Native
- **Navigation:** Expo Router (File-based routing with deep-link support)
- **Styling:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Animations:** React Native Reanimated
- **State Management:** Zustand (Performant global state registry)
- **Validation:** Zod (Type-safe schema validation)
- **Icons:** @expo/vector-icons (Ionicons Tactical Set)

## 📦 Folder Structure

- `/app` — Tactical routing registry (Auth stack, Grouped Tabs, Modals)
- `/components/ui` — Modularized component library (Atomic design pattern)
- `/services` — Logic layer and Mock API engine with simulated latency
- `/store` — Global state registry (Zustand)
- `/types` — Comprehensive TypeScript interfaces and domain models
- `/utils` — Helper functions, formatters, and tactical logic
- `/i18n` — Multi-language localization bundles

## 🚦 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Command Center:**
   ```bash
   npm start
   ```
   Press `i` to launch on iOS Simulator or `a` for Android Emulator.

3. **Verify Integrity:**
   ```bash
   npx tsc --noEmit
   ```

## 🗺️ Roadmap

- [ ] Production API Integration (Node.js/PostgreSQL)
- [ ] Real-time Signal Protocol (WebSockets)
- [ ] Embedded Financial Settlements (Paystack/Flutterwave)
- [ ] Live Tactical GPS Tracking for Active Missions
