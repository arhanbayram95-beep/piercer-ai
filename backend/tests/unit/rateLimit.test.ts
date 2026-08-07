import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { ReadingModelClient } from '../../src/services/geminiClient';

function textResponse(body: unknown) {
  return { text: JSON.stringify(body) };
}

const PHOTOS_3 = ['base64-calm', 'base64-bright', 'base64-deep'];
const CHARACTER_READING = {
  module: 'character_analysis',
  archetype_card: { title: 'Character Archetype', badge_tag: 'Analytical Visionary', summary: 'One punchy sentence.' },
  facial_structure_card: { title: 'Facial Structure', shape_tag: 'Oval', description: 'Structural description.' },
  spirit_animal_card: { title: 'Spirit Animal Match', animal: 'Wolf', description: 'Symbolic description.' },
  traits_card: {
    title: 'Facial Trait Analysis',
    metadata_badges: [{ key: 'Eye Energy', value: 'Direct & Piercing' }],
    strength_pills: ['Strategic Thinking'],
    growth_pills: ['Pacing Energy'],
  },
  celebrity_match_card: { title: 'Celebrity Archetype Match', match_name: 'A Public Figure', match_description: 'Same register.' },
};

describe('rate limiting on /api/v1/reading/analyze', () => {
  let app: FastifyInstance;
  let generateContent: jest.Mock;

  beforeEach(async () => {
    generateContent = jest.fn().mockResolvedValue(textResponse(CHARACTER_READING));
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(readingModelClient);
  });

  afterEach(async () => {
    await app.close();
  });

  it('allows requests under the limit through', async () => {
    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: { photos: PHOTOS_3 } });
    expect(response.statusCode).toBe(200);
  });

  it('returns 429 with a sanitized message once the per-IP limit is exceeded', async () => {
    // The configured limit is 20 requests / 10 minutes (see middleware/rateLimit.ts) —
    // .inject() calls all share the same default remote address, so firing
    // 21 in a row from one test genuinely exercises the real threshold.
    let last;
    for (let i = 0; i < 21; i++) {
      last = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: { photos: PHOTOS_3 } });
    }

    expect(last?.statusCode).toBe(429);
    expect(last?.json()).toEqual({
      error: "You're doing that a bit too fast — please wait a few minutes and try again.",
    });
  });
});
