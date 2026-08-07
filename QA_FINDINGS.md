# QA Findings: UI/UX & Debugging Passes

Tracks issues found during manual UI/UX test + debugging passes over the app,
separate from `IMPLEMENTATION_PLAN.md`'s feature checklist. Same spirit: one
unchecked `[ ]` row per open issue, checked off `[x]` once fixed and verified
(typecheck + relevant test suite green). Log new passes as new dated sections
rather than editing old ones away, so this stays a record of what was found
and when, not just current state.

---

## Pass 1 — 2026-07-24 (mocked-API web build + code review)

Scope: full onboarding → paywall → analyze hub → capture-permission flow
driven live in a browser against `EXPO_PUBLIC_USE_MOCK_API=true`, plus a
source read of every screen in `frontend/src/screens/`. Backend verified via
`tsc --noEmit` + `npm test`; confirmed it correctly refuses to boot without
`ANTHROPIC_API_KEY` rather than failing silently.

- [x] **QA-1: Dead links on the paywall footer**
  `PaywallScreen.tsx`'s "Restore Purchases" and "Terms of Service" footer
  links were plain `<Text>` with no `onPress`, styled identically to the
  adjacent "Privacy Policy" which *did* work — reproduced live, confirmed
  inert in the DOM. Fixed: "Terms of Service" now opens the existing
  `TermsModal`; "Restore Purchases" shows an honest "no previous purchases
  found" alert (no RevenueCat integration yet — see Phase 5.1 in
  `IMPLEMENTATION_PLAN.md` — so it can't do a real lookup, but it must not
  look broken).

- [x] **QA-2: Camera-permission-denied screen was a navigational dead end**
  `CaptureScreen.tsx`'s permission-not-granted view had no back button, no
  bottom nav — only "Allow Camera Access." A user who denies/lacks camera
  access had no way back into the app short of a restart. Reproduced live
  (the test browser sandboxes real camera access, landing on this exact
  screen). Fixed: added a close button (`goBack()`, same pattern as
  `PaywallScreen`/`ReviewScreen`) to that view.

- [x] **QA-3: "Restore Purchases" unwired in Settings too**
  `SettingsScreen.tsx`'s Subscription section had a "Restore Purchases" row
  with no `onPress`, still rendered with a chevron implying it was
  actionable — no "coming soon" treatment like the Analyze hub uses for its
  unbuilt modules. Fixed: wired to the same honest "no previous purchases
  found" alert as QA-1.

- [x] **QA-4: Paywall oversold "Full Reading History"**
  The paywall's third feature bullet advertised "Full Reading History &
  High-Res Story Share Cards," but `ResultsScreen.tsx` always shows the
  empty state — no reading is ever persisted (by design, per the
  process-and-discard privacy architecture in `PROJECT_SPEC.md` §3). Real
  reading-history persistence is out of scope for a copy fix and would need
  its own product decision (where would history even live, given
  process-and-discard?), so the safer fix was correcting the claim rather
  than building the feature. Changed the bullet to "High-Res Story Share
  Cards" only, which is real and already shipped (Phase 4.3).

- [x] **QA-5: `IMPLEMENTATION_PLAN.md` 2.3 face-detection gap (informational, not a bug)**
  Confirmed `CaptureScreen.tsx` takes photos unconditionally with no local
  face-bounding check — 2.3's "reject non-face frames locally" is genuinely
  not implemented (the only face check is a soft mention in the backend's
  system prompt, which is a content fallback, not a capture-time guard).
  Product decision (2026-07-24): defer real on-device detection to the end
  of the plan (now Phase 6.1 in `IMPLEMENTATION_PLAN.md`) rather than block
  on it now. Built the placeholder destination in the meantime:
  `NoFaceDetectedScreen` + a `ReadingApiError('NO_FACE_DETECTED')` routing
  hook in `AnalyzingScreen`, so 6.1 has somewhere real to route into once
  it lands.

---

## Security Review — 2026-07-24 (Gemini backend integration)

Scope: the backend's switch from Anthropic to Google Gemini (`fada92b`) —
checked for hardcoded/logged/committed keys, client-side key exposure,
missing rate limiting, missing input validation, and error handling that
leaks internals, per standard practice for reviewing a new third-party AI
API integration.

