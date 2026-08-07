# Product Specification & Architecture Document (PRD)
## Project Name: Face Reader - AI Physiognomy Tool *(internally `Ilm-i Sima` — see §5 Naming Notes)*
**Tech Blueprint:** React Native + TypeScript (Frontend) | Google Gemini (AI Core — see §4; provider still under evaluation against Anthropic Claude on pricing)
**Target Market:** US & EU (primary), positioned in the mainstream "modern mystic" app category (Co-Star / Nebula / Sanctuary / Faladdin peer set)

---

## 1. Visual & Interactive Concept (HCI & Aesthetics)

The core value of this app lies in its *experience delivery*. It should feel like a
polished, premium "cosmic fortune-teller in your pocket" — the visual language of
the Faladdin / Co-Star / Nebula generation of mystic apps, not a museum exhibit.
Ottoman/medieval iconography is retired in favor of a **universal, modern mystic**
aesthetic that reads instantly as "fun astrology-adjacent app" to a US or EU user.

* **Visual Identity:** Deep cosmic gradients (midnight indigo → violet → magenta),
  soft glowing celestial motifs (moons, stars, constellations, subtle nebula textures),
  glassmorphic cards with gentle blur and glow, holographic/iridescent accent foils
  instead of gold leaf. Rounded, friendly geometry — no gothic/spiky ornamentation.
* **Gamified Viewports:** Buttons and cards feel like glowing tarot cards or soft
  "energy orbs" rather than parchment blocks or runes. Transitions use gentle
  particle shimmer, soft cross-fades, and light-trail swipes — think "starlight,"
  not "smoke and iron."
* **Audio Feedback Ecosystem:**
  * Capture confirmation: a light, satisfying camera-shutter chime layered with a
    soft cosmic "twinkle" — no heavy mechanical/iron sounds.
  * Processing screen: a gentle ambient shimmer/pad loop (think meditation-app
    background audio), not parchment rustling.
* **Satirical/Entertainment Transparency:** The visual design should still make it
  unmistakable that this is an entertainment product — bold "for fun" iconography
  (sparkles, wink emoji-adjacent motifs, playful copy) rather than clinical framing.
  This matters *more*, not less, in the US/EU mainstream mystic-app category: these
  apps have large audiences who sometimes take results very literally (see App
  Store reviews for comparable apps). Disclaimers stay non-negotiable — they're
  just delivered in a light, on-brand voice instead of a heavy medieval one.

---

## 2. Core User Flow & Capture Mechanics

### 2.1 Onboarding
* Age gate (+18 self-attestation) inside a clean, on-brand welcome flow — think
  "cosmic onboarding carousel" rather than a "Guardian Oath crypt."
* Explicit, revocable consent checkbox for image processing, with a warm,
  plain-language privacy statement: *"Your photos are analyzed instantly and never
  stored. This is for entertainment only."*

### 2.2 Character Analysis: The Three-Expression Capture (Sequential Camera UI)
Same underlying mechanic, restyled with lighter, universally legible copy:
1. **Rest (Neutral):** Baseline capture under a soft glowing face-guide overlay, e.g. "Let your face completely relax 😌"
2. **Grin (Smiling):** Friendly chime prompt, e.g. "Now flash us your biggest grin 😄"
3. **Stern (Frowning):** e.g. "Now give us your best frown 😤"

*Validation:* On-device face detection rejects non-face frames before any API call
(privacy + cost control).

### 2.3 Reading Modules (added 2026-07-24, photo counts revised 2026-07-25)
The Analyze hub offers three reading modules, sharing the same capture
mechanics above but with different photo counts and subjects per module —
the AI system prompt and resulting reading content differ per module (see §4
for how this is wired):
* **Character Analysis** (originally "3-Expression Face Reading") — 3 photos
  of the user (Rest, Grin, Stern). The original general character/vibe
  reading.
