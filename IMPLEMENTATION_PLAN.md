# Implementation Plan: Ilm-i Sima *(working title)*
**Version:** 1.1.0 (MVP Sprint Plan — US/EU Market Re-skin)
**Objective:** Build a high-fidelity, immersive mobile app with a backend bridge
to an AI vision model (currently Google Gemini, see PROJECT_SPEC.md §4), styled
for the mainstream US/EU "modern mystic" app category, within a strict
entertainment framing.

---

## Phase 1: Local Environment & Audio-Visual Asset Prep
- [x] **1.1 Expo Initialization Verification (audited 2026-07-29)**
  - Ensure the `/frontend` directory contains a compile-ready TypeScript blank template.
  - Test run via `npm run android` or `npm run ios`.
  - No Android/iOS device or emulator is available in this environment, so
    `npm run android`/`ios` can't launch interactively here — verified the
    same underlying guarantee (the template actually compiles and bundles)
    via `npx expo export --platform android` and `--platform ios`: both
    produced a clean Metro bundle (665/667 modules, zero errors). Also ran
    `npx expo-doctor`: 18/18 checks passed. `tsc --noEmit` and the full Jest
    suite (29 suites, 125 tests) are already green as of the same pass.
- [x] **1.2 Asset Gathering (Cosmic Mystic)**
  - Source or generate 3 audio effect files (`.mp3`/`.wav`, `expo-av` compatible):
    - `capture_chime.mp3` (light camera-shutter click layered with a soft cosmic twinkle).
    - `prompt_chime.mp3` (gentle bell/sparkle cue for expression prompts).
    - `ambient_shimmer.mp3` (soft looping pad/shimmer for the loading screen).
  - Place assets under `frontend/assets/audio/` and cosmic-themed SVG icons
    (stars, moons, constellations, sparkles) under `frontend/assets/icons/`.
  - Audio done (`frontend/assets/audio/*.wav`, wired via `utils/sound.ts`).
    No dedicated SVG icon set was built — `DESIGN.md` v2.0.0 re-skinned the
    app to the crimson/gold glassmorphic system, dropping the older
    "Cosmic Mystic" star/moon iconography this row was written for; the app
    uses emoji glyphs and simple vector shapes instead throughout.

---

## Phase 2: Frontend Navigation & The Reading Flow UX (HCI Focus)
- [x] **2.1 Global State & Core Theming (`Zustand`)**
  - Install Zustand (`npm install zustand`) to manage global state:
    - User age certification status (+18 gate).
    - Base64 image cache array (max 3: Calm, Bright, Deep).
    - Active paywall status derived from RevenueCat hooks.
  - Setup a master theme palette in `frontend/src/ui/theme.ts`:
    - Background: midnight indigo → violet → magenta gradient
    - Accent: holographic/iridescent foil (animated gradient shimmer)
    - Text: warm off-white / soft lavender for secondary text
    - Card surfaces: glassmorphic (blur + low-opacity white overlay + soft glow border)
- [x] **2.2 Screen 1: Onboarding & Age Gate**
  - Build a clean, cosmic-gradient welcome carousel with +18 age gate verification.
  - Add explicit checkbox for image-processing consent with a warm, plain-language
    disclaimer (see PROJECT_SPEC §2.1).
- [x] **2.3 Screen 2: The Three-Expression Capture (Sequential Camera UI)**
  - Integrate `expo-camera` or `react-native-vision-camera`.
  - Design a continuous single-session capture flow with soft glowing face-guide overlays:
    - Step 1: **Calm** → capture, triggers `capture_chime.mp3` + light haptic.
    - Step 2: **Bright** → prompt "Show us your glow ✨", triggers `prompt_chime.mp3`.
    - Step 3: **Deep** → prompt "Now give us your mysterious side 🌙", final capture.
  - On-device face bounding verification carved out to **6.1** below (deferred
    to the end of the plan per product decision).

---

## Phase 3: The Gateway Backend & AI Vision Integration
- [x] **3.1 Backend Skeleton Framework (`FastAPI` or `Node.js`)**
  - Initialize the server structure inside `/backend`.
  - Configure `.env` mapping `ANTHROPIC_API_KEY` and `REVENUECAT_API_KEY`.
  - **2026-07-24:** provider swapped to Gemini — `.env` now maps
    `GEMINI_API_KEY` instead (see PROJECT_SPEC.md §4; pricing decision still
    open between Gemini and Claude).
