# Loom — Mobile App Frontend

Loom is an intelligent, localized platform for artisans in Nigeria. This repository contains the complete frontend mobile application built with React Native, Expo Router, and TypeScript.

## Features

- **Dual Personas:** Seamlessly switch between Client and Artisan roles.
- **Client Experience:** Browse artisans by category, view top-rated pros, search with real-time filtering, post jobs with multi-step flow (including budget/urgency/location), view matched artisans, and track job progress via timeline.
- **Artisan Experience:** Detailed dashboard with stats, online/offline toggle, manage new job requests (accept/decline), track active jobs via timeline with status updates (On the way, Start Work, Complete), and view earnings summary with charts and transactions.
- **Communication:** Built-in messaging thread interface with "Quick Replies" (in Nigerian Pidgin context), unread badges, and real-time chat UI.
- **Localization:** Full i18n support with English, Nigerian Pidgin, and Yoruba, and culturally relevant mock data including Naira (₦) formatting.
- **Reusable UI Kit:** Comprehensive standard design system including custom cards, segmented controls, status pills, offline/error boundaries, toast notifications, skeleton loading states, OTP inputs, and more.
- **Mock Data Engine:** Services layer fully wired to a mock API featuring simulated network delays, random failures, and comprehensive datasets (12 artisans, 10 jobs, message threads, earnings, notifications).
- **Styling:** Custom theme configuration using standard React Native StyleSheet, newly integrated with `nativewind` (Tailwind CSS) v4 for future development.

## Tech Stack

- **Framework:** Expo SDK 54, React Native
- **Navigation:** Expo Router (File-based navigation with tab groups and modals)
- **State Management:** Zustand
- **Validation:** Zod
- **Storage:** AsyncStorage
- **Styling:** Standard StyleSheet + NativeWind/TailwindCSS integration
- **Icons:** @expo/vector-icons (Ionicons)

## Setup and Running

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm start
   ```
   Press `i` to run on iOS Simulator or `a` to run on Android Emulator.

3. **Verify Types:**
   ```bash
   npx tsc --noEmit
   ```

## Folder Structure

- `/app` — Expo Router definitions (Root, Auth stack, Tabs grouping, Modals)
- `/components` — Shared UI elements and complete UI Kit in `/ui`
- `/services` — Mock API and data fetching layer
- `/store` — Global state management (Zustand)
- `/types` — TypeScript interfaces and data models
- `/theme` — Global design tokens (Colors, Typography, Spacing, Shadows)
- `/i18n` — Translations and language switching
- `/utils` — Helper functions, formatters, and Zod schemas

## Future Roadmap

- Integrate backend APIs (Supabase/Firebase/Custom Node.js)
- Implement real-time WebSockets for Chat and Notifications
- Integrate Paystack/Flutterwave for embedded payments
- Add Maps integration for location tracking on the Job Details screen
