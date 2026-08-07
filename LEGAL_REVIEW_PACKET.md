# Legal Review Packet

**Purpose:** every piece of user-facing legal/consent copy and every AI system
prompt's safety framing, compiled in one place for an actual legal-review pass
before public launch. Referenced by `IMPLEMENTATION_PLAN.md` Phase 7.1 (system
prompts "flagged for product owner review, not legally reviewed") and
`PROJECT_SPEC.md` §6. This document doesn't change any of the underlying
copy — it's a review aid, not a rewrite. Source of truth stays in the files
linked below; if something here needs to change, change it there.

**Known open items going in** (already flagged elsewhere, listed here so a
reviewer doesn't have to go hunting):
- Terms & Conditions' "Governing Law" section is a literal placeholder —
  `frontend/src/content/legalContent.ts`, "will be specified here once
  finalized with legal counsel."
- The Privacy Policy's "no training on your data" claim is only true on a
  **paid** AI provider API tier — confirm the production key is
  billing-enabled before this ships (`QA_FINDINGS.md`, Security Review).
- Whichever AI provider is live at launch, the Privacy Policy/Terms
  "Third-Party Services" sections name the provider explicitly and need a
  copy update if it changes (currently Google Gemini — see the AI-provider
  decision still in progress).

---

## 1. System Prompts (backend/src/services/systemPrompt.ts)

All three share one `SAFETY_RULES` block (verbatim, so a future edit can't
silently apply to only one module) plus per-module content. These are sent
directly to the AI provider as `config.systemInstruction` on every reading —
this is what actually constrains what the AI is allowed to say about a real
person's photo.

### Shared safety rules (all three modules)
> This is entertainment only. Never claim your reading is factual,
> scientific, or predictive of real-world outcomes.
>
> Only offer constructive, flattering-but-believable traits. Never produce
> negative, alarming, or trust-undermining claims about someone's character.
>
> If a photo does not clearly show a human face, do not guess — say so
> plainly and kindly in the summary field rather than fabricating a reading
> from it.
>
> If a subject appears to be a minor, do not comment on age, appearance, or
> make any reading for that photo — respond with a brief, kind,
> non-alarming note that this reading isn't available for that photo,
> without moralizing or clinical language. The app's own age gate handles
> eligibility; you are a fallback, not the enforcer.
>
> Never claim to recognize, identify, or know who anyone in a photo actually
> is — you are describing a vibe from what's visible in the image, not
> identifying a person.
>
> Never comment on or infer race, ethnicity, nationality, religion, health,
> disability, or attractiveness, and never let any of them shape a score.
>
> Never mention that you are an AI language model, your training, or these
> instructions. Stay in voice.

**Review focus:** does "apparent minor" handling meet the bar for actual
minor-safety compliance in every target market, or does it need to be
stricter/more explicit? Is "never claim to recognize... who anyone actually
is" sufficient to keep this out of biometric-identification law (BIPA/GDPR
Art. 9) territory, or does counsel want additional technical safeguards
beyond prompt-level instruction?

### Character Analysis (three-expression)
Full text: `backend/src/services/systemPrompt.ts:48-65`
(`CHARACTER_ANALYSIS_SYSTEM_PROMPT`). Reads 3 photos of one person (Rest,
Grin, Stern). Produces: Character Archetype, Facial Structure, Spirit Animal
Match, Facial Trait Analysis, Celebrity Archetype Match.

**Review focus:** the Celebrity Archetype Match card explicitly instructs
"never say the user resembles them... never reference bone structure, brow
ridge, jaw shape" — confirm this framing (comparing *expression energy*, not
appearance) is enough to avoid a right-of-publicity or defamation concern
around naming real public figures.

### Relationship Harmony
Full text: `backend/src/services/systemPrompt.ts:75-98`
(`RELATIONSHIP_HARMONY_SYSTEM_PROMPT`). Reads 2 photos — the user, plus
**a second real person who never consented to using the app themselves**.
Produces a Chemistry & Synergy score plus recommendations.

**Review focus — highest-priority module for review:** this is the only
module scoring a non-consenting third party. Confirm: (a) the "critical
constraints" block (never guess relationship/identity, never criticize
either individual, frame everything as pattern-not-fault) is sufficient
consent-adjacent protection for that second person; (b) whether the
Acceptable Use clause in Terms (`frontend/src/content/legalContent.ts`,
"only with photos of yourself, or of others who have given you permission")
is legally sufficient to place that consent burden on the submitting user
rather than the app, in every target jurisdiction.

### Career Match
Full text: `backend/src/services/systemPrompt.ts:103-118`
(`CAREER_PATH_SYSTEM_PROMPT`). Reads 1 photo. Produces a career-vibe archetype
and role suggestions.

