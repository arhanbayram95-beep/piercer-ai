# Quick Start — try piercer.ai right now

This is the condensed "just show me the app" version. For the full setup reference (real backend, physical device, troubleshooting network issues) see `README.md`.

This machine currently has **no Android SDK/emulator and no `eas-cli` installed**, so the fastest path below uses the web preview in mock mode — zero setup, no keys, no device. The live camera itself doesn't run in a browser (no web support in `react-native-vision-camera`), so the web build falls back to gallery upload instead; everything else — onboarding, the piercing location picker, the reference page, the personality quiz, settings, paywall — works normally.

**Node version matters.** `react-native` 0.86 requires Node ≥20.19.4 — on an older Node (this machine's system Node is 18.19.1), Metro crashes immediately with `configs.toReversed is not a function` before the app ever loads. `frontend/.nvmrc` pins the right version; if you use `nvm`, run `nvm use` in `frontend/` first. If you don't have `nvm`, check `node -v` before troubleshooting anything else.

---

## Option A — Fastest: mock mode in a browser (2 commands, no keys, no device)

```bash
cd frontend
nvm use          # if you have nvm — picks up the pinned Node version from .nvmrc
npm install
EXPO_PUBLIC_USE_MOCK_API=true npx expo start --web
```

This opens the app in your browser. It uses canned placeholder data instead of calling a real backend — good for clicking through the flow and UI, not for testing the real camera/AI render.

---

## Option B — Full app on your phone (real camera, real flow)

This needs a **dev-client build** (plain Expo Go won't work — `react-native-vision-camera` and `react-native-purchases` are native modules Expo Go doesn't ship) and, for the real AI features, a Gemini API key.

### 1. One-time: build a dev client for your phone

```bash
cd frontend
npx eas-cli login          # needs your Expo account — create one free at expo.dev if needed
npx eas-cli build --profile development --platform android   # or --platform ios
```

This is a cloud build (takes several minutes). When it finishes, EAS gives you a link/QR code to install the build directly on your phone. You only need to redo this if a native dependency changes — everyday code changes reload instantly over Metro.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `backend/.env`:
```
PORT=3000
GEMINI_API_KEY=your-key-here
REVENUECAT_API_KEY=
```
(`REVENUECAT_API_KEY` can stay blank — server-side RevenueCat isn't wired up yet.)

```bash
npm run dev
```

You should see `piercer.ai backend listening on port 3000`.

### 3. Frontend

In a new terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` (this machine's LAN IP is `192.168.1.12` as of this writing — double check with `hostname -I` if it's changed):

```
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.12:3000
```

```bash
npx expo start
```

Open the dev-client build on your phone (same Wi-Fi network as this machine) and scan the QR code / point it at the Metro URL.

**If your phone and this machine can't see each other on the network** (common on guest/isolated Wi-Fi), connect this machine to your phone's hotspot instead and use the new IP it gets on that network — see the "Running on a physical device" section in `README.md` for the full troubleshooting rundown.

---

## What you'll see either way

Welcome → age gate → pick a piercing location (26 options, ear/face/body) → capture a photo (camera in Option B, skipped/mocked in Option A) → Piercing Studio (jewelry type + finish, filtered to what actually fits the location you picked) → AI-rendered preview with before/after toggle → paywall. Settings also has a Piercing Reference page (terminology + pain-scale estimates) and a Personality/Body-Type Match hub (quiz or photo-based).

## Known gaps right now

* The AI render and personality-photo-match endpoints have only been tested against a mocked Gemini client, never a real key — Option B with a real `GEMINI_API_KEY` is the first real-world test.
* RevenueCat purchases aren't enforced server-side yet — the paywall gate is UI-only.
* Legal copy (`backend/src/routes/legal.ts`) is rebranded but still needs actual counsel review before shipping.
