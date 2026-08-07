import { FastifyInstance } from 'fastify';

// Mirrors frontend/src/content/legalContent.ts — App Store Connect and Play
// Console both require a real public URL for the privacy policy in store
// listing metadata, not just in-app modal text (see QA_FINDINGS.md,
// 2026-07-29). No shared package between frontend/backend, so this is a
// deliberate second copy: any change to the legal copy has to land in both
// places.
interface LegalSection {
  heading: string;
  body: string;
}

const LEGAL_LAST_UPDATED = 'August 4, 2026';
const LEGAL_CONTACT_EMAIL = 'fevzi.bayram@boun.edu.tr';

// FLAGGED FOR LEGAL REVIEW (added during the piercer.ai pivot): the "Body
// Part Photos" section below is a straight rebrand of the old Face Reader
// app's "Face Data" section — same BIPA/Art. 9 GDPR reasoning (i.e. "we
// don't do facial recognition, so this isn't biometric data"), just with
// "face" swapped for "body part." That reasoning was written for face
// photos specifically; piercer.ai photographs arbitrary body parts (ears,
// nose, navel, etc.), which is a different privacy fact pattern — e.g. some
// body-part photos may incidentally include a face even when a face isn't
// the subject. Do not treat this section as legally sound as-is; it needs
// actual counsel review before this app ships, same open item the original
// LEGAL_REVIEW_PACKET.md flagged for the face-reading version.
const PRIVACY_POLICY_SECTIONS: LegalSection[] = [
  {
    heading: 'Overview',
    body:
      'This Privacy Policy applies to the piercer.ai app ("Application"), offered on an "AS IS" basis. piercer.ai provides a playful, entertainment-only AI preview of how piercing jewelry might look on a photo you take in the app. This policy explains what we collect, how it is used, and the choices you have. piercer.ai is intended for users aged 18 and over.',
  },
  {
    heading: 'Information Collection and Use',
    body:
      "The Application collects limited information when you use it: subscription and purchase information, handled by our payments provider, RevenueCat; and, if you contact support, the content of your message plus basic diagnostic details (anonymous device ID, app version, platform, OS version, selected language) that you choose to send with it. We do not collect precise location data, and we do not run advertising or analytics tracking SDKs in the app.",
  },
  {
    heading: 'Body Part Photos',
    body:
      "The Application allows you to capture or upload a single photo of the body part you'd like to preview piercing jewelry on (for example, an ear, nose, brow, or navel). This photo is used solely to generate a rendered preview of the jewelry style and finish you select — nothing that identifies or verifies who anyone is. piercer.ai does not perform facial recognition, does not create or store a faceprint, face template, or other biometric identifier, and does not match, compare, or look anyone up against a database of other people. By capturing or uploading a photo in the app, you consent to its use for generating your preview render. We never sell, lease, trade, or otherwise profit from these photos or any information derived from them.",
  },
  {
    heading: 'Third Party Access',
    body:
      "Only the minimum data each provider needs to do its job is shared, and only with the following third-party services, each of which has its own privacy policy governing how it handles data: Google's Gemini API (see Body Part Photos & Third-Party Access below) and RevenueCat (subscription and purchase events). We may also disclose information as required by law, such as to comply with a subpoena or similar legal process; when we believe in good faith that disclosure is necessary to protect our rights or your safety, investigate fraud, or respond to a government request; or with trusted service providers who work on our behalf, have no independent use of the information, and are bound to the same rules set out in this policy. We do not sell your personal data to anyone.",
  },
  {
    heading: 'Body Part Photos & Third-Party Access',
    body:
      "Photos captured for your preview render are sent securely to our backend, which forwards them to our AI provider (currently Google's Gemini API) solely to generate your render, along with your selected jewelry type/finish and a short instruction prompt — nothing else about you is sent. On Google's paid API tier, which piercer.ai is intended to run on, Google does not use this content to train its models; a limited, short-lived log is kept solely to detect API abuse, per Google's own terms. Your photo is not shared with any third party for advertising, marketing, or any other secondary use.",
  },
  {
    heading: 'Opt-Out Rights',
    body:
      'You can stop all collection of information by the Application at any time by uninstalling it, using the standard uninstall process for your device or app marketplace.',
  },
  {
    heading: 'Data Retention Policy',
    body:
      "We do not retain your photos after your render is generated — they exist only for the seconds it takes to process a single request, both on our own servers and, per our agreement with our AI provider, on theirs. They are never written to disk, stored in a database, or kept between sessions. The generated render is kept only in your device's local history within the app until you clear it there; we do not store a history of past renders on our servers. Subscription and billing records are retained by RevenueCat per their standard retention practices. Support correspondence is kept only as long as needed to resolve your request — contact us at the email below if you'd like it deleted sooner.",
  },
  {
    heading: 'Your Rights',
    body:
      "If you are located in the EU/UK/EEA, you generally have the right to access, correct, delete, restrict, or port your personal data, to object to certain processing, and to lodge a complaint with your local data protection supervisory authority. If you are a California resident, you have rights under the CCPA/CPRA, including the right to know what categories of personal information we collect, the right to request deletion, and — because your body-part photo could be considered sensitive personal information — the right to limit our use of it to what's needed to provide the render you asked for, which is already the only use we make of it. We do not sell or 'share' (as CCPA defines that term, including for cross-context advertising) personal information. To exercise any of these rights, contact us using the details below.",
  },
  {
    heading: 'Children',
    body:
      "The Application does not knowingly solicit data from or market to anyone under the age of 18. piercer.ai requires users to self-certify that they are 18 or older during onboarding. If we become aware that we have inadvertently processed data from someone under 18, we will delete it promptly — if you are a parent or guardian and believe your child has provided us with information, please contact us at the email below.",
  },
  {
    heading: 'Security',
    body:
      'We provide physical, electronic, and procedural safeguards to protect the information we process. Photos are transmitted using industry-standard encryption (HTTPS/TLS) over secure channels. Because we do not persist your photos after processing, there is no long-term photo storage to secure — the strongest protection is that the data simply does not stick around.',
  },
  {
    heading: 'International Data Transfers',
    body:
      'Depending on where you are located, using piercer.ai may involve transferring your data to servers or service providers located in other countries, including the United States. We take reasonable steps to ensure such transfers comply with applicable data protection law.',
  },
  {
    heading: 'Changes',
    body:
      'This Privacy Policy may be updated from time to time for any reason. We will notify you of changes by updating this page with the new policy and the "last updated" date below, and, where required, by providing additional notice. Continued use of the Application after a change is deemed acceptance of that change.',
  },
  {
    heading: 'Your Consent',
    body:
      'By using the Application, you consent to the processing of your information as set out in this Privacy Policy, now and as amended by us.',
  },
  {
    heading: 'Contact Us',
    body: `If you have any questions regarding privacy while using the Application, please contact us at ${LEGAL_CONTACT_EMAIL}.`,
  },
];