* **Relationship Harmony Analyzer** — **2 photos, one of the user and one of
  another person** (product decision 2026-07-25 — originally spec'd as
  reading only the user's own photos). **Reversed 2026-07-28:** the two
  photos are now read *together* and scored as a pair (Chemistry & Synergy
  Score), replacing the 2026-07-25 rule that each photo be read
  independently with never a compatibility score. Product owner's explicit
  call, made after the biometric-comparison exposure was raised. The second
  person's photo requires their permission — see §6 and the Terms &
  Conditions' Acceptable Use clause.
  * **Open item:** the Privacy Policy's Biometric Data section
    (`frontend/src/content/legalContent.ts`) still states the second photo
    "is never matched, scored, or compared against the other photo," and
    leans on that to argue these photos fall outside BIPA / GDPR Art. 9.
    Shipping pair scoring makes that sentence false and weakens the
    argument. Needs legal sign-off and a rewrite before release.
  * Guardrails carried in the prompt instead: no verdict or advice about a
    real relationship, no character judgement of either person (the second
    person never asked for a reading), no guessing names/genders/ages or
    what the two people are to each other, and scores stay in the warm band.
* **Career Match** ("What Job Suits You") — **1 photo** of the user. A fun
  career-archetype vibe read, never framed as a real psychometric or
  vocational assessment.

---

## 3. Architecture & Data Flow

```text
[React Native App]
   │  (1) Captures 1-3 images locally, per module (Zustand cache, in-memory
   │      only) — see §2.3 for which module captures how many, of whom
   │  (2) Plays audio & haptic confirmation cues
   V
[Secure Backend Bridge]
   │  (3) Validates active entitlement via RevenueCat SDK
   │  (4) Wraps images into a single payload with the module's system prompt
   V
[Google Gemini — Vision, generateContent API (see §4)]
   │  (5) Returns structured JSON via config.responseSchema
   V
[React Native UI]
   │  (6) Purges images from memory immediately after response
   │  (7) Renders the Reading Screen + shareable story-format card
```

**Rate limiting (added 2026-07-29):** `requireActiveEntitlement` is still a
permissive stub pending RevenueCat (see IMPLEMENTATION_PLAN.md 5.1) — with no
paywall gate and no per-device identifier sent by the client, an unthrottled
`/api/v1/reading/analyze` is an open door to unlimited paid Gemini calls.
New dependency: `@fastify/rate-limit` (`^11.1.0`), registered globally in
`backend/src/app.ts` via `backend/src/middleware/rateLimit.ts` — 20 requests
per 10 minutes, keyed by IP (the only signal available pre-RevenueCat).
Revisit the key/limit once real accounts or device IDs exist.

**CORS (added 2026-07-30):** discovered live while sharing a dev build over
an ngrok tunnel — the backend had no CORS handling at all, so a cross-origin
preflight `OPTIONS /api/v1/reading/analyze` 404'd (Fastify's default for an
unregistered route/method), which surfaced in the app as "Could not reach
the Face Reader server." New dependency: `@fastify/cors`, registered in
`backend/src/app.ts` via `backend/src/middleware/cors.ts`, reflecting any
origin (`origin: true`) — safe here since nothing in this API is
cookie/session-authenticated, there's no cross-site credential to leak.

**Hosted legal pages (added 2026-07-29):** `GET /legal/privacy` and
`GET /legal/terms` (`backend/src/routes/legal.ts`) serve the same Privacy
Policy / Terms & Conditions content as the in-app modals, as real public HTML
— App Store Connect and Play Console both require a public URL for the
privacy policy in store listing metadata, not just in-app text. No shared
package between frontend/backend, so this is a deliberate second copy of
`frontend/src/content/legalContent.ts`'s section data (same tradeoff already
made for `readingSchema.ts`/`api/types.ts`) — a copy change has to land in
both places. Exempt from rate limiting (`config: { rateLimit: false }`) since
they're static compliance pages, not the paid AI endpoint. The frontend's
`LEGAL_URLS` (`frontend/src/api/config.ts`) points at these routes off the
same `API_BASE_URL` as the API itself, and each in-app legal modal now has an
"Open in browser" (external-link icon) link to the hosted version.