- [x] **SEC-1: Confirmed no API key ever entered git history**
  Searched all branches/commits for the Google key prefix (`git log --all -p
  -S "AIza"`) and for `api_key.txt` specifically (`git log --all
  --full-history`) — zero hits either way. The key lives only in
  `backend/.env` (gitignored) and is loaded via `process.env.GEMINI_API_KEY`
  in `config/env.ts`; the frontend has zero references to it. No rotation
  needed. (The commit message for `fada92b` already notes a loose
  `api_key.txt` was gitignored before ever being committed — verified that
  claim rather than taking it on faith.)

- [x] **SEC-2: No response leaks the raw Gemini SDK error to the client**
  Traced every failure path in `readingService.ts` — each one wraps the
  underlying error in a `ReadingServiceError` with a static, hand-written
  message; the real `cause` is attached to the Error object for internal
  use only and is never serialized into the HTTP response. No fix needed,
  confirmed by reading, not just assuming.

- [x] **SEC-3: No per-field size cap on the analyze request body**
  `analyzeBodySchema` only had `minLength: 1` on `calm`/`bright`/`deep` —
  Fastify's global 1 MiB `bodyLimit` was the only backstop, which doesn't
  catch a single field stuffed with a disproportionate amount of that 1 MiB
  budget before a paid Gemini call gets made. Fixed: added `maxLength:
  1_000_000` per field in `backend/src/routes/reading.ts` — defense in
  depth, not a replacement for the global limit.

- [x] **SEC-4: No sanitized fallback for genuinely unexpected errors**
  Every *expected* failure was already sanitized (SEC-2), but nothing
  guarded the fallback path if something unanticipated ever threw outside
  those wrapped call sites — Fastify's default error handler would echo
  `error.message` straight back to the client. Fixed: added a
  `setErrorHandler` in `backend/src/app.ts` that passes Fastify's own
  (already-safe) validation errors through unchanged, logs anything else
  server-side via `console.error`, and returns a generic message to the
  client instead.

### Flagged for your judgment — not fixed
- **Gemini API key appears to be on the free tier, not paid.** Per the
  `fada92b` commit message, `gemini-2.0-flash` 429'd with "zero free-tier
  quota" and `gemini-2.5-flash` "works on the free tier." Google's own
  docs (`ai.google.dev/gemini-api/docs/logs-policy`) state the free tier
  is used to improve Google's products and may be seen by human
  reviewers, for users outside the EEA/UK/Switzerland — only the paid
  tier gets the "not used for training" guarantee. The updated Privacy
  Policy (`legalContent.ts`) now states the no-training guarantee as
  policy, which requires the production key to actually be on a
  billing-enabled project before launch, or that claim is false for
  non-EEA/UK/Swiss users. Your call on when to switch — probably fine to
  stay on free tier through active development, but this needs to change
  before any real user photos hit the endpoint.
