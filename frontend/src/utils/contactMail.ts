import { LEGAL_CONTACT_EMAIL } from '../content/legalContent';

export interface ContactMailContext {
  anonymousId: string;
  isProActive: boolean;
  languageCode: string;
  appVersion: string;
  buildNumber?: string | null;
  platformLabel: string;
  osVersionLabel: string;
  signOff: string;
}

export function buildContactMailUrl(ctx: ContactMailContext): string {
  const versionLine = ctx.buildNumber ? `${ctx.appVersion} (${ctx.buildNumber})` : ctx.appVersion;

  const body = [
    'Describe your issue or question below:',
    '',
    '',
    '-------- PLEASE DO NOT DELETE THE INFORMATION BELOW --------',
    '',
    `User ID: ${ctx.anonymousId}`,
    `Premium: ${ctx.isProActive ? 'Yes' : 'No'}`,
    `App Version: ${versionLine}`,
    `Platform: ${ctx.platformLabel}`,
    `OS Version: ${ctx.osVersionLabel}`,
    `Language: ${ctx.languageCode}`,
    '',
    '--------------------------------------------------------------',
    '',
    ctx.signOff,
  ].join('\n');

  const subject = 'Face Reader Support Request';
  return `mailto:${LEGAL_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
