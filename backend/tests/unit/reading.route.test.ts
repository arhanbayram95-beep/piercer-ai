import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { ReadingModelClient } from '../../src/services/geminiClient';

function textResponse(body: unknown) {
  return { text: JSON.stringify(body) };
}

const PHOTOS_3 = ['base64-calm', 'base64-bright', 'base64-deep'];
const VALID_BODY = { photos: PHOTOS_3 };

// Mirrors the character_analysis card stack the response schema forces —
// see backend/src/services/readingSchema.ts.
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

const CAREER_READING = {
  module: 'career_path',
  work_archetype_card: { title: 'Career Archetype', badge_tag: 'Strategic Innovator', summary: 'One punchy sentence.' },
  domains_card: { title: 'Recommended Industries', top_industry_pills: ['Engineering & R&D'] },
  recommendations_card: {
    title: 'Ideal Role Matches',
    checklist_items: [{ headline: 'Systems Architect', description: 'Structured problem-solving.' }],
  },
};

describe('POST /api/v1/reading/analyze', () => {
  let app: FastifyInstance;
  let generateContent: jest.Mock;

  beforeEach(async () => {
    generateContent = jest.fn();
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(readingModelClient);
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns 200 with the structured reading on success', async () => {
    generateContent.mockResolvedValue(textResponse(CHARACTER_READING));

    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: VALID_BODY });

    expect(response.statusCode).toBe(200);
    expect(response.json().archetype_card.badge_tag).toBe('Analytical Visionary');
  });

  it('returns 400 when photos is missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('returns 400 when more than 3 photos are sent', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: [...PHOTOS_3, 'one-too-many'] },
    });

    expect(response.statusCode).toBe(400);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('returns 502 when the photo count does not match the module', async () => {
    // three-expression (the default module) needs exactly 3 photos.
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: ['only-one'] },
    });

    expect(response.statusCode).toBe(502);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('returns 502 when the Gemini API call fails mid-analysis', async () => {
    generateContent.mockRejectedValue(new Error('network failure'));

    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: VALID_BODY });

    expect(response.statusCode).toBe(502);
  });

  it('rejects a single oversized photo before calling the model', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: ['a'.repeat(8_000_001), PHOTOS_3[1], PHOTOS_3[2]] },
    });

    expect(response.statusCode).toBe(400);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('accepts a valid module and forwards it to the reading service', async () => {
    generateContent.mockResolvedValue(textResponse(CAREER_READING));

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      // career-match needs exactly 1 photo.
      payload: { photos: ['solo-photo'], module: 'career-match' },
    });

    expect(response.statusCode).toBe(200);
    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.systemInstruction).toMatch(/career/i);
  });

  it('accepts a realistic multi-photo payload larger than the default 1 MiB body limit', async () => {
    generateContent.mockResolvedValue(textResponse(CHARACTER_READING));

    // ~3MB per photo is in the realistic range for a real, uncapped-
    // resolution phone photo at quality 0.6 (see CaptureScreen.tsx) -
    // comfortably exceeds Fastify's default 1 MiB *total* bodyLimit even
    // alone, which is what real camera captures hit in practice, not just
    // a contrived edge case. Regression test for that gap.
    const bigPhoto = 'A'.repeat(3_000_000);
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: [bigPhoto, bigPhoto, bigPhoto] },
    });

    expect(response.statusCode).toBe(200);
  });

  it('rejects an unknown module value', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { ...VALID_BODY, module: 'not-a-real-module' },
    });

    expect(response.statusCode).toBe(400);
    expect(generateContent).not.toHaveBeenCalled();
  });
});
