import { buildContactMailUrl } from './contactMail';

describe('buildContactMailUrl', () => {
  const baseContext = {
    anonymousId: 'faceai-anon-1234',
    isProActive: true,
    languageCode: 'en',
    appVersion: '1.0.0',
    buildNumber: null,
    platformLabel: 'iOS',
    osVersionLabel: 'Version 18.7.8 (Build 22H352)',
    signOff: 'Sent from my iPhone',
  };

  it('addresses the mail to the configured support contact', () => {
    const url = buildContactMailUrl(baseContext);
    expect(url).toMatch(/^mailto:fevzi\.bayram@boun\.edu\.tr\?/);
  });

  it('embeds the required diagnostic footer, preserving the do-not-delete markers', () => {
    const url = buildContactMailUrl(baseContext);
    const body = decodeURIComponent(url.split('body=')[1]);

    expect(body).toContain('-------- PLEASE DO NOT DELETE THE INFORMATION BELOW --------');
    expect(body).toContain('User ID: faceai-anon-1234');
    expect(body).toContain('Premium: Yes');
    expect(body).toContain('App Version: 1.0.0');
    expect(body).toContain('Platform: iOS');
    expect(body).toContain('OS Version: Version 18.7.8 (Build 22H352)');
    expect(body).toContain('Language: en');
    expect(body).toContain('Sent from my iPhone');
  });

  it('appends the build number when one is available', () => {
    const url = buildContactMailUrl({ ...baseContext, buildNumber: '42' });
    const body = decodeURIComponent(url.split('body=')[1]);
    expect(body).toContain('App Version: 1.0.0 (42)');
  });

  it('reflects a non-premium user', () => {
    const url = buildContactMailUrl({ ...baseContext, isProActive: false });
    const body = decodeURIComponent(url.split('body=')[1]);
    expect(body).toContain('Premium: No');
  });
});
