import { ReadingModelClient } from '../../src/services/geminiClient';
import { generateReading, ReadingServiceError } from '../../src/services/readingService';
import { READING_SCHEMAS, ReadingModuleId } from '../../src/services/readingSchema';
import { READING_SYSTEM_PROMPTS } from '../../src/services/systemPrompt';

const PHOTOS_3 = ['base64-calm', 'base64-bright', 'base64-deep'];
const PHOTOS_2 = ['base64-person1', 'base64-person2'];
const PHOTOS_1 = ['base64-solo'];

// Matches MODULE_PHOTO_COUNTS in readingSchema.ts — used by tests that need
// a valid photo count for a given module without hardcoding it themselves.
const MODULE_PHOTOS: Record<ReadingModuleId, string[]> = {
  'three-expression': PHOTOS_3,
  'relationship-harmony': PHOTOS_2,
  'career-match': PHOTOS_1,
};

const scoreCard = (title: string, labels: string[]) => ({
  title,
  overall_score: 88,
  breakdown_metrics: labels.map((label, i) => ({ label, score: 80 + i * 3, icon: 'eye' })),
});

// Fixtures mirror the shape each module's responseSchema forces — see
// readingSchema.ts. Never the real API in tests, per CLAUDE.md.
const MODULE_RESPONSES: Record<ReadingModuleId, Record<string, unknown>> = {
  'three-expression': {
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
  },
  'relationship-harmony': {
    module: 'relationship_harmony',
    vibe_card: { title: 'Relational Archetype', badge_tag: 'Grounded & Playful Harmonizer', summary: 'One punchy sentence.' },
    chemistry_score_card: scoreCard('Chemistry & Synergy Score', ['Empathy', 'Communication', 'Attachment', 'Energy Match']),
    dynamics_card: {
      title: 'Relationship Dynamics',
      best_chemistry_pills: ['Grounded Calmness'],
      vibes_to_avoid_pills: ['Superficial Drama'],
    },
    guidance_card: {
      title: 'Harmony Recommendations',
      checklist_items: [{ headline: 'Direct Communication', description: 'Say it early and plainly.' }],
    },
  },
  'career-match': {
    module: 'career_path',
    work_archetype_card: { title: 'Career Archetype', badge_tag: 'Strategic Innovator', summary: 'One punchy sentence.' },
    domains_card: { title: 'Recommended Industries', top_industry_pills: ['Engineering & R&D'] },
    recommendations_card: {
      title: 'Ideal Role Matches',
      checklist_items: [{ headline: 'Systems Architect', description: 'Structured problem-solving under pressure.' }],
    },
  },
};

function makeClient(generateContent: ReadingModelClient['models']['generateContent']): ReadingModelClient {
  return { models: { generateContent } };
}

function textResponse(body: unknown) {
  return { text: JSON.stringify(body) };
}

function clientFor(moduleId: ReadingModuleId) {
  return jest.fn().mockResolvedValue(textResponse(MODULE_RESPONSES[moduleId]));
}

