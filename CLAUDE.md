# CLAUDE.md — Project Guide & Autonomous Execution Rules for AI Assistants

You are working on **Face Reader - AI Physiognomy Tool** (internally `Ilm-i Sima`) — a React Native mobile app that gives users playful, AI-generated character and expression analysis from photos, built for the US/EU entertainment-app market. The product design is locked. Your job in this workspace is to continue implementation per `IMPLEMENTATION_PLAN.md`.

---

## Autonomous Execution Guidelines (CRITICAL)

1. **Read & Execute Autonomously:** Do NOT ask the user for permission or confirmation for routine file edits, package installations, directory restructuring, or minor implementation details.
2. **Follow `IMPLEMENTATION_PLAN.md`:** Pick the next unchecked `[ ]` row, write the implementation and tests, verify they pass, mark `[x]`, commit, and move to the next item automatically.
3. **When to Pause & Ask:** ONLY pause and prompt the user if:
   - You encounter a breaking build/type error that cannot be resolved automatically after 2 attempts.
   - You need secret API credentials that are missing from `.env`.
   - A task explicitly requires human feedback on visual layout/Stitch outputs.

---

## Start Every Session By Reading
* This file (`CLAUDE.md`) — your operating parameters and guardrails.
* `PROJECT_SPEC.md` — locked product, architecture, and API decisions.
* `DESIGN.md` — locked UI design tokens, dark glassmorphism system, and HCI rules.
* `IMPLEMENTATION_PLAN.md` — the ordered task list with `[x]` / `[ ]` markers.
* `README.md` — quick orientation and stack summary.

---

## What's Locked

