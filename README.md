# piercer.ai

A React Native mobile app that lets users photograph a body part and preview a realistic AI-rendered piercing on it before committing. Built for the US/EU entertainment/lifestyle app market. See `PROJECT_SPEC.md` for the full product spec and `DESIGN.md` for the visual system.

---

## Core Features

* **Capture → Studio → AI Render → Preview flow** — photograph (or pick from the gallery) any body part, choose a jewelry type (Hoops, Studs, Barbells, Industrial, Septum, Dermal) and finish (Silver, Gold, Titanium, Black Steel) in the Piercing Studio drawer, then get a hyper-realistic AI-rendered preview with a before/after toggle and placement tweaks (position/rotation/scale).
* **Multimodal AI Vision** — Google Gemini's `gemini-2.5-flash-image` generates the rendered image (a different model from the text/JSON-output `gemini-flash-latest` this app used pre-pivot — see `PROJECT_SPEC.md` §4 for why the model choice matters here). The AI-calling code is isolated in `backend/src/services/` so switching providers stays a contained change.
* **Privacy-first (process-and-discard)** — captured photos live in memory only, on both the client and the server, and are purged immediately after the API response returns. No image ever touches disk or a database.
* **Shareable results** — `react-native-view-shot` exports the rendered preview.
* **10-language UI** — en/zh/hi/es/fr/ar/bn/pt/ru/ur, via a lightweight custom i18n dictionary (`frontend/src/i18n/`). Legal documents (Privacy Policy/Terms) stay English-only pending professional translation.
* **Freemium + stacking (RevenueCat)** — one free render per session, then gated behind the `piercer_pro_access` entitlement; Pro also unlocks stacking multiple jewelry pieces in one render (up to `MAX_STACKED_ITEMS`). SDK is wired end to end against a RevenueCat Test Store; see "What's not wired up yet" below.

---

## Tech Stack

* **Frontend:** React Native + TypeScript, Expo SDK 57 / React Native 0.86 (blank TS template). State via `Zustand`. Camera via `react-native-vision-camera` (photo capture only — no face detection); gallery fallback via `expo-image-picker`. Audio via `expo-audio`. Subscriptions via `react-native-purchases`. Share/export via `react-native-view-shot`.
* **Backend:** Node.js + TypeScript, **Fastify**. Thin gateway — holds the AI provider key, never exposes it to the frontend.
* **AI:** Google Gemini via `@google/genai`. The render endpoint uses `gemini-2.5-flash-image` with `config.responseModalities: [TEXT, IMAGE]` to get image bytes back (`response.candidates[0].content.parts[].inlineData`) — not the `responseSchema` structured-JSON pattern, which is for text-only output. See `PROJECT_SPEC.md` §4 if you're reading this after a provider or model switch.

---

## Prerequisites