describe('generateReading', () => {
  it('returns the structured card stack parsed from the JSON response text', async () => {
    const generateContent = clientFor('three-expression');

    const result = await generateReading(makeClient(generateContent), PHOTOS_3);

    expect(result).toMatchObject({ archetype_card: { badge_tag: 'Analytical Visionary' } });
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it('stamps the module discriminator from the requested module, not the model output', async () => {
    const generateContent = jest.fn().mockResolvedValue(
      textResponse({ ...MODULE_RESPONSES['career-match'], module: 'something_else' })
    );

    const result = await generateReading(makeClient(generateContent), PHOTOS_1, 'career-match');

    expect(result.module).toBe('career_path');
  });

  it('sends the images before the text content, per PROJECT_SPEC.md §4', async () => {
    const generateContent = clientFor('three-expression');

    await generateReading(makeClient(generateContent), PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    const parts = callArgs.contents[0].parts;
    expect(parts.slice(0, 3).every((part: { inlineData?: unknown }) => !!part.inlineData)).toBe(true);
    expect(parts[3].text).toBeDefined();
  });

  it('forces JSON structured output via responseSchema', async () => {
    const generateContent = clientFor('three-expression');

    await generateReading(makeClient(generateContent), PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.responseMimeType).toBe('application/json');
    expect(callArgs.config.responseSchema).toBeDefined();
  });

  it('raises the temperature above the default to widen variety in open-ended picks', async () => {
    const generateContent = clientFor('three-expression');

    await generateReading(makeClient(generateContent), PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.temperature).toBeGreaterThan(1);
  });

  it.each(['three-expression', 'relationship-harmony', 'career-match'] as const)(
    "sends the %s module's own response schema",
    async (moduleId) => {
      const generateContent = clientFor(moduleId);

      await generateReading(makeClient(generateContent), MODULE_PHOTOS[moduleId], moduleId);

      const [[callArgs]] = generateContent.mock.calls;
      expect(callArgs.config.responseSchema).toBe(READING_SCHEMAS[moduleId]);
    }
  );

  it('wraps a network failure as a ReadingServiceError', async () => {
    const generateContent = jest.fn().mockRejectedValue(new Error('ECONNRESET'));

    await expect(generateReading(makeClient(generateContent), PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when the model responds with no text output', async () => {
    const generateContent = jest.fn().mockResolvedValue({ text: undefined });

    await expect(generateReading(makeClient(generateContent), PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when the response text is not valid JSON', async () => {
    const generateContent = jest.fn().mockResolvedValue({ text: 'not json' });

    await expect(generateReading(makeClient(generateContent), PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when a card the module renders is missing from the response', async () => {
    const { celebrity_match_card, ...withoutCelebrity } = MODULE_RESPONSES['three-expression'];
    const generateContent = jest.fn().mockResolvedValue(textResponse(withoutCelebrity));

    await expect(generateReading(makeClient(generateContent), PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  // Regression: a live Gemini response once came back with domains_card
  // present but missing top_industry_pills, which the old top-level-only
  // check let through — ReadingCards.tsx's `.map()` over the missing array
  // then crashed RevealScreen for the career-match module in production.
  it('throws when a card is present but missing one of its own required nested fields', async () => {
    const malformed = {
      ...MODULE_RESPONSES['career-match'],
      domains_card: { title: 'Recommended Industries' },
    };
    const generateContent = jest.fn().mockResolvedValue(textResponse(malformed));

    await expect(
      generateReading(makeClient(generateContent), PHOTOS_1, 'career-match')
    ).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when a required array field comes back as the wrong type', async () => {
    const malformed = {
      ...MODULE_RESPONSES['career-match'],
      recommendations_card: { title: 'Ideal Role Matches', checklist_items: 'not an array' },
    };
    const generateContent = jest.fn().mockResolvedValue(textResponse(malformed));

    await expect(
      generateReading(makeClient(generateContent), PHOTOS_1, 'career-match')
    ).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('defaults to the three-expression system prompt when no module is given', async () => {
    const generateContent = clientFor('three-expression');

    await generateReading(makeClient(generateContent), PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.systemInstruction).toBe(READING_SYSTEM_PROMPTS['three-expression']);
  });

  it.each(['three-expression', 'relationship-harmony', 'career-match'] as const)(
    "uses the %s module's own system prompt",
    async (moduleId) => {
      const generateContent = clientFor(moduleId);

      await generateReading(makeClient(generateContent), MODULE_PHOTOS[moduleId], moduleId);

      const [[callArgs]] = generateContent.mock.calls;
      expect(callArgs.config.systemInstruction).toBe(READING_SYSTEM_PROMPTS[moduleId]);
    }
  );

  it.each(['three-expression', 'relationship-harmony', 'career-match'] as const)(
    'accepts the correct photo count for %s',
    async (moduleId) => {
      const generateContent = clientFor(moduleId);

      await expect(generateReading(makeClient(generateContent), MODULE_PHOTOS[moduleId], moduleId)).resolves.toBeDefined();
      expect(generateContent).toHaveBeenCalledTimes(1);
    }
  );

  it('rejects a photo count that does not match the module', async () => {
    const generateContent = jest.fn();

    await expect(
      generateReading(makeClient(generateContent), PHOTOS_1, 'three-expression')
    ).rejects.toBeInstanceOf(ReadingServiceError);
    expect(generateContent).not.toHaveBeenCalled();
  });
});