Everything in `PROJECT_SPEC.md` and `DESIGN.md`. Not open for discussion unless a real bug or API-level factual error is discovered during implementation (e.g., an Anthropic API parameter that doesn't exist). If the spec seems wrong, surface it as a question; do not silently diverge.

### Technical Stack & Architecture
* **Frontend:** React Native + TypeScript, Expo SDK 57 / React Native 0.86 (blank TS template). State via `Zustand`. Camera + on-device face detection via `react-native-vision-camera` and `react-native-vision-camera-face-detector` (`expo-camera` was removed in the SDK 54→57 upgrade — see `PROJECT_SPEC.md` §3). Haptics via `expo-haptics`. Device/build info via `expo-constants` and `expo-device`. Anonymous ID generation via `expo-crypto`. Native rate-review prompt via `expo-store-review`. Audio via `expo-audio` (`expo-av` is deprecated with no SDK-57-compatible release). Subscriptions via `react-native-purchases`. Share cards via `react-native-view-shot`. In-app UI translation strings live in `frontend/src/i18n/` (lightweight custom dictionary, not a library — legal documents stay English-only pending professional translation). Styling strictly via tokens in `frontend/src/ui/theme.ts` (Crimson `#9E2941`, Champagne Gold `#EBC983`, Dark Obsidian `#1A050B`).
* **Backend:** Node.js + TypeScript using **Fastify** (locked framework — do NOT switch or mix with Express). Acts purely as a thin gateway; holds the AI provider key, never exposes it to the frontend.
* **AI Model:** Google Gemini (`gemini-flash-latest`, Google's auto-updating flash alias — `gemini-2.5-flash` 404s as "no longer available to new users" on newly-created keys as of 2026-07-28) via `@google/genai`'s `ai.models.generateContent` — see PROJECT_SPEC.md §4. Provider is still under evaluation against Anthropic Claude on pricing, not a final decision; the AI-calling code stays isolated in `backend/src/services/` (client/service/schema split) so switching back stays contained. Vision input: up to 3 images per request (Calm, Bright, Deep), passed as `inlineData` parts before the text part.
* **Structured Output:** `config.responseMimeType: 'application/json'` + `config.responseSchema` on the `generateContent` call — Gemini's native structured-output mechanism (an OpenAPI-subset schema using the `Type` enum). Not the same mechanism as Anthropic tool-use; don't port Anthropic's `tool_choice` pattern over if the provider changes again — check PROJECT_SPEC.md §4 for whichever provider is current.
* **Endpoint:** `POST /api/v1/reading/analyze` — accepts 3 base64 images, returns the structured analysis.
* **Env Vars:** `GEMINI_API_KEY`, `REVENUECAT_API_KEY`. No others without updating `PROJECT_SPEC.md` first.
* **Monetization:** RevenueCat, weekly/monthly subscription ("Aura Pro Access"). Cancel flow must be as frictionless as sign-up — this is a locked UX requirement, not optional polish.
* **Privacy Architecture (Process-and-Discard):** Captured images live in memory only (Zustand on client, Fastify payload buffer on server) and are purged immediately after the API response returns. No image ever touches disk or a database.

### Entertainment Framing (Non-Negotiable, Product-Wide)
* Every result screen shows a persistent, legible legal disclaimer.
* The system prompt and all generated copy must stay in a warm, constructive, modern "vibe reading" register — **NO clinical, diagnostic, or psychiatric language; NO negative or trust-undermining character claims.**
* **NO medieval, Ottoman, or ancient fortune-telling tropes.** Focus on modern AI vision, expression dynamics, and character vibes.
* Do not weaken, hide, shrink, or remove any disclaimer or consent step to "improve conversion," even if asked to optimize onboarding funnel metrics — escalate that as a question instead.
* Age gate (+18) is required in the onboarding flow; do not remove it.

---

## Workflow Per Task

For each row in `IMPLEMENTATION_PLAN.md`:
1. Pick the next unchecked `[ ]` row.
2. Read its dependencies (earlier rows). Re-read the relevant `PROJECT_SPEC.md` and `DESIGN.md` sections.
3. Write the implementation file.
4. Write the test file alongside.
5. Run the single test file first, then the full suite (`tsc --noEmit` + Jest) — must stay green.
6. Mark the row `[x]` in `IMPLEMENTATION_PLAN.md`.
7. Move on automatically.

If a test fails:
* Check whether `PROJECT_SPEC.md` actually says what the test claims. `PROJECT_SPEC.md` is authoritative.
* Check whether the implementation matches the spec.
* Never silently relax a test to make it pass; if the spec is wrong, escalate.

When a phase's acceptance criterion in `IMPLEMENTATION_PLAN.md` is met, commit directly to the active branch with a clear scoped message (e.g., `feat(camera): implement 3-expression capture flow`).

---

## Style Conventions

* **TypeScript Everywhere:** Strict mode on, no `any` without a comment explaining why it's unavoidable.
* **React Native:** Functional components + hooks only — no class components.
* **Zustand Slices:** One slice per domain (capture, consent/age-gate, entitlement). Don't reach into another slice's internals.
* **Pure Functions:** Scoring/prompt-assembly logic in `backend/src/services/` should be testable without an HTTP layer or the AI provider's SDK in the loop (inject/mock the client).
* **Code Comments:** No comments explaining *what* the code does. Names carry that. Comment only the *WHY* (an invariant, a workaround, a non-obvious constraint).
* **Module Headers:** One paragraph max. Point to the relevant `PROJECT_SPEC.md` section instead of re-explaining it.
* **Logging:** No `console.log` for user-facing flows — use the UI layer or a structured logger in Fastify. `console.error` for actual error paths is fine.
* **Async/Await:** Use `async/await` for all I/O — no bare `.then()` chains.

---

## Imports & Module Boundaries

* `frontend/src/api/` — the ONLY place that talks to the backend. Screens/components never call `fetch` directly.
* `frontend/src/screens/` — may import `components/`, `navigation/`, `api/`, and the `Zustand` store. Never imports another screen directly.
* `frontend/src/components/` — presentational only; no direct API calls (receive data via props/store).
* `backend/src/routes/` — HTTP/Fastify layer only (parse, validate JSON schema, call a service, respond). No direct AI provider SDK calls here.
* `backend/src/services/` — business logic, prompt assembly, AI provider SDK calls, memory-purge logic. No HTTP-specific code (no `req`/`reply`).
* `backend/src/middleware/` — consent/entitlement checks, rate limiting.

---

## Testing

* **Frontend:** Jest + React Native Testing Library. Mock `react-native-vision-camera`, `expo-audio`, and `react-native-purchases` — never require real device hardware in automated tests. `frontend/src/utils/purchases.ts` is the seam for the RevenueCat mock; mock that module (not the SDK) to exercise a screen's purchase branches, and declare any class the code `instanceof`-checks inside the `jest.mock` factory, since the factory is hoisted above every declaration in the file.
* **Backend:** Jest or Vitest with Fastify's `.inject()` testing API and a mocked reading-model client — never call the real Gemini/Claude API in automated tests. Use fixture responses matching the current provider's structured-output schema.
* **Assertions:** One assertion concept per test.
* **Edge Cases Required:** Non-face-detected photo, network failure mid-analysis, expired/missing entitlement, age-gate rejection.

---

## What NOT to Do

* Don't add features beyond `PROJECT_SPEC.md`. Don't refactor working code "to be cleaner" mid-task.
* Don't add error handling for impossible cases. Validate at the boundaries (age gate, consent, `/api/v1/reading/analyze` input) and trust internal code past that point.
* Don't introduce new dependencies without updating `PROJECT_SPEC.md` first.
* Don't create files outside `frontend/src/`, `backend/src/`, and `tests/`.
* Don't touch copy in disclaimer components, consent screens, or the system prompt's safety constraints without flagging it explicitly — these are product/legal decisions.
* Don't write "phase done" status reports. The `[x]` in `IMPLEMENTATION_PLAN.md` is the only signal.