* Node.js 20+ and npm
* An **EAS dev-client build** installed on a physical phone, **or** an iOS Simulator / Android Emulator running one. This app no longer runs in plain Expo Go: `react-native-vision-camera` (camera) and `react-native-purchases` (subscriptions) are native modules Expo Go doesn't ship. Build one with `npx eas build --profile development --platform android` (or `ios`) from `frontend/` — see `frontend/eas.json`. You only need to rebuild when a native dependency changes; JS changes reload over Metro as usual.
* A Google Gemini API key ([aistudio.google.com](https://aistudio.google.com/)) — see the note on model choice below
* Your phone and your dev machine **on the same Wi-Fi network** (see the "Running on a physical device" section — this trips people up more than anything else in this repo)

---

## Quick Start

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and fill in:

```
PORT=3000
GEMINI_API_KEY=your-key-here
REVENUECAT_API_KEY=
```

`REVENUECAT_API_KEY` can stay blank — RevenueCat server-side verification isn't wired up yet (see below). Leaving it blank does not break anything else.

Then start it:

```bash
npm run dev
```

You should see `piercer.ai backend listening on port 3000`. Leave this running in its own terminal.

> **Model note:** the render endpoint uses `gemini-2.5-flash-image` (in `backend/src/services/renderService.ts`), Google's image-generation/editing model — this is deliberately *not* `gemini-flash-latest` (a text/vision-in, text-out model with no documented image-output capability), which the old face-reading feature used for structured JSON responses. As of this writing the render backend has only been exercised against a mocked Gemini client in tests, never a real key — confirm the model name and response shape still match before shipping.

### 2. Frontend setup

In a **new terminal**:

```bash
cd frontend
npm install
```

The frontend needs to know where the backend is. Create `frontend/.env`:

```
EXPO_PUBLIC_API_BASE_URL=http://<your-machine's-LAN-IP>:3000
```

Two optional vars belong here too, both off by default:
* `EXPO_PUBLIC_REVENUECAT_API_KEY` — a RevenueCat **public** SDK key. Leave it unset and the paywall uses a local-only stub that unlocks pro without charging; set it and the paywall calls the real SDK. (Note the name: this is the client-side public key, distinct from the backend's `REVENUECAT_API_KEY`.)
* `EXPO_PUBLIC_USE_MOCK_API=true` — mock mode, see step 3 below.

Find your LAN IP:
* **Windows (PowerShell):** `Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like '192.168.*' -or $_.IPAddress -like '10.*' -or $_.IPAddress -like '172.*' }`
* **macOS/Linux:** `ipconfig getifaddr en0` (or `hostname -I` on Linux)

Do **not** use `localhost` here unless you're running on a simulator on the same machine — a physical phone's `localhost` refers to the phone itself, not your dev machine.

Then start Expo:

```bash
npx expo start
```

Open the dev-client build on your phone and point it at the Metro URL shown in the terminal (or press `i`/`a` for a simulator/emulator). Scanning the QR code works too, as long as it's the dev client scanning it and not Expo Go.

### 3. Testing without a backend or API key at all

Don't want to set up a Gemini key yet? Run in mock mode instead — the full capture → studio → render → preview flow works end-to-end with no backend running:

```bash
EXPO_PUBLIC_USE_MOCK_API=true npx expo start
```

This returns a canned, clearly-labeled placeholder render instead of calling anything real.

---

## Running on a physical device (the part that actually causes problems)

Assuming the dev-client build from Prerequisites is already installed, the one thing that reliably trips people up is **network connectivity between your phone and your dev machine**, because two *separate* connections are involved:

1. **Metro (port 8081)** — delivers the app's JS bundle to the dev client. This is what the QR code connects to.
2. **The backend (port 3000)** — a completely separate server. The app calls it automatically in the background once it's loaded; there's no manual "connect" step for this one. It's controlled entirely by `EXPO_PUBLIC_API_BASE_URL` in `frontend/.env`.

**Both your phone and your dev machine need to be on the same Wi-Fi network** for the default (LAN) setup to work. If your router isolates clients from each other (common on some home/office/guest networks), plain LAN mode will fail for *both* connections, and Expo's `--tunnel` flag handles #1 but not #2 — the backend has no equivalent built in. If you hit this:
* Easiest fix: use a phone hotspot instead of the shared Wi-Fi — connect your dev machine to your **phone's** hotspot, then use the machine's new IP (on the hotspot subnet) in `frontend/.env`.
* `frontend/.env` is read once, when Metro starts — if you change your machine's IP (new network, hotspot toggled, etc.), you must fully restart `npx expo start` (not just reload the app) to pick up the change, and force-quit + reopen the dev client on the phone to guarantee it's not running a cached bundle with the old URL.
* If you're using a PowerShell terminal and previously ran `$env:EXPO_PUBLIC_API_BASE_URL = "..."` by hand in that same window, it will silently override `frontend/.env` for the rest of that terminal session. Open a fresh terminal if you're not sure.
* A quick sanity check: open `http://<your-ip>:3000/` directly in your phone's browser. A JSON `{"statusCode":404,...}` response means the phone *can* reach the backend (404 is expected — there's no route at `/`, just proof of connectivity). A timeout/connection error means it's a network problem, not an app bug.

---

## Testing

**Frontend** (Jest + React Native Testing Library):
```bash
cd frontend
npm test
```

**Backend** (Jest with Fastify's `.inject()` — no real Gemini API calls in the test suite, everything's mocked):
```bash
cd backend
npm test
npm run typecheck
```

Both should be fully green on a clean checkout.

---

## What's not wired up yet

* **Real subscription purchases** — the RevenueCat SDK is installed and wired end to end (`frontend/src/utils/purchases.ts`, `PaywallScreen.tsx`), and a real purchase has been driven through RevenueCat's **Test Store** on-device pre-pivot. What's still missing is App Store Connect / Google Play Console in-app products and the `piercer_pro_access` entitlement mapped to them in the RevenueCat dashboard — until then no real money moves. With no `EXPO_PUBLIC_REVENUECAT_API_KEY` set, the paywall falls back to a local-only stub that unlocks pro without charging.
* **Server-side entitlement enforcement** — `backend/src/middleware/entitlement.ts` (`requireActiveEntitlement`) is still a permissive stub that lets every request through, including the render endpoint it's nominally attached to. `@fastify/rate-limit` (20 req/10 min per IP) is the only thing currently protecting the paid Gemini endpoint. The one-free-render limit and jewelry-stacking cap are enforced client-side only right now.
* **The render backend has never been called against the real Gemini API** — `gemini-2.5-flash-image` and the request/response shape are verified against the installed SDK's type definitions and current docs, but only exercised with a mocked client in tests. Needs a real `GEMINI_API_KEY` run before shipping.
* **Legal copy** — `backend/src/routes/legal.ts` (and its static HTML/TXT mirrors) has been rebranded off the old face-reading product, but the BIPA/GDPR biometric-data reasoning it inherited was written for face photos and needs actual legal counsel review for the different privacy fact pattern of piercing/body-part photos before shipping. Flagged in-code, not resolved.
* **App Store / Play Store listings** — don't exist yet. "Rate on App Store" (`frontend/src/utils/storeLinks.ts`) opens a correctly-formed store URL with a placeholder app ID — replace `IOS_APP_STORE_ID`/`ANDROID_PACKAGE_NAME` once the app is actually published. `app.json`'s `com.piercer.ai` bundle id / package name is likewise effectively permanent once published.
* **On-device visual verification** — the new Capture/Studio/Preview screens have automated test coverage but haven't been visually checked on a real device or simulator in this environment.

Check `IMPLEMENTATION_PLAN.md` for the full, up-to-date phase-by-phase status.

---

## Project Structure

```
frontend/
  src/
    api/          # The ONLY place that talks to the backend
    screens/       # One file per screen
    components/    # Presentational, no direct API calls
    state/         # Zustand store, one slice per domain
    i18n/          # Translation dictionary + hook
backend/
  src/
    routes/        # HTTP/Fastify layer only
    services/      # Business logic, prompt assembly, Gemini SDK calls
    middleware/     # Entitlement/rate-limit checks
    config/        # Env loading
```

See `CLAUDE.md` for the full set of module-boundary and coding conventions this project follows.