**Expo SDK 54 → 57 upgrade, `expo-av` → `expo-audio` (2026-07-29):** driven by
`react-native-vision-camera` v5 (IMPLEMENTATION_PLAN.md 6.1's groundwork) —
v5's worklets runtime (`react-native-worklets`, by Software Mansion) requires
React Native 0.83–0.86; the project was on Expo SDK 54 / RN 0.81.5. SDK 57
pins RN 0.86 and React 19.2.3. Cascading changes this forced, in case any of
these surprise a future reader:
  - `expo-av` is deprecated with no SDK-57-compatible release, so
    `frontend/src/utils/sound.ts` (capture/prompt chimes, ambient shimmer
    loop) moved to `expo-audio`'s imperative `createAudioPlayer` API. Public
    function signatures unchanged (still `Promise`-returning), so no caller
    changes needed beyond the module internals.
  - `app.json`'s top-level `newArchEnabled`, `splash`, and
    `android.edgeToEdgeEnabled` are no longer valid SDK 57 config fields (New
    Architecture and edge-to-edge are now unconditional defaults; splash
    screen config moved to the `expo-splash-screen` config plugin).
  - TypeScript 6.0 (pulled in transitively) changed its default `types` from
    "every `@types/*` package" to `[]` — `frontend/tsconfig.json` now sets
    `"types": ["jest", "node"]` explicitly, or every test file loses
    `describe`/`it`/`expect`.
  - React Native 0.86 removed `StyleSheet.absoluteFillObject` (kept only
    `absoluteFill`, same plain-object shape) — two spread-usages in
    `CaptureScreen.tsx`/`SettingsScreen.tsx` updated.
  - Vision-camera groundwork itself (added 2026-07-29, wired 2026-07-30):
    `react-native-vision-camera@5.2.0`, `react-native-nitro-modules`,
    `react-native-nitro-image`, `react-native-worklets`,
    `react-native-vision-camera-worklets`,
    `react-native-vision-camera-face-detector` — no `babel.config.js` needed
    since `babel-preset-expo` auto-detects and wires
    `react-native-worklets/plugin` when the package is present.
    `react-native-nitro-image` is flagged by `expo-doctor` as untested on New
    Architecture (mandatory in SDK 57); nothing surfaced in testing so far,
    but worth watching on a real device.
  - **CaptureScreen rewrite (2026-07-30, IMPLEMENTATION_PLAN.md 6.1):**
    `expo-camera` removed entirely (its Expo config plugin entry in
    `app.json` too — replaced with a manual `ios.infoPlist.NSCameraUsageDescription`,
    since none of the vision-camera packages ship a config plugin;
    `android.permission.CAMERA` was already a static `app.json` entry, not
    plugin-generated, so it needed no change). `CaptureScreen` now renders
    `react-native-vision-camera-face-detector`'s `<Camera>` (front/back via
    its `device`/`cameraFacing` props, same as the old `facing` prop) with a
    `usePhotoOutput({ containerFormat: 'jpeg', quality: 0.6 })` merged into
    `outputs`. `onFacesDetected` tracks whether a face is currently in frame;
    the shutter button checks that flag *before* calling
    `photoOutput.capturePhoto()` — no face means an immediate
    `goToScreen('noFaceDetected')` (clearing any already-captured photos in
    the sequence, same discard treatment as cancelling), never reaching
    `capturePhoto` or the backend, per §2.2. Capture goes through
    `photo.getFileDataAsync()` (in-memory `ArrayBuffer`) → `base64-js`'
    `fromByteArray()`, deliberately avoiding `capturePhotoToFile`/
    `saveToTemporaryFileAsync` — those write to disk, which the Privacy
    Architecture (process-and-discard, images in memory only) rules out.
    `photo.dispose()` runs immediately after encoding. Added `base64-js` as
    an explicit dependency (was only ever transitive via `react-native`
    itself) since application code now imports it directly.
  - **Pre-existing lockfile drift fixed in passing (2026-07-30):** the SDK
    57 upgrade had left `package.json` pinning `react-native@0.86.2` exactly
    while `package-lock.json`/`node_modules` were still on `0.86.0` — any
    fresh `npm install` failed with an ERESOLVE peer conflict regardless of
    this task. Separately, `devDependencies.react-test-renderer` floated on
    `^19.1.0`, which resolves to `19.2.8` and demands `react@^19.2.8` —
    conflicting with the exact `react@19.2.3` pin (`react-test-renderer` must
    always match `react`'s exact version). Pinned `react-test-renderer` to
    `19.2.3` and did a full clean reinstall; both `tsc --noEmit` and the Jest
    suite are green against the reconciled tree.
"Open in browser ↗" link to the hosted version.

**New dependency (2026-08-04):** `expo-clipboard`, added for RevealScreen's
"Copy Text" share option (see IMPLEMENTATION_PLAN.md 8.6) — a first-party
Expo SDK module, same category as `expo-haptics`/`expo-crypto` already in
use, no config plugin or `app.json` changes needed.

**New dependency (2026-08-07, piercer.ai pivot):** `expo-image-picker`
(`~57.0.8`, installed via `npx expo install`) — `CaptureScreen`'s gallery
fallback ("Choose from Library"), so users with an existing photo of the
body part they want to preview jewelry on (or a denied camera permission)
aren't stuck. A first-party Expo SDK module, same category as
`expo-haptics`/`expo-crypto`; needed `app.json`'s `expo-image-picker` plugin
entry (`photosPermission` string) plus `ios.infoPlist.NSPhotoLibraryUsageDescription`
for the iOS permission prompt copy.

**New dependency (2026-08-05):** `react-native-safe-area-context`
(`~5.7.0`, installed via `npx expo install`), Expo's standard package for
system-bar insets. Added after on-device testing (Galaxy A06, Android 14)
found RevealScreen's Share/Done buttons partly unreachable — Android's
edge-to-edge rendering (default since RN 0.76 / this app's current RN
0.86.2) draws app content behind the 3-button navigation bar unless a
screen explicitly insets around it, and this app had no safe-area handling
at all (`AnalyzeScreen.tsx`'s header comment even calls this out for the
top inset). `App.tsx` now wraps the tree in `SafeAreaProvider`;
`useSafeAreaInsets().bottom` is added to the bottom padding of every
fixed-to-the-bottom primary action: `BottomNavBar`, RevealScreen's
Share/Done footer, OnboardingScreen's Next/Get Started footer, and
PaywallScreen's Subscribe footer. Jest needs the package's own mock
reimplemented by hand in `frontend/test/mocks/react-native-safe-area-context.js`
(mapped in `jest.config.js`) — the upstream `jest/mock.tsx` internally calls
`jest.requireActual('react-native-safe-area-context')` to reach the real
context objects, which resolves back through the same `moduleNameMapper`
entry instead of the real package, so it was simpler to mock the whole
package with a fixed zero-inset object than fight that self-reference.

---

## 4. AI Integration Notes (current: Google Gemini)

* **Provider decision (2026-07-24):** switched to Google Gemini for active
  development/testing, using a `GEMINI_API_KEY` the product owner is running
  personally. Anthropic Claude remains a candidate — the choice between them is
  still a pricing decision, not an architecture one — so keep the AI-calling
  code isolated in `backend/src/services/` (client + service + schema) so a
  future switch back stays a contained change, not a rewrite.
* **Model:** `gemini-flash-latest` via `@google/genai`'s `ai.models.generateContent`
  — supports multiple images in one user turn (ordered sequence), which is
  exactly the 3-expression use case. `gemini-2.0-flash` returned a `429`
  (zero free-tier quota) on the original key; `gemini-2.5-flash` worked on
  that key's free tier as of the original 2026-07-24 decision, but as of
  **2026-07-28**, on a newly-created key, it 404s with "no longer available
  to new users" — confirmed via a live call, and `ai.models.list()` against
  that same key still lists `gemini-2.5-flash` as existing, so this is an
  account-eligibility restriction, not a global removal. Switched to
  `gemini-flash-latest` (Google's auto-updating alias for the current
  recommended flash model) instead of pinning another dated version, so a
  future deprecation doesn't require another manual code change — re-check
  quota/pricing/behavior-stability before assuming this holds at production
  volume, an alias can change behavior out from under you on Google's
  schedule, not just yours.
* **Structured output:** Gemini has no Anthropic-style forced tool-use. Instead,
  set `config.responseMimeType: 'application/json'` and `config.responseSchema`
  (an OpenAPI-subset schema using the `Type` enum: `Type.OBJECT`, `Type.STRING`,
  `Type.ARRAY`, etc. — see `backend/src/services/readingSchema.ts`) on the
  `generateContent` call. This is Gemini's native structured-output mechanism,
  not a workaround.
* **Images:** passed as `{ inlineData: { mimeType: 'image/jpeg', data } }` parts
  alongside a `{ text }` part, all within one `{ role: 'user', parts: [...] }`
  content entry — analogous to Anthropic's image-blocks-before-text pattern.
* **System prompt persona:** modernized "warm cosmic guide" voice rather than
  "16th-century court philosopher" — friendlier and more legible to a US/EU
  audience raised on Co-Star-style copy (short, punchy, a little cheeky). Passed
  via `config.systemInstruction` (Gemini's equivalent of Anthropic's `system`
  param) — unchanged in content from the Claude-era draft.
* **Per-module prompts (added 2026-07-24):** `backend/src/services/systemPrompt.ts`
  exports `READING_SYSTEM_PROMPTS`, a map keyed by `ReadingModuleId` (see §2.3)
  — one prompt per reading module, sharing a single `SAFETY_RULES` block so the
  entertainment-only/no-clinical-language/non-face/minor-fallback rules can't
  drift out of sync across modules. `generateReading` selects the prompt from
  the request's optional `module` field (defaults to `three-expression`).
* **Per-module response schemas (added 2026-07-28):** each module now returns
  its own card stack rather than the original shared
  `{ headline, insights[], narrative }` shape —
  `READING_SCHEMAS[moduleId]` in `backend/src/services/readingSchema.ts` is
  passed as `config.responseSchema`, and the payload carries a `module`
  discriminator (`character_analysis` / `relationship_harmony` /
  `career_path`) that the frontend switches on to pick a renderer. Every
  card stack is: a badge-tag card, a 0-100 overall score with exactly four
  named sub-scores, then pill arrays and/or a recommendation checklist.
  Metric `icon` values are enum-constrained to the set the app can actually
  render. Scores are a presentation device, not a measurement — the
  "stay in the 68-97 band, never punitive" rule lives in the prompts.

---

**Piercing render pipeline (added 2026-08-07, piercer.ai pivot):**
`POST /api/v1/render/preview` (`backend/src/routes/render.ts`) accepts a
single base64 photo + `jewelryType`/`finish` and returns a rendered preview
image. This is a materially different AI call than the old face-reading
feature's: that used `gemini-flash-latest` (a text/vision-in, text-out
model) with `config.responseSchema` for structured JSON output. Image
generation/editing is a distinct capability — `responseSchema` (JSON
structured output) and `responseModalities` (image output) are mutually
exclusive per `@google/genai`'s own `GenerateContentConfig` type, and
`gemini-flash-latest` is not documented as an image-output-capable model.
Verified against the installed `@google/genai@2.13.0` type definitions
(`Modality.IMAGE` in `GenerateContentConfig.responseModalities: Modality[]`)
and Google's current model docs before picking a model, rather than
guessing: **`gemini-2.5-flash-image`** ("nano banana") is the production
image generation/editing model as of 2026-08-07 — see
`backend/src/services/renderService.ts` for the exact call shape
(`config.responseModalities: [Modality.TEXT, Modality.IMAGE]`, image bytes
read back from `response.candidates[0].content.parts[].inlineData`). Unlike
`gemini-flash-latest`, there's no publicly documented auto-updating alias
for the image model as of this writing — pinned the dated name, revisit if
Google introduces one. Not live-tested against the real API in this pass
(no `GEMINI_API_KEY` in this environment, per CLAUDE.md's pause-and-ask
condition for missing secrets) — `renderService.test.ts`/`render.route.test.ts`
exercise it against a mocked client only; confirm the model name/response
shape against a real key before shipping.