- [x] **3.2 Payload Serialization (`backend/src/reading/protocol/`)**
  - Construct an endpoint `/api/v1/reading/analyze` accepting 3 base64 strings in a JSON wrapper.
  - Embed the **system prompt** (warm cosmic-guide persona, defensive wording
    template, safety-first constructive-traits-only filter) into the Anthropic SDK call.
  - Use **Claude Sonnet 5** (`claude-sonnet-5`) with a **tool-use JSON schema**
    (not `response_format` — that param doesn't exist on the Anthropic API) to
    lock the output to the target schema. Force the tool via `tool_choice`.
  - **2026-07-24:** rewritten for Gemini (`gemini-2.5-flash` via
    `@google/genai`) — structured output now via `config.responseSchema` +
    `responseMimeType: 'application/json'` instead of tool-use. Live-tested
    end to end (real key, real schema, real images) — see
    `backend/src/services/{geminiClient,readingService,readingSchema}.ts`.
- [x] **3.3 Privacy Shield Enforcement (`backend/src/reading/transport/`)**
  - Implement an aggressive memory-clear function: the moment Claude returns the
    structured result, delete the base64 arrays from active memory
    (process-and-discard architecture).

---

## Phase 4: High-Fidelity Loading & The Reveal Screen
- [x] **4.1 Screen 3: Reading in Progress (Loading Core)**
  - While the backend call is in flight (3–6s), loop `ambient_shimmer.mp3` softly.
  - Render a scanning animation — soft particles/light traversing the captured
    faces, or a subtle constellation-forming effect.
  - Implemented in `AnalyzingScreen.tsx`: `startAmbientShimmerLoop()` loops
    the ambient audio for the call's duration; a pulsing logo + rotating
    scan ring stand in for the literal particle effect (simplified, matches
    the glassmorphic system rather than a separate particle engine).
- [x] **4.2 Screen 4: The Reading (Results Architecture)**
  - Reveal a glassmorphic card UI displaying: `headline`, `expression_insights`, `narrative`.
  - Mount a persistent, clearly legible `footer_disclaimer` component on every result layout.
- [x] **4.3 The Viral Catalyst (Share Card Compilation)**
  - Integrate `react-native-view-shot` to capture a vertical 9:16 story-ready
    graphic in the app's cosmic visual style.
  - Trigger native share sheet on tap.

---

## Phase 5: Monetization & Final Deploy
- [ ] **5.1 RevenueCat Hook Integration — deferred (2026-07-26)**
  - Setup the paywall component inside the frontend app.
  - Lock deep-dive interpretations and reading history behind a weekly/monthly
    subscription — cancel flow must be equally frictionless as sign-up.
  - Product decision: `react-native-purchases` is a native module, same
    category as Phase 6's face detection — installing it drops plain Expo
    Go support in favor of an EAS dev-client build. Deferred together with
    6.1 rather than sprung on the project mid-prompt-tuning session.
    Blocked on: `REVENUECAT_API_KEY` (missing from `.env`), a RevenueCat
    account, and App Store Connect / Google Play Console developer
    accounts with in-app products configured — RevenueCat sits on top of
    those, it doesn't replace them. Revisit alongside 6.1.
  - **Dependency/integration groundwork done (2026-07-30):**
    `react-native-purchases@10.5.0` installed and wired end to end —
    `frontend/src/utils/purchases.ts` wraps `configure`/`getOfferings`/
    `purchasePackage`/`restorePurchases`; `PaywallScreen.tsx` calls the real
    SDK whenever `EXPO_PUBLIC_REVENUECAT_API_KEY` is set, falling back to
    the original local-only stub otherwise (every environment today, since
    no RevenueCat account exists — confirmed with the product owner before
    building past the stub). See `PROJECT_SPEC.md` §6 for the full
    rationale, the `aura_pro_access` entitlement identifier that must match
    the RevenueCat dashboard once it exists, and the `REVENUECAT_API_KEY` →
    `EXPO_PUBLIC_REVENUECAT_API_KEY` naming clarification against
    `CLAUDE.md`'s locked env var list. `jest.config.js` extended for
    `@revenuecat/*` sub-packages; `tsc`/full Jest suite (137 tests)/
    `expo-doctor`/`expo export` all verified green. This row stays
    unchecked — the account/key/dashboard-config blockers above are
    unchanged, this is purely code that's ready for them.
  - **Live-tested end to end against a real RevenueCat project (2026-08-04):**
    a real RevenueCat account/project now exists (Test Store, not yet a real
    App Store Connect / Play Console product) — packages switched from
    weekly/annual to weekly/monthly per product decision (`purchases.ts`,
    `PaywallScreen.tsx`, translations, both copies of the Terms text).
    Verified on-device via the RevenueCat Test Store purchase dialog: a real
    `purchasePackage()` call, entitlement check, and paywall dismissal all
    worked. Row stays unchecked — still blocked on real store products, per
    the blockers above.
- [x] **5.2 End-to-End Testing Matrix (audited 2026-07-29)**
  - `backend/tests/unit` covers JSON payload handling thoroughly — malformed/
    missing/wrong-type fields at every schema nesting level, network failure,
    non-JSON response.
  - Edge-case audit against CLAUDE.md's required list: non-face-detected
    photo (`AnalyzingScreen.test.tsx`), network failure mid-analysis (3
    layers: `api/reading.test.ts`, `AnalyzingScreen.test.tsx`, backend
    `reading.route.test.ts`), age-gate rejection (`OnboardingScreen.test.tsx`)
    — all already covered, nothing to add. Expired/missing entitlement has
    nothing to test yet — `requireActiveEntitlement` is still a permissive
    stub pending 5.1, no real logic branch exists. Apparent-minor/poor-lighting
    fallbacks are AI-content behavior, not code branches — manually verified
    live against the real API in `QA_FINDINGS.md`'s MOD-2 pass; the
    schema-conformance tests above are what's actually automatable for this.
- [x] **5.3 Deployment Preparation (partial, 2026-07-29)**
  - `Dockerfile` was already complete (multi-stage, non-root user, prod-only
    deps) — verified `npm run build` produces exactly what it expects.
  - `frontend/eas.json` added (development/preview/production build
    profiles) and `app.json` gained `ios.bundleIdentifier` /
    `android.package` (`app.faceai.facereader` — a **placeholder** derived
    from the `faceai.app` domain already referenced in `ShareCard.tsx`'s
    footer; confirm/replace with the real reverse-DNS identifier before an
    actual store submission, it's effectively permanent once published).
  - Still blocked on the user: an EAS/Expo account (`eas login` +
    `eas build:configure` to generate a real `extra.eas.projectId`), Apple
    Developer Program + App Store Connect membership, Google Play Console
    developer account. None of these can be created by an agent.
  - Legal review pass: see new root-level `LEGAL_REVIEW_PACKET.md` — compiles
    all three system prompts, the full Privacy Policy/Terms text, and every
    in-app consent/disclaimer string in one place for actual review, with
    known open items (placeholder Governing Law, paid-tier AI key
    requirement) called out. The review itself still needs a human (ideally
    counsel), not something this pass could complete.
  - Also done in this pass, not originally scoped here: Privacy
    Policy/Terms are now hosted as real public pages
    (`backend/src/routes/legal.ts`, `/legal/privacy` + `/legal/terms`) —
    required for the App Store Connect / Play Console privacy policy URL
    field, which plain in-app modal text can't satisfy. See `PROJECT_SPEC.md`
    §3.

---

## Phase 6: Deferred — On-Device Face Detection (+ RevenueCat, see 5.1)
Pushed to the very end of the plan per product decision (2026-07-24): Expo
dropped its built-in face-detector module, so real detection needs a native
dependency (`react-native-vision-camera` + an ML Kit frame-processor plugin)
and a move off plain Expo Go to an EAS dev-client build — a bigger
architecture change than the rest of the plan, deliberately sequenced last.
RevenueCat (5.1) hits the exact same Expo Go tradeoff, so it's grouped in
here too (2026-07-26) — tackle both together when ready for a dev-client build.
- [x] **6.0 Placeholder UI** — `NoFaceDetectedScreen` built and wired: a
  `ReadingApiError` thrown with `code: 'NO_FACE_DETECTED'` (frontend or
  backend, once real detection exists) routes `AnalyzingScreen` straight to
  it instead of the generic error state. Nothing throws that code yet.
- [x] **6.1 On-device face bounding verification**
  - Add `react-native-vision-camera` + a face-detector frame-processor
    plugin; switch `CaptureScreen` off `expo-camera`.
  - Reject non-face frames locally before `capture_chime` fires, per
    `PROJECT_SPEC.md` §2.2 (privacy + cost control) — route straight to
    `NoFaceDetectedScreen` rather than letting a bad frame reach the backend.
  - Requires an EAS dev-client build (no longer testable in plain Expo Go).
  - **Dependency groundwork done (2026-07-29):** `react-native-vision-camera`
    v5 needs a worklets runtime requiring React Native 0.83–0.86, which
    forced an Expo SDK 54→57 upgrade first (see `PROJECT_SPEC.md` §3 for the
    full cascade — RN 0.86, `expo-av`→`expo-audio`, app.json schema fixes,
    TS 6.0's breaking `types` default, `StyleSheet.absoluteFillObject`
    removal).
  - **`CaptureScreen` rewrite done (2026-07-30):** off `expo-camera` entirely
    (package removed, its `app.json` plugin entry replaced with a manual
    `ios.infoPlist.NSCameraUsageDescription` — see `PROJECT_SPEC.md` §3),
    onto `react-native-vision-camera-face-detector`'s `<Camera>` +
    `usePhotoOutput`. Shutter press checks live `onFacesDetected` state
    first — no face routes straight to `NoFaceDetectedScreen` (discarding
    any already-captured photos in the sequence) without ever calling
    `capturePhoto` or reaching the backend, per §2.2. Capture stays fully
    in-memory (`getFileDataAsync()` → `base64-js`, never
    `capturePhotoToFile`/a temp file) per the Privacy Architecture.
    `tsc --noEmit` and the full Jest suite (139 tests) are green.
    In fixing this, also found and fixed pre-existing lockfile drift from
    the SDK 57 upgrade blocking any `npm install` (`react-native`/
    `react-test-renderer` version mismatch — see `PROJECT_SPEC.md` §3) and a
    missing `expo-dev-client` dependency (required by `eas.json`'s
    `development` build profile).
  - **On-device verification done (2026-08-04):** built and installed a real
    EAS development client on a physical Android device (Galaxy A06,
    Android 14) and drove the full flow end to end via `adb` (screenshots +
    logcat at every step, including live-typed shutter taps) — onboarding,
    paywall test purchase, all 3 Character Analysis captures, and a real
    backend-generated reading all completed successfully. `NoFaceDetectedScreen`
    routing confirmed working (an empty/faceless frame routes there without
    ever calling `capturePhoto` or reaching the backend, per §2.2).
    - Found and fixed a real bug surfaced only by physical hardware, not
      Jest mocks: `CaptureScreen`'s `handleCapture` used a catch-less
      `try/finally`, so a failed `capturePhoto()` still silently advanced
      the step (or navigated to Analyzing) as if it had succeeded —
      producing a misleadingly-worded "check your connection" failure
      several steps later with images silently missing. Fixed to only
      advance on genuine success.
    - Found (via on-device logcat) that `react-native-vision-camera-face-detector`
      reconfigures its native camera session — an unbind/rebind cycle —
      automatically the instant `capturePhoto()` is called, and that
      reconfigure's own teardown step aborts the very request that
      triggered it (`ImageCaptureException: Camera is closed`, ~100ms,
      independent of `performanceMode`) on this device. The reconfigure
      finishes shortly after the failure, so `handleCapture` now retries
      once after a 400ms wait (an immediate retry was confirmed on-device
      to hit an even earlier failure, "Not bound to a valid Camera",
      because the rebind hadn't finished) — verified on-device this
      resolves cleanly. A capture that still fails after the retry now
      shows a real `Alert` (`capture.error.title`/`.body`) instead of
      silently resetting with no feedback.
    - Also suppressed (`LogBox.ignoreLogs` in `App.tsx`) the same
      "Camera is closed" exception when it's thrown from the library's own
      internal reconfigure coroutine rather than from the awaited
      `capturePhoto()` call — that promise isn't one this app ever holds a
      reference to, so it can't be caught locally, and it fires after the
      photo is already safely retrieved. Confirmed benign, just noisy.
    - Found and fixed a real, unrelated networking bug this pass also
      exposed: Android blocks an app's own cleartext (plain HTTP) traffic
      by default on modern `targetSdkVersion`, even though tools like `adb`/
      `nc` bypass that per-app policy entirely and falsely suggested the
      network path was fine. Added `android.usesCleartextTraffic: true` to
      `app.json` — **must come back out (or be scoped to dev builds only)
      before a real production submission**, once the backend has a real
      HTTPS domain.

---

## Phase 7: Reading Modules (Relationship Harmony & Career Match)
Added 2026-07-24, not in the original spec — the Analyze hub had shipped
`Relationship Harmony Analyzer` and `Career Match` as frontend-only "COMING
SOON" teaser cards (`available: false`, routed nowhere) with zero backend
support: no per-module prompt, no request parameter, nothing in
PROJECT_SPEC.md. Product decision: build real per-module differentiation
rather than just flip the flag, since the card copy already promises
relationship/career-specific content a generic reading wouldn't deliver.
- [x] **7.1 Backend: per-module system prompts + request routing**
  - `ReadingModuleId` type (`three-expression` | `relationship-harmony` |
    `career-match`) in `backend/src/services/readingSchema.ts`.
  - `READING_SYSTEM_PROMPTS` map in `backend/src/services/systemPrompt.ts` —
    each module's prompt shares the same `SAFETY_RULES` block (entertainment-
    only, no clinical language, no negative traits, non-face/minor
    fallbacks) so a future edit can't silently apply to only one module.
  - `POST /api/v1/reading/analyze` accepts an optional `module` field
    (defaults to `three-expression` for backward compatibility) and forwards
    it to `generateReading`.
  - **Flagged for product owner review** (same as the original system
    prompt draft): all three prompts are first drafts, not legally
    reviewed — read them before this ships to real users.
- [x] **7.2 Frontend: module selection threaded through capture → reading**
  - `CaptureSlice.selectedModule` (Zustand) set by `AnalyzeScreen` when a
    module card is tapped, read by `AnalyzingScreen` when calling
    `analyzeReading`.
  - Both modules flipped to `available: true` on the Analyze hub; mock API
    mode (`mockReading.ts`) returns a distinct canned reading per module so
    `EXPO_PUBLIC_USE_MOCK_API=true` testing can verify the content actually
    differs, not just that navigation works.
- [x] **7.3 Per-module photo counts (2026-07-25)** — product decision
  revising 7.1/7.2's original "same 3-expression mechanic for every module"
  assumption: Character Analysis stays at 3 photos of the user, Relationship
  Harmony now captures 2 (**one of the user, one of another person** — a
  materially bigger scope than the module's original one-person design, see
  PROJECT_SPEC.md §2.3), Career Match captures 1.
  - Generalized the reading schema off the fixed Calm/Bright/Deep shape:
    `expression_insights: [{expression, insight}]` → `insights: [{label,
    insight}]` (both `backend/src/services/readingSchema.ts` and
    `frontend/src/api/types.ts`), `AnalyzeReadingPayload.{calm,bright,deep}`
    → `photos: string[]`. `MODULE_PHOTO_COUNTS` (mirrored on both sides)
    enforces the right count per module; `generateReading` rejects a
    mismatched count before ever calling Gemini.
  - `CaptureSlice.images` is now a plain ordered array (was a
    calm/bright/deep record) — `CaptureScreen`'s step sequence is now a
    per-module `MODULE_STEPS` map; Relationship Harmony's second step uses
    the back camera (photographing someone else) where every other step
    uses the front camera (a selfie).
  - Relationship Harmony's prompt rewritten for the real two-person
    scenario: independent per-person insights, explicitly never a
    compatibility score or a claim about the two people's actual
    relationship (see PROJECT_SPEC.md §2.3 and the Biometric Data section
    of `legalContent.ts`, both updated to match — a second real person's
    photo being processed is a materially different privacy posture than
    the module's original one-person design, flagged and confirmed with
    the product owner before building rather than assumed).
  - `RevealScreen`'s per-insight cards now render a generic label instead
    of a Calm/Bright/Deep-keyed glyph lookup — works unchanged for any
    module's insight shape. `ShareCard` was already headline/narrative-only
    and needed no changes to work across all three modules.

---

## Phase 8: Reveal Screen Polish & Results History (2026-07-28)
- [x] **8.1 Reveal screen action row restyle** — the Share/Done buttons no
  longer sit on a filled pill; `PrimaryButton` gained a `flow` prop that
  strips the background/border down to bold icon+label text so the footer
  reads as floating controls, not a block. `DisclaimerFooter` moved out of
  that footer into the end of the card `ScrollView` and shrank (fontSize 9)
  per product direction — still always rendered (CLAUDE.md's disclaimer
  requirement stands), just no longer competing with the buttons for
  attention.
- [x] **8.2 Reveal card punchlines enlarged** — `ReadingCards.tsx`'s
  `badgeChipText` (headlineLg/22, glow) and `matchName` (headlineLg/30,
  glow) now read as the loudest text in each card, per product direction
  for "more dynamic, more visible" hooks.
- [x] **8.3 Results tab: reading history log** — new `HistorySlice`
  (`frontend/src/state/slices/historySlice.ts`) logs every completed
  `ReadingResult` (text only, never the photos — same process-and-discard
  boundary as before) the moment `AnalyzingScreen` gets a result back.
  `ResultsScreen` now lists past reads (module, punchline, summary, date)
  instead of always showing the empty state; tapping an entry reopens it in
  `RevealScreen`. In-memory only — resets on app restart, since no
  local-storage dependency is in `PROJECT_SPEC.md` yet and one wasn't added
  here. Product decision (2026-07-28): the original 5.1 plan to gate
  reading history behind Aura Pro no longer applies now that there's no
  free tier — history is unconditional, not `isProActive`-gated.
- [x] **8.4 Multi-photo reveal: swipeable slider, enlarged** (2026-08-04) —
  `PhotoStripCard` (`ReadingCards.tsx`) now pages through Character
  Analysis/Relationship Harmony's multiple photos one at a time at full
  card width via `SwipeablePager` (the same component onboarding uses) with
  progress dots, instead of squeezing them into small side-by-side
  thumbnails. Career Match's single photo is unchanged (still fills the row
  directly — no pager needed for one photo).
- [x] **8.5 Reveal footer buttons enlarged** — `PrimaryButton`'s `flow`
  variant (used only by RevealScreen's Share Reading/Done buttons)
  increased from 14/16px to 18/19px padding and label size.
- [x] **8.6 Multiple share options + optional photo-in-card** — Share
  Reading now opens `ShareOptionsModal` instead of sharing immediately:
  Story Card (the existing `react-native-view-shot` image capture, now
  with an opt-in "Include my photo" toggle that embeds the first captured
  photo into `ShareCard`), Quick Message (native share sheet with a text
  summary), and Copy Text (`expo-clipboard`, new dependency — see
  PROJECT_SPEC.md). No image is ever included unless the user explicitly
  opts in, consistent with the process-and-discard privacy posture
  elsewhere.
- [x] **8.7 Transparent app icon** — `AppLogo` (used by `LoadingScreen`,
  `AnalyzingScreen`, `WelcomeScreen`, and `ShareCard`) switched from
  `logo-badge.png` to a new transparent-background mark supplied by the
  product owner (`assets/logo-badge-transparent.png`), `resizeMode:
  'contain'` since the source has generous padding around the emblem;
  dropped the now-pointless `borderRadius` on the badge frame.
- [x] **8.8 Share card builder v2** (2026-08-05) — Redefined per product
  feedback: sharing isn't a fixed text/image choice anymore, it's a
  per-module card the user builds themselves. `readingShareableSections()`
  (`api/types.ts`) flattens each module's cards into a titled-section
  picklist; `ShareOptionsModal` gained a `builder` mode with a
  photo-include toggle and a checkbox per section (`AnimatedCheckbox`,
  all-selected by default); `ShareCard` now renders whatever sections it's
  handed instead of a fixed headline/score layout, height driven by content
  instead of a fixed 9:16 crop.
- [x] **8.9 External legal links + logo size fix** (2026-08-05) — Terms and
  Privacy now open the product owner's Google Sites pages
  (`utils/legalLinks.ts`) from every surface (Onboarding consent step,
  Settings, Paywall footer) instead of an in-app modal; deleted the
  now-orphaned `PrivacyPolicyModal`/`TermsModal`/`LegalDocumentModal`
  components and trimmed `content/legalContent.ts` down to the one export
  still used in-app (`LEGAL_CONTACT_EMAIL`) — the full legal text stays
  live in `backend/src/routes/legal.ts` for the store-listing URL
  requirement, just no longer duplicated into the frontend bundle. Also
  re-cropped `assets/logo-badge-transparent.png` (source PNG's real emblem
  only filled ~23% of its canvas width) and bumped `AppLogo`'s badge sizes
  (60/168, was 44/128) — the product owner flagged the icon as "way too
  small" across loading screens.
- [x] **8.10 Fix unreachable bottom buttons on edge-to-edge Android**
  (2026-08-05) — On-device testing (Galaxy A06, Android 14, 3-button nav)
  found RevealScreen's Share Reading/Done buttons didn't respond to taps
  near the bottom of the screen; traced via `adb shell dumpsys window` to
  Android's edge-to-edge rendering drawing the system navigation bar
  (bottom 90px) on top of app content, with this app having no safe-area
  handling at all. Added `react-native-safe-area-context` (see
  PROJECT_SPEC.md), wrapped `App.tsx` in `SafeAreaProvider`, and added
  `useSafeAreaInsets().bottom` to every screen with a fixed bottom action:
  `BottomNavBar`, RevealScreen's Share/Done footer, OnboardingScreen's
  Next/Get Started footer, PaywallScreen's Subscribe footer. Verified live
  on-device (uiautomator dump confirmed the button bounds, then confirmed
  the fixed build's builder flow reaches the native share sheet).

---

## Phase 9: piercer.ai Core Flow (2026-08-07 pivot)
Everything above this line describes the pre-pivot `Ilm-i Sima` face-reading
app (kept for history — Phase 1-8 code was scrubbed in the piercer.ai pivot,
see `chore(pivot)` commit). This phase is the new product's core loop:
Capture → Piercing Studio → AI Render → Preview → Paywall.
- [x] **9.1 Body Part Capture** — `CaptureScreen` generalized off the old
  face-shaped oval guide overlay to a neutral framing box; added a gallery-
  upload fallback (`expo-image-picker`, new dependency — see PROJECT_SPEC.md)
  alongside the live camera and as a non-dead-end option when camera
  permission is denied.
- [x] **9.2 Piercing Studio Drawer** — new `studioSlice` (selected jewelry
  type/finish: hoops/studs/barbells/industrial/septum/dermal x silver/gold/
  titanium/blackSteel), `PiercingStudioDrawer` component, `StudioScreen`.
  `'studio'` added to `AppScreen`; `CaptureScreen` now routes there instead
  of the old `'settings'` placeholder.
- [x] **9.3 AI Render Backend** — `backend/src/services/{renderSchema,
  renderPrompt,renderService}.ts` + `POST /api/v1/render/preview`
  (`routes/render.ts`, its first real usage of `requireActiveEntitlement`).
  Uses `gemini-2.5-flash-image` (image generation/editing), deliberately
  distinct from the reading-era `gemini-flash-latest` (text/vision-in,
  text-out only) — verified against `@google/genai`'s own type definitions
  before picking a model rather than guessing; not live-tested against a
  real key (none in this environment). `frontend/src/api/render.ts` is the
  only file allowed to call it, with a mock mode for testing without a
  backend/key.
- [x] **9.4 Preview & Tweaks** — `PreviewScreen`: before/after toggle,
  four placement steppers (position X/Y, rotation, scale — pure client
  state, no new slider dependency), share/export via the existing
  `react-native-view-shot` + native `Share` pattern, persistent
  `DisclaimerFooter`. `'preview'` added to `AppScreen`.
- [x] **9.5 Paywall Integration** — RevenueCat entitlement renamed
  `aura_pro_access` → `piercer_pro_access`. Unlike the pre-pivot app (no
  free tier at all), piercer.ai gates two specific capabilities behind it:
  unlimited renders (`entitlementSlice.freeRendersUsed` vs.
  `FREE_RENDER_LIMIT`) and multi-piercing stacking
  (`studioSlice.stackedItems`, capped at `MAX_STACKED_ITEMS`). Backend
  accepts stacked items (`RenderRequest.additionalItems`) but does not yet
  separately entitlement-check them server-side beyond the route's existing
  (still-stub) `requireActiveEntitlement` — flagged explicitly, not silently
  assumed enforced.

Outstanding for a future pass: real end-to-end testing against a live
`GEMINI_API_KEY` (not present in this environment, per CLAUDE.md's pause
condition for missing secrets — every AI-calling test here uses a mocked
client); real server-side RevenueCat verification (Phase 5.1, still
blocked on an account/webhook setup); on-device verification of the new
camera guide overlay and gallery picker (no device/emulator in this
environment, same constraint noted throughout the pre-pivot phases above).