const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'Acceptance of Terms',
    body:
      'These Terms & Conditions apply to the piercer.ai app ("Application"), offered on an "AS IS" basis. By downloading, accessing, or using piercer.ai, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use the app.',
  },
  {
    heading: 'Entertainment Purpose Only',
    body:
      'piercer.ai generates playful, AI-assisted previews of piercing jewelry on your photos for entertainment purposes only. It is not a real piercing procedure, medical device recommendation, or professional body-piercing consultation, and nothing in the app should be relied upon as professional advice of any kind.',
  },
  {
    heading: 'Eligibility',
    body:
      'piercer.ai is intended for users who are at least 18 years old. By using the app, you confirm that you meet this age requirement.',
  },
  {
    heading: 'Description of Service',
    body:
      'The app guides you through capturing or uploading a single photo of the body part you want to preview jewelry on, then choosing a jewelry type (such as hoops, studs, barbells, industrial, septum, or dermal) and finish (such as silver, gold, titanium, or black steel). Your photo and selections are sent to our backend for AI-generated rendering, and the resulting preview is presented back to you along with a shareable card. Results are generated by an AI model and may vary between sessions, and are not a guarantee of how a real piercing or real jewelry would look or fit.',
  },
  {
    heading: 'Subscriptions & Free Trial',
    body:
      'Full access to piercer.ai is offered through auto-renewing weekly or monthly subscriptions, managed through your App Store or Google Play account via RevenueCat. Where offered, a free trial converts automatically into a paid subscription at the end of the trial period unless cancelled beforehand. You can view, manage, or cancel your subscription at any time from your device\'s account settings — cancellation is designed to be as simple as signing up.',
  },
  {
    heading: 'Acceptable Use',
    body:
      'You agree to use piercer.ai only with photos of yourself (or of others who have given you permission), and not to use the app for any unlawful purpose, to harass others, or to attempt to reverse-engineer, disrupt, or misuse the service.',
  },
  {
    heading: 'Intellectual Property',
    body:
      'piercer.ai, its branding, design, and underlying software are owned by us or our licensors and are protected by applicable intellectual property law. You retain ownership of your own photos; using the app does not transfer any rights in the app itself to you.',
  },
  {
    heading: 'Third-Party Services',
    body:
      "The app relies on third-party services, including our AI provider (currently Google's Gemini API — see our Privacy Policy for what's shared with them) and RevenueCat (for subscription billing), as well as the App Store or Google Play for distribution and payment processing. Your use of those platforms is also subject to their own terms.",
  },
  {
    heading: 'Disclaimer of Warranties',
    body:
      'piercer.ai is provided "as is" and "as available," without warranties of any kind, express or implied, including as to accuracy, reliability, or fitness for a particular purpose. Renders are generated by an AI model and are inherently approximate and for fun — we make no claims about how closely a preview matches a real piercing or real jewelry.',
  },
  {
    heading: 'Limitation of Liability',
    body:
      'To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of piercer.ai, including reliance on any render generated by the app.',
  },
  {
    heading: 'Termination',
    body:
      'We may suspend or terminate access to piercer.ai for any user who violates these terms. You may stop using the app and cancel your subscription at any time.',
  },
  {
    heading: 'Changes to the App or These Terms',
    body:
      'We may update piercer.ai or these terms from time to time. Continued use of the app after changes take effect constitutes acceptance of the updated terms.',
  },
  {
    heading: 'Governing Law',
    body:
      'The governing law and venue for disputes will be specified here once finalized with legal counsel for the entity operating piercer.ai.',
  },
  {
    heading: 'Contact Us',
    body: `If you have any questions about these Terms, please contact us at ${LEGAL_CONTACT_EMAIL}.`,
  },
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderLegalPage(title: string, sections: LegalSection[]): string {
  const sectionsHtml = sections
    .map(
      (section) => `
      <section>
        <h2>${escapeHtml(section.heading)}</h2>
        <p>${escapeHtml(section.body)}</p>
      </section>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)} — piercer.ai</title>
<style>
  body {
    background: #16161A;
    color: #F1F5F9;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 720px;
    margin: 0 auto;
    padding: 32px 20px 64px;
    line-height: 1.6;
  }
  h1 { color: #CBD5E1; font-size: 28px; margin-bottom: 4px; }
  .last-updated { color: #52525B; font-size: 13px; margin-bottom: 32px; }
  h2 { color: #CBD5E1; font-size: 18px; margin-top: 28px; margin-bottom: 8px; }
  p { color: #94A3B8; font-size: 15px; margin: 0; }
  .disclaimer { margin-top: 40px; font-size: 12px; color: #52525B; }
</style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p class="last-updated">Last updated: ${escapeHtml(LEGAL_LAST_UPDATED)}</p>
  ${sectionsHtml}
  <p class="disclaimer">
    This document is a working draft pending final legal review per target market
    (see PROJECT_SPEC.md &sect;6) and may be updated before public launch.
  </p>
</body>
</html>`;
}

const PRIVACY_HTML = renderLegalPage('Privacy Policy', PRIVACY_POLICY_SECTIONS);
const TERMS_HTML = renderLegalPage('Terms & Conditions', TERMS_SECTIONS);

// Static compliance pages, not the paid AI endpoint — exempt from
// rate-limiting (config.rateLimit: false) so a user re-reading the policy
// or an App Store/Play Store review crawler never gets blocked from it.
export function registerLegalRoutes(app: FastifyInstance): void {
  app.get('/legal/privacy', { config: { rateLimit: false } }, async (_request, reply) => {
    reply.type('text/html; charset=utf-8').send(PRIVACY_HTML);
  });

  app.get('/legal/terms', { config: { rateLimit: false } }, async (_request, reply) => {
    reply.type('text/html; charset=utf-8').send(TERMS_HTML);
  });
}