**Paywall/entitlement pivot (added 2026-08-07):** the old face-reading app
had no free tier at all — the paywall gated every screen past onboarding,
so `aura_pro_access` was an all-or-nothing gate. piercer.ai's product brief
calls for a freemium model instead: `piercer_pro_access` (renamed
identifier, `frontend/src/utils/purchases.ts`) now specifically gates
**unlimited renders** (free users get `FREE_RENDER_LIMIT` — currently 1 —
renders per session before `StudioScreen` routes them to the paywall
instead of calling the render API) and **multi-piercing stacking**
(`PiercingStudioDrawer`'s "Add Another Piece" routes a non-Pro user to the
paywall instead of adding a second jewelry item; capped at
`MAX_STACKED_ITEMS` = 3 even for Pro users). Both counters are in-memory-
only session state (`entitlementSlice.freeRendersUsed`,
`studioSlice.stackedItems`), same lifetime as every other piece of session
state per the Privacy Architecture. The backend's `additionalItems` field
on `POST /api/v1/render/preview` (`renderSchema.ts`) is validated (right
shape, within the count cap) but not separately entitlement-checked beyond
the route's existing `requireActiveEntitlement` preHandler, which is still
a permissive stub pending real RevenueCat server-side verification (Phase
5.1) — so today, nothing server-side stops a client from sending
`additionalItems` without being Pro; the gate is UI-only until 5.1 lands.