- **No rate limiting on `/api/v1/reading/analyze`.** Combined with
  `requireActiveEntitlement` still being a permissive stub (by design,
  pending Phase 5.1's RevenueCat integration), anyone who can reach the
  server can currently call the paid Gemini endpoint unlimited times. A
  proper fix (`@fastify/rate-limit`) is a new dependency, which
  `CLAUDE.md` requires updating `PROJECT_SPEC.md` for first — your call
  on whether to add it now or track it as a pre-launch blocker alongside
  Phase 5.1/5.2.
- **AI provider is Gemini, not Claude, contrary to what `CLAUDE.md` used to
  lock.** You'd already updated `CLAUDE.md`/`PROJECT_SPEC.md` yourself in
  `fada92b` to describe this as an explicit, dated, "under evaluation, not
  final" decision — noting here only so it's visible in this file's record,
  not because it's unresolved.

### Minor / cosmetic (not tracked as checklist items — no action taken)
- Several `Animated`-driven components trigger React "not wrapped in
  act(...)" warnings under Jest — test hygiene, not a functional issue.
- Web console warnings: `expo-av` deprecated in favor of `expo-audio` /
  `expo-video`; `shadow*` style props deprecated in favor of `boxShadow`;
  `useNativeDriver` unsupported on web (expected — falls back to JS
  animation).
- `@types/jest@30.0.0` vs Expo's expected `29.5.14` — version-mismatch
  warning at dev-server startup, nothing currently broken by it.

---

## Module Activation — 2026-07-24 (Relationship Harmony & Career Match)

Scope: the Analyze hub's two "COMING SOON" module cards, which the product
owner believed were built-but-gated. They weren't — pure frontend teaser
cards with zero backend support. See Phase 7 in `IMPLEMENTATION_PLAN.md` and
§2.3/§4 in `PROJECT_SPEC.md` for the full build.

- [x] **MOD-1: Test-suite flakiness in `AnalyzingScreen.test.tsx`**
  Found during this session's earlier UI/UX pass and again here after adding
  a module-selection test to the same file: this screen runs two continuous
  `Animated.loop` calls that fall back to real JS timers under Jest (no
  native driver in the test environment), which reliably pushed the file
  past Jest's 5000ms default timeout on this dev machine even though the
  actual assertions resolved correctly given more time (12s observed vs 5s
  default). Fixed properly this time: `jest.setTimeout(20000)` for this
  file, rather than leaving it as a recurring false-red. Verified passing
  standalone and as part of the full suite after the fix.

- [x] **MOD-2: Live-verified all three modules against the real Gemini API**
  Product owner asked to confirm the real API (not mock mode) end to end.
  Booted `backend/src/server.ts` against the real `GEMINI_API_KEY` and
  posted a non-face test image (a UI screenshot, not a consented person's
  photo) to `/api/v1/reading/analyze` for all three `module` values.
  All three returned `200` with schema-valid JSON, and — genuinely useful
  signal — all three correctly triggered `SAFETY_RULES`' non-face fallback
  ("say so plainly and kindly... rather than fabricating an insight"),
  each in its own module's voice (e.g. career-match: "we need a clear shot
  of your calm gaze to find your inner strategist"; relationship-harmony:
  "unlock your unique relational vibe"). Also re-verified the SEC-3/SEC-4
  hardening against the live server, not just mocks: an invalid `module`
  value correctly 400s with Fastify's own safe validation message, and a
  malformed-image request 502s with the sanitized static message, no raw
  Gemini error leaking through either way. `gemini-2.5-flash` responded
  successfully on the current (free-tier) key — no `429`.

---

## Pass 2 — 2026-07-24 (full re-test: paywall/camera fixes + Gemini + new modules together)

Scope: re-ran the whole stack together for the first time — Pass 1's fixes,
the Gemini backend swap, the security hardening, and the two newly-activated
modules had each been verified individually but never all at once. Full
`tsc --noEmit` + Jest suites green on both frontend (28 suites/105 tests)
and backend (11 tests) going into this pass; this section covers the live
browser walkthrough on top of that.

- [x] **RETEST-1: Pass 1 fixes still hold after everything since**
  Re-drove the flow live in a mocked-API browser build: Privacy Policy
  modal opens and renders the new Biometric Data/Gemini content correctly
  (QA-8 update didn't break the modal); paywall's "Restore Purchases" is
  now a real `button` and "Terms of Service" a real `link` in the DOM
  (QA-1); paywall's third feature bullet reads "High-Res Story Share
  Cards," not the old "Full Reading History" overclaim (QA-4); the
  camera-permission screen's close button is present and actually
  navigates back to Analyze, not just rendered (QA-2); Settings'
  "Restore Purchases" is a real `button` matching every other row (QA-3).
  No regressions from the module-activation or legal-content work.

- [x] **RETEST-2: Both new modules confirmed live in the UI, not just tests**
  "Relationship Harmony Analyzer" and "What Job Suits You" both show the
  same `›` chevron as the original module (available, not dimmed, no
  "COMING SOON" badge). Tapped Career Match: routed into the capture
  permission screen exactly like the original module. This is on top of
  the unit-test coverage (`AnalyzeScreen.test.tsx`,
  `AnalyzingScreen.test.tsx`) and the live-Gemini-API verification in
  MOD-2 above — navigation, state wiring, and actual AI content are all
  independently confirmed working.

### Tooling note (not an app bug)
`Alert.alert("Restore Purchases", ...)` doesn't produce a capturable
dialog in this headless Browser-pane environment on the web platform —
confirmed via `jest.spyOn(Alert, 'alert')` in `PaywallScreen.test.tsx` /
`SettingsScreen.test.tsx` that the call happens with the correct
title/message; the actual shipped target (iOS/Android) renders `Alert`
natively. Separately, the Browser pane's simulated `left_click` didn't
register on `LegalDocumentModal`'s "Close" button (a raw DOM
`.click()` didn't register either) even though `PrivacyPolicyModal.test.tsx`
passes `fireEvent.press` against the same component — a React Native Web
touch-responder quirk under this specific browser automation, not
something to chase further given the unit-test coverage already confirms
the close handler is wired correctly.

---

## Rebrand — 2026-07-24 (Face Reader - AI Physiognomy Tool)

- [x] **RENAME-1: Full app rename from FaceAI to Face Reader**
  Token-swapped "FaceAI" → "Face Reader" everywhere it was user- or
  model-facing (in-app copy across all 10 languages in `translations.ts`,
  legal content, backend system prompts, error messages) plus `app.json`'s
  `name` field and the camera-permission string. Renamed the first module
  to "Character Analysis" per direction. Left the old Stitch-era design
  mockup HTML files in `files_for_claude/` untouched — static reference
  material, never rendered by the actual app.
  **Flagged before starting, not silently applied** (see
  `PROJECT_SPEC.md` §5): "physiognomy" is a specific historical
  pseudo-scientific term (character-from-face-features, associated with
  19th/20th-century scientific racism) that sits in tension with this
  app's own locked Entertainment Framing rules (no scientific-validity
  claims). Product owner confirmed proceeding with the name as specified.

