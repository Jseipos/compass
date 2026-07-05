# Compass

Prompted journaling tailored to your mental health patterns. Not a diagnosis. Just a mirror.

## What it does

Compass asks you a set of questions across five topic areas (anxiety, mood, focus, social, sleep). Based on your answers, it identifies which patterns show up most and generates journaling prompts that actually relate to what you're working through.

You write. You track mood and energy. Over time, you start to see your own patterns. That's it.

## What it doesn't do

- No accounts. No server. No cloud.
- Everything lives in your browser's IndexedDB. Clear your browser data, it's gone.
- No AI reads your entries. No therapist dashboard. No analytics.
- Not a substitute for professional care. If you're in crisis, call or text 988.

## Features

- **Assessment** — 23 questions across 5 themed groups, with break screens every few questions so it doesn't feel like a form
- **Personalized prompts** — 78 prompts in the library, weighted toward your top patterns and any focus areas you select
- **Therapist input** — Structured checkboxes for what you want to work on. Bring your own list or your therapist's recommendations. No free-text that implies intelligence we don't have.
- **Mood and energy tracking** — Log how you're feeling alongside each entry
- **Plant growth** — Pick a plant at onboarding. Each entry you write feeds it. Dormant, not dead, when you skip days.
- **Engagement tracker** — 12-week heatmap, milestone emojis, and a reflection prompt every 10 entries that surfaces something you wrote before
- **History** — Filter by pattern, mood, or date. Entries are immutable (no edit or delete) — this is intentional, for safety.
- **Calendar reminders** — Generate a .ics file to import into any calendar app. No push notifications, no backend.
- **Privacy policy** — Covers all 50 states, in-app and in-repo
- **Works offline** — PWA with a service worker. Add to your home screen and it launches like a native app.
- **ADA compliant** — WCAG 2.1 AA target, screen reader support, keyboard navigation, skip-to-content

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS 4**
- **TypeScript**
- **IndexedDB** for local storage (via a thin wrapper in `src/lib/storage.ts`)
- **PWA** — web manifest, service worker, app icons, safe area insets

## Project structure

```
src/
  app/
    page.tsx          — main app (hub, assessment, results, journal, history, settings views)
    layout.tsx        — root layout, metadata, PWA tags, service worker registration
    privacy/page.tsx  — in-app privacy policy
    globals.css       — global styles, mobile polish
  components/
    Assessment.tsx       — question flow with progress tracking
    BreakScreen.tsx      — mid-assessment break screens
    EngagementTracker.tsx — heatmap, milestones, reflection modal
    History.tsx          — entry history with filters
    Journal.tsx          — prompt selection, writing, follow-up, mood/energy
    Plant.tsx            — SVG plant growth visualization (5 stages, 5 plant types)
    Results.tsx          — pattern breakdown after assessment
    ServiceWorkerRegister.tsx — SW registration (client component)
    TabBar.tsx           — sticky bottom navigation (Home, Journal, History, Settings)
    Welcome.tsx          — onboarding screen with plant picker
  lib/
    assessment.ts    — questions, scoring, pattern definitions
    breaks.ts        — break screen content
    ics.ts           — .ics calendar file generation
    prompts.ts       — 78-prompt library, weighted selection logic
    storage.ts       — IndexedDB wrapper, prefs, export/import
public/
  manifest.json      — PWA manifest
  sw.js              — service worker (network-first navigation, cache-first assets)
  icon-*.png         — app icons (192/512, maskable variants)
  apple-touch-icon.png
```

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. To test on your phone over local WiFi, start the dev server with `--hostname 0.0.0.0` and add your machine's IP to `allowedDevOrigins` in `next.config.ts`.

## Building for production

```bash
npm run build
npm start
```

## Deployment

Deploy to Vercel (or any static host that supports Next.js). The app has no backend dependencies — all data lives in the browser.

## Branch structure

- `main` — app code and infrastructure
- `prompt-library` — prompt content only (kept separate for independent updates)

## Design decisions

A few things that might look like bugs or missing features are intentional:

- **Entries are immutable.** No edit or delete. This preserves entries as potential evidence for therapists or loved ones. Not a missing feature.
- **No push notifications.** No backend means no push. Calendar export via .ics instead. No compliance or unsubscribe concerns.
- **Therapist input is checkboxes, not free text.** If we accept free-text recommendations but nothing reads them, users feel misled. Structured toggles actually weight prompt selection.
- **Plant growth, not streaks.** No streak punishment. Dormant isn't dead. You don't lose your plant because you had a hard week.
- **Web first, native later.** Phase 1 is a web app for fast iteration. Phase 2 wraps it in Capacitor or React Native WebView for HealthKit and push. Phase 3 is a full Swift rewrite if the feature set justifies it.

## License

Private project. Not licensed for distribution.