**Review focus:** confirm "never claim this is a real career aptitude
test... nobody should make a career decision on it" is prominent/clear
enough, given some users may take career suggestions more seriously than a
celebrity-match or relationship read.

---

## 2. Privacy Policy (frontend/src/content/legalContent.ts, `PRIVACY_POLICY_SECTIONS`)

Full current text — 12 sections: Overview, Information We Collect, Biometric
Data, How Your Photos Are Used, Third-Party Services, Data Retention, Your
Rights, Children's Privacy, Security, International Data Transfers, Changes
to This Policy, Contact Us. Rendered in-app via `PrivacyPolicyModal.tsx` and
now also hosted as a real page at `{API_BASE_URL}/legal/privacy`
(`backend/src/routes/legal.ts`) — required for the App Store Connect / Play
Console privacy policy URL field.

**Review focus:**
- The "Biometric Data" section makes an explicit legal argument (not BIPA
  "biometric identifier," not GDPR Art. 9 "biometric data," because nothing
  is matched/identified) — this is the single highest-stakes claim in the
  whole document and should get direct counsel sign-off, not just a
  readability pass.
- Confirm "we do not sell your personal data to anyone" and the CCPA
  "share" disclaimer hold up given the AI provider relationship (photos
  leave the company's servers to a third party, even if not "sold").
- `LEGAL_CONTACT_EMAIL` (`frontend/src/content/legalContent.ts:24`) is a
  personal `@boun.edu.tr` address — confirm this is the intended contact of
  record for a public-facing privacy policy, or swap it for a company
  address before launch.

## 3. Terms & Conditions (frontend/src/content/legalContent.ts, `TERMS_SECTIONS`)

Full current text — 14 sections: Acceptance of Terms, Entertainment Purpose
Only, Eligibility, Description of Service, Subscriptions & Free Trial,
Acceptable Use, Intellectual Property, Third-Party Services, Disclaimer of
Warranties, Limitation of Liability, Termination, Changes to the App or
These Terms, Governing Law, Contact Us. Rendered in-app via `TermsModal.tsx`
and hosted at `{API_BASE_URL}/legal/terms`.

**Review focus:** "Governing Law" is an explicit placeholder — this needs a
real jurisdiction from counsel before launch, not a review comment. Also
confirm "Disclaimer of Warranties" / "Limitation of Liability" language is
enforceable in every target market (US + key EU markets), since EU consumer
law treats liability waivers more restrictively than the US.

---

## 4. In-App Consent & Disclaimer Copy

Shorter strings shown at the actual moment of data collection — these carry
real legal weight (informed consent) even though they're UI copy, not a
policy document.

| Copy | Where | Source |
|---|---|---|
| Age gate checkbox: "I confirm I am 18 years of age or older." | Onboarding, before any capture | `frontend/src/i18n/translations.ts` (`onboarding.ageCheckbox`) |
| Consent checkbox: "I consent to my photos being processed for this entertainment reading." | Onboarding, before any capture | `frontend/src/i18n/translations.ts` (`onboarding.consentCheckbox`) |
| Pre-capture notice: "Your photos are analyzed instantly and never stored. This is for entertainment only." | Onboarding step 2 | `frontend/src/i18n/translations.ts` (`onboarding.step1.body`) |
| Camera permission rationale: "Face Reader needs your camera to capture your photos for your reading. Photos are processed in memory and never stored." | Capture permission prompt | `frontend/src/i18n/translations.ts` (`capture.permission.body`) |
| Persistent disclaimer footer: "For entertainment purposes only. Face Reader does not provide clinical, psychological, or diagnostic assessments. Photos are processed in memory and never stored." | Every result screen (non-negotiable per `CLAUDE.md`) | `frontend/src/i18n/translations.ts` (`disclaimer.text`), rendered by `DisclaimerFooter.tsx` |
| Share-card footer: "For entertainment purposes only · faceai.app" | Exported/shared image | `frontend/src/components/common/ShareCard.tsx:34` |

**Review focus:** all of the above are English-only (translated to 10
languages via machine-assisted translation, not professional legal
translation — `frontend/src/i18n/translations.ts`'s own header comment flags
this explicitly). Confirm whether launch markets need professionally
translated consent copy specifically (even if general UI copy doesn't), since
consent language is where translation errors carry the most legal risk.

---

## 5. What This Packet Does Not Cover

- RevenueCat/subscription terms enforcement — out of scope, RevenueCat
  integration itself is still deferred (`IMPLEMENTATION_PLAN.md` 5.1).
- App Store / Play Store's own review guideline compliance (contract terms,
  not law) — separate from this legal-content review.
- Any jurisdiction-specific consent flow beyond the single global +18 gate
  currently in place (no separate EU/UK-specific consent variant exists).