- [x] **RENAME-2: Global Jest timeout fix, not another one-off patch**
  A *different* file (`SwipeablePager.test.tsx` / `OnboardingScreen.test.tsx`
  this time) hit the same "passes in isolation, times out under full-suite
  load" pattern already diagnosed for `AnalyzingScreen.test.tsx` earlier
  this session. Rather than keep patching individual files as they each
  happen to get unlucky, moved the fix to `jest.config.js`
  (`testTimeout: 20000` globally) and removed the now-redundant per-file
  `jest.setTimeout` override in `AnalyzingScreen.test.tsx`.

---

## Rate Limiting — 2026-07-29

Scope: closing out the Security Review's "No rate limiting on
`/api/v1/reading/analyze`" flag (above) ahead of a public launch with no
RevenueCat gate to slow abuse down.

- [x] **RATE-1: `@fastify/rate-limit` added, 20 req/10min per IP** — see
  `backend/src/middleware/rateLimit.ts`, registered in `app.ts`, documented
  in `PROJECT_SPEC.md` §3.

- [x] **RATE-2 (found while building RATE-1): unawaited plugin registration
  silently never rate-limited anything.** `@fastify/rate-limit` attaches
  itself to routes via an `onRoute` hook set up inside its own async plugin
  body. Calling `app.register(rateLimit, opts)` without awaiting it, then
  immediately calling `registerReadingRoutes(app, ...)` (which synchronously
  adds the route), ran the route registration before the plugin's `onRoute`
  hook existed to see it — the route was added to the router with zero
  rate-limit hook attached, no error, no warning, `x-ratelimit-*` headers
  simply never appeared and no request was ever blocked, at any volume.
  Caught by writing a real test that fired 21 requests and asserting a 429
  (RATE-1's test would have shipped a no-op rate limiter silently if that
  test had used a mock instead of `buildApp` + real `.inject()` calls).
  Reproduced in isolation with a minimal Fastify app to confirm the
  mechanism, not just patched and hoped: awaiting `app.register(...)` before
  registering routes fixed it in isolation, then in the real app. Fix:
  `buildApp` is now `async` and awaits `registerRateLimit(app)` before
  `registerReadingRoutes` — `server.ts` and both test files updated to
  `await buildApp(...)` accordingly.

- [x] **RATE-3 (found in the same pass): a custom `errorResponseBuilder`
  returning a plain object instead of a real `Error` fell through
  `setErrorHandler`'s generic branch.** The plugin `throw`s whatever
  `errorResponseBuilder` returns on exceeding the limit; a plain
  `{ error: string }` object has no `.validation` or recognizable
  `.statusCode`, so it landed in the backend's catch-all "unexpected error"
  branch (SEC-4) and came back as a sanitized-but-wrong 500 instead of a
  429. Fixed by having `errorResponseBuilder` return a real `Error` with
  `.statusCode = 429` set, and adding an explicit `error.statusCode === 429`
  branch in `app.ts`'s `setErrorHandler` alongside the existing
  `error.validation` one — SEC-4's defensive catch-all still only fires for
  genuinely unexpected errors, not this now-expected control-flow path.