**Flow reorder: piercing-selection-first (added 2026-08-08):** product
decision — pick the piercing location before capturing a photo, not after.
New order: Welcome → **PiercingLocationScreen** (new, `'location'` in
`AppScreen`) → Capture → Studio → Preview → Paywall. New shared data module
`frontend/src/content/piercingLocations.ts` (id/category/label only —
deliberately no pain-rating or description copy yet, pending a separate
product decision on tone/source) exports `PIERCING_LOCATIONS`
(lobe/helix/tragus/rook/daith/industrial/septum/eyebrow/nipple/navel,
grouped `ear`/`face`/`body`) — built to be reused by a future piercing-
reference/info page rather than duplicated. `studioSlice.selectedLocation`
holds the pick (null until chosen); `CaptureScreen` reads it to show a
location-specific guide prompt ("Position yourself so we can clearly see
your {location}") instead of the old generic body-part framing copy —
falls back to no prompt (not a broken string) if somehow reached with no
location selected. This is piece 1 of 3 in a larger piercer.ai-specific
scope change; pieces 2/3 are pending open product-decision answers.

**Piercing Reference page (added 2026-08-08, piece 2 of the 3-piece scope
change):** `frontend/src/content/piercingLocations.ts` extended from 10
locations to 26 — the original 10 gained `painRating` (1-10) and
`descriptionKey` fields reusing their existing `labelKey`s, and 16 new
locations were added from scratch (Upper Lobe, Forward Helix, Anti-Tragus,
Conch, Snug, Orbital, Bridge, Nostril, High Nostril, Philtrum/Medusa,
Labret, Monroe, Tongue, Cheek/Dimple, Surface, Dermal-as-a-location —
distinct from `studioSlice`'s `dermal` jewelry type, no collision since
they're separate id namespaces). Content/ratings are the product owner's
exact vetted text, not generated. Non-genital scope only, matching
`JEWELRY_TYPES`. New `PiercingReferenceScreen.tsx`, reachable from Settings
(`settings.row.piercingReference`) — read-only, no capture/AI/entitlement
logic. Pain ratings are framed as general community-consensus estimates,
not medical advice — that framing is rendered as visible on-page copy
(`reference.disclaimer`), not just a code comment, since a numeric pain
scale is itself a claim a user could otherwise read as clinical guidance.
Because `PiercingLocationScreen` (the pre-Capture picker) renders whatever
`PIERCING_LOCATIONS` contains per category, it now also shows all 26
options rather than the original 10 — a deliberate side effect of keeping
one shared source of truth rather than forking the list.

**Personality/body-type piercing matching module (added 2026-08-08, piece 3
of the 3-piece scope change):** three genuinely independent input legs,
per the product brief:
- **Quiz leg** (`frontend/src/content/personalityQuiz.ts`,
  `PersonalityQuizScreen.tsx`) — pure client-side, no AI/backend call. 6
  questions, 4 light on-brand archetypes (Minimalist/Romantic/Rebel/Free
  Spirit), majority-vote scoring with deterministic tie-breaking, static
  rule-based archetype -> recommended location(s) + jewelry style mapping.
- **Photo leg** (`backend/src/services/{matchSchema,matchPrompt,matchService}.ts`,
  `POST /api/v1/match/photo`, `frontend/src/api/match.ts`,
  `PersonalityPhotoScreen.tsx`) — a real AI vision call, but unlike
  render.ts this one returns structured JSON (recommended location IDs +
  reasons), not an image, so it reuses Gemini's actual `responseSchema`
  mechanism on `gemini-flash-latest` (the same model/mechanism the
  pre-pivot reading feature used) rather than render.ts's image-generation
  model. Not live-tested against a real key in this pass (none in this
  environment) — only against a mocked client in tests, same outstanding
  caveat as render.ts.
- **Body/face-type leg** (`frontend/src/content/locationJewelryRecommendations.ts`,
  a `StudioScreen.tsx` banner) — deliberately reuses the existing
  Capture -> Studio -> Preview try-on flow rather than adding a new
  recommendation screen or AI call, per the product owner's explicit
  reading of this leg: it's a static per-location jewelry-style suggestion
  surfaced as a dismissible banner once a photo is captured, with an
  "Apply" action that just pre-selects the suggested jewelry type/finish in
  the existing drawer.

Both the quiz and photo legs' result views end in a "Try It On" action that
pre-selects `studioSlice.selectedLocation`/`selectedJewelryType`/
`selectedFinish` and routes straight into Capture — none of the three legs
introduce a standalone text-only recommendation dead end.

**No disclaimer on this module** — an explicit, informed override of
CLAUDE.md's "disclaimers are non-negotiable" rule, confirmed by the product
owner specifically for this module (not the rest of the app). Flagged with
an in-code comment on `PersonalityQuizScreen.tsx` and
`PersonalityPhotoScreen.tsx` (the two screens that would otherwise carry
`DisclaimerFooter`) rather than silently omitted — same transparency
pattern as the BIPA/GDPR flag in `backend/src/routes/legal.ts`. The
module's baseline tone constraints (light, non-clinical, no negative
commentary) were never waived, just the disclaimer requirement — see
`matchPrompt.ts`'s `TONE_RULES`.

New Settings row (`settings.row.piercingMatch`) opens the module's hub
screen (`MatchHubScreen.tsx`), which offers the quiz and photo paths as two
separate buttons — not a combined picker/dropdown, per the brief.

**Location-restricted jewelry types (added 2026-08-08):** QA/product flagged
that Studio offered all 6 jewelry types (Hoops/Studs/Barbells/Industrial/
Septum/Dermal) regardless of the picked piercing location — e.g. an
Industrial barbell could be selected for Tongue, which makes no anatomical
sense. New `frontend/src/content/locationJewelryTypes.ts` (sibling file to
`piercingLocations.ts`, not folded into it — it needs `JewelryType` from
`studioSlice.ts`, which itself imports `PiercingLocationId` from
`piercingLocations.ts`, so importing `JewelryType` there directly would
create a circular import) exports `PIERCING_LOCATION_JEWELRY_TYPES`
covering all 26 locations, and `validJewelryTypesFor()` (falls back to
every jewelry type if no location is selected, same defensive pattern as
`CaptureScreen`'s location-aware guide copy). `PiercingStudioDrawer` now
filters its jewelry-type chips through this and auto-corrects
`selectedJewelryType` via a `useEffect` keyed on `selectedLocation` alone
(deliberately not on the jewelry type itself, so it reacts only to a
location change, not to the user's own in-place selection) if the current
selection becomes invalid — e.g. picking Industrial after Tongue was
selected snaps the type to `industrial` rather than leaving an
unrepresented selection. Not aiming for piercing-industry precision, just
ruling out the obviously-wrong combos, per explicit product guidance.
`content/locationJewelryRecommendations.ts` (piece 3's body/face-type leg)
and `content/personalityQuiz.ts`'s archetype recommendations were both
cross-checked against the new restriction — one mismatch found and fixed
(the Rebel archetype recommended `barbells` for its first location,
`septum`, which only allows `septum`/`hoops`; changed to `septum`).

**Follow-up (2026-08-08):** QA's final pass found the same class of bug
still present in `personalityQuiz.ts`'s *display* data — each archetype's
`ArchetypeRecommendation` listed 3 suggested locations sharing one
`recommendedJewelryType`, which only happened to be checked for index 0
(the one `PersonalityQuizScreen`'s "Try It On" actually applies). Romantic
listed `philtrumMedusa` (studs-only) under a shared "hoops" recommendation;
Rebel listed `industrial` and `snug` under a shared "septum" recommendation
— neither supports it, and in fact **no location other than `septum` itself
supports the `septum` jewelry type**, so "one shared type per archetype"
was structurally unfixable for Rebel without either dropping to fewer
distinct locations or changing the data shape. Restructured
`ArchetypeRecommendation.recommendedLocationIds`/`recommendedJewelryType`
into `recommendedLocations: { locationId, jewelryType }[]`, so every listed
location carries its own compatible type; `recommendedLocations[0]` (the
one actually pushed into app state) is unchanged from the prior fix.
`PersonalityQuizScreen`'s result chips now display both the location and
its paired type (e.g. "Snug · Barbells") instead of just the location name,
so the visible copy can never imply an unbuildable pairing.
`personalityQuiz.test.ts` gained a regression test asserting every
archetype's every listed location/jewelryType pair is valid against
`locationJewelryTypes.ts`.

## 5. Naming Notes

**Decision (2026-07-24):** the public-facing name is **"Face Reader - AI
Physiognomy Tool"** — "Face Reader" as the short form used in-app (logo
wordmark, tab bar, compact UI), the full string as the formal/App Store name.
"Ilm-i Sima" remains the internal/working codename only (repo name, internal
docs) and is not user-facing.

Flagged explicitly when this was decided, not silently applied: "physiognomy"
is a specific historical pseudo-scientific term (character-from-face-features)
with a documented association with 19th/20th-century scientific racism, and
naming the app after it sits in tension with this doc's own Entertainment
Framing rules elsewhere (no clinical/scientific-validity claims, entertainment
only) and with `CLAUDE.md`'s non-negotiable Entertainment Framing section.
Product owner confirmed proceeding with the name as specified, accepting that
tradeoff — noting it here for the record, not as an open question.

---

## 6. Market & Compliance Notes (US/EU monetization)

* **Subscription UX:** both US and EU regulators have moved toward requiring that
  canceling a subscription be as easy as starting one. Build a native,
  frictionless cancel flow into the RevenueCat paywall from day one rather than
  retrofitting it later.
* **Entertainment disclaimers:** several EU member states have specific rules
  around advertising fortune-telling/divination services as factual claims — keep
  every disclaimer intact when localizing copy, don't let it get "lost in
  translation" for a lighter tone.
* Recommend a short legal review of paywall copy and disclaimers per target
  market before launch — this is a one-time cost worth paying early.

**RevenueCat groundwork (added 2026-07-30):** no RevenueCat account exists
yet (confirmed with the product owner), so this is dependency/integration
code only, not a live billing path. `react-native-purchases@10.5.0` is
installed; `frontend/src/utils/purchases.ts` wraps `configure`,
`getOfferings`, `purchasePackage`, and `restorePurchases`, deriving
`isProActive` from `CustomerInfo.entitlements.active['aura_pro_access']` —
that identifier must exactly match whatever entitlement gets created in the
RevenueCat dashboard once a real project exists; nothing on the app side
needs to change besides the string if it's named differently there.
`PaywallScreen.tsx` calls the real SDK only when
`EXPO_PUBLIC_REVENUECAT_API_KEY` is set; every environment today has it
unset, so the screen still falls back to its original local-only stub
(`setProActive(true)` on tap, no real purchase). `jest.config.js`'s
`transformIgnorePatterns` was extended for `@revenuecat/*` sub-packages
that ship untranspiled syntax.
  - **Naming clarification, not a divergence:** CLAUDE.md's locked env var
    list names it `REVENUECAT_API_KEY`; the actual variable is
    `EXPO_PUBLIC_REVENUECAT_API_KEY` — Expo only bundles client-side env
    vars carrying that prefix (same pattern already used for
    `EXPO_PUBLIC_API_BASE_URL`), so an unprefixed name would silently never
    reach the app.
  - **Still blocked on:** a real RevenueCat account/project (with the
    `aura_pro_access` entitlement and weekly/monthly offering packages
    configured), and App Store Connect / Play Console developer accounts
    with real in-app products — RevenueCat sits on top of those, it doesn't
    replace them. The backend's `requireActiveEntitlement` stays a
    permissive stub — server-side entitlement verification needs a
    RevenueCat *secret* key and webhook setup, a separate, security-
    sensitive piece of work out of scope for this groundwork pass.