---

## Per-Module Photo Counts — 2026-07-25

Scope: product decision to give each reading module its own photo count
(Character Analysis 3, Relationship Harmony 2 — one per person, Career
Match 1) instead of every module sharing the original 3-expression
mechanic. See Phase 7.3 in `IMPLEMENTATION_PLAN.md` for the full build.

- [x] **PHOTO-1: Relationship Harmony now genuinely processes two real
  people's photos — flagged before building, not silently expanded**
  The module's original design ("Never a compatibility match... the app
  only ever captures one person's photos") is exactly backwards under the
  new spec. Two real people's photos being analyzed together is a
  materially bigger privacy/legal footprint (reopens the GDPR Art.9/BIPA
  analysis from the original Biometric Data section) and the module's
  system prompt made claims that would now be false. Flagged to the
  product owner before writing any code; decision: independent per-person
  insights, never a compatibility score or a claim about the two people's
  actual relationship (the safer of two options offered). Rewrote the
  Relationship Harmony system prompt and the Biometric Data /
  Acceptable-Use-adjacent language in `legalContent.ts` to match reality
  instead of the stale one-person framing.

- [x] **PHOTO-2: Generalized the reading schema instead of bolting on a
  third shape**
  Character Analysis (3 expression-keyed insights), Relationship Harmony
  (2 person-keyed insights), and Career Match (2-3 facet-keyed insights)
  don't share a single fixed insight shape — `expression: 'calm' |
  'bright' | 'deep'` couldn't represent any of the other two. Rather than
  add a second or third schema variant, generalized to `insights:
  [{label: string, insight: string}]` on both backend
  (`readingSchema.ts`) and frontend (`api/types.ts`), with the label's
  actual meaning governed by each module's system prompt rather than a
  fixed enum. `RevealScreen`'s Calm/Bright/Deep-keyed glyph lookup
  (`EXPRESSION_GLYPHS`) is gone in favor of a module-agnostic glyph —
  works unchanged for any label. Verified `ShareCard` needed zero changes
  to already work across all three modules (it only ever rendered
  `headline`/`narrative`, never per-insight data).

- [x] **PHOTO-3: Camera facing follows what's actually being photographed**
  Relationship Harmony's first capture step (the user's own photo) uses
  the front camera like every other module's steps; its second step
  (photographing another person) switches to the back camera — the user
  can't usefully photograph someone else while looking at their own
  selfie view. Not explicitly requested, but the feature wouldn't work
  well in practice without it.

---

## Pass 3 — 2026-08-07 (full-stack test audit + coverage sweep)

Scope: fresh checkout (both `node_modules` absent — reinstalled), full
`tsc --noEmit` + Jest on both sides as a baseline, then a Jest coverage
sweep to find logic that no test was actually exercising, plus a doc-vs-code
audit. Baseline was already green: backend 5 suites/38 tests at 96% stmt
coverage, frontend 28 suites/142 tests at 85.4% stmt / 75.5% branch.

- [x] **PASS3-1: Abandoned readings leaked their photos into the next capture
  session** — the one real bug this pass. `AnalyzingScreen` left `images`
  populated on *every* exit path except success: "Back to Analyze" from the
  error state, and the `NO_FACE_DETECTED` route. Only the success path hands
  the photos to `RevealScreen`, which is the sole caller that purges them
  (on unmount). Two consequences, one privacy and one functional: captured
  photos sat in the Zustand store for the rest of the session against
  process-and-discard (`PROJECT_SPEC.md` §3), and the next capture session's
  `addImage()` calls appended onto the stale array — overshooting
  `MODULE_PHOTO_COUNTS` and failing the count check with a misleading
  "we couldn't complete your reading," with no way out but an app restart.
  Reproduced with a failing test first (both paths), then fixed via an
  `abandonReading()` helper that clears before navigating.
  Note the count-mismatch error state was itself unreachable-by-design
  before this and self-heals now: leaving it purges the bad array.

- [x] **PASS3-2: The share-card/history helpers had no direct test at all**
  `api/types.ts` sat at 58% stmt / 37.5% branch — `readingBadgeCard`,
  `readingScoreCard` and `readingShareableSections` each switch on `module`,
  and only the `character_analysis` arm was ever executed (incidentally, via
  `RevealScreen.test.tsx`). The `career_path` arms were entirely unexecuted.
  These fail soft, not loud: a missed arm renders a blank history row or
  silently drops a section from a user's share card. Added `api/types.test.ts`
  covering all three modules through all three helpers, plus id-uniqueness
  (`RevealScreen` keys its section picker off those ids) and a lockstep
  assertion that `MODULE_PHOTO_COUNTS` still matches the backend's numbers.
  58% → 100%.

- [x] **PASS3-3: The purchase flow — the money path — was the least-covered
  screen** `PaywallScreen.tsx` was at 58% stmt / 46% branch: every test ran
  against the unconfigured RevenueCat fallback, so *no* test touched a real
  purchase, restore, entitlement check, or offerings fetch. Those branches
  hang off `isPurchasesConfigured`, a module-level const read from
  `process.env` at import time, so they're unreachable without mocking
  `utils/purchases` wholesale — hence a separate
  `PaywallScreen.configured.test.tsx` rather than another describe block.
  Covers: real store prices replacing the static `$4.99` copy, the loading
  placeholder that exists to stop a visible price flip, offerings-fetch
  failure falling back to static prices, purchase success, purchase
  succeeding with *no* active entitlement (the "product not mapped to
  `aura_pro_access` in the dashboard" case), purchase failure, user
  cancellation staying silent, and all three restore outcomes. 58% → 97%.
  Gotcha worth remembering: `jest.mock`'s factory is hoisted above every
  declaration in the file, so a `class PurchaseCancelledError` declared at
  file scope is still in its TDZ when the mocked module is imported — the
  screen's `instanceof` check then throws `TypeError: Right-hand side of
  'instanceof' is not an object` instead of classifying the error. Declare
  it inside the factory and `require` it back out.

- [x] **PASS3-4: `ResultsScreen`'s entire history list was untested**
  Only the empty state had coverage (54% stmt / 25% branch) — the list
  rendering, the per-module badge lookup, and `openEntry`'s reopen-a-past-
  reading path all had zero. Added tests for all three. 54% → 95%.

- [x] **PASS3-5: Docs described a version of the app that no longer exists**
  Not cosmetic — `frontend/AGENTS.md` (loaded as `frontend/CLAUDE.md`)
  instructed every future agent session to read the **Expo SDK 54** docs, two
  majors behind the SDK 57 / RN 0.86 the app actually runs on, and root
  `CLAUDE.md` told them to mock `expo-camera` and `expo-av` — neither of which
  is installed any more. `README.md` was the worst of the three: it claimed
  RevenueCat was "intentionally not installed yet" and on-device face
  detection was unbuilt (both shipped — 5.1 groundwork and 6.1), that the app
  "is built to run in plain Expo Go" (two native modules make that
  impossible), SDK 54, `expo-camera`/`expo-av`, and `gemini-2.5-flash` as
  "the current default" when `readingService.ts` moved to
  `gemini-flash-latest` after 2.5-flash started 404ing. `PROJECT_SPEC.md`
  and `IMPLEMENTATION_PLAN.md` were both accurate throughout — the drift was
  confined to the orientation docs. Rewrote all three against the code, and
  replaced README's stale "not wired up yet" list with the genuine remaining
  blockers (real store products, the permissive server-side entitlement stub,
  the free-tier Gemini key vs. the Privacy Policy's no-training guarantee).
  Also corrected two in-code comments that outlived their subject:
  `NoFaceDetectedScreen`'s "nothing routes here yet" (CaptureScreen does) and
  `api/reading.ts`'s "on-device face detection is deferred" (it shipped).

Result: frontend 30 suites / 168 tests (was 28/142), 90.6% stmt / 83.9%
branch (was 85.4/75.5); backend unchanged at 5 suites / 38 tests, 96%.
Both `tsc --noEmit` runs clean.

### Not fixed — flagged, unchanged from the Security Review above
- `requireActiveEntitlement` is still a permissive stub; `@fastify/rate-limit`
  (20 req/10 min per IP) remains the only thing protecting the paid Gemini
  endpoint. Still blocked on real store products, same as 5.1.
- The Gemini key is still free-tier. Unchanged blocker for the Privacy
  Policy's no-training claim outside the EEA/UK/Switzerland — must move to a
  billing-enabled project before real user photos hit the endpoint.
