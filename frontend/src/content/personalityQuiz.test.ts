import { PIERCING_LOCATION_JEWELRY_TYPES } from './locationJewelryTypes';
import { ARCHETYPE_RECOMMENDATIONS, computeArchetype, PERSONALITY_ARCHETYPES, QUIZ_QUESTIONS } from './personalityQuiz';

describe('personalityQuiz content', () => {
  it('has between 5 and 8 questions, each with one option per archetype', () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(5);
    expect(QUIZ_QUESTIONS.length).toBeLessThanOrEqual(8);
    for (const question of QUIZ_QUESTIONS) {
      expect(question.options).toHaveLength(PERSONALITY_ARCHETYPES.length);
      const archetypesCovered = question.options.map((o) => o.archetype).sort();
      expect(archetypesCovered).toEqual([...PERSONALITY_ARCHETYPES].sort());
    }
  });

  it('has a recommendation for every archetype', () => {
    for (const archetype of PERSONALITY_ARCHETYPES) {
      const recommendation = ARCHETYPE_RECOMMENDATIONS[archetype];
      expect(recommendation.recommendedLocations.length).toBeGreaterThan(0);
      expect(recommendation.recommendedFinish).toBeTruthy();
    }
  });

  // Regression test for the content bug QA/product flagged: an earlier
  // version paired one shared jewelryType across an archetype's 3 listed
  // locations, which broke down wherever a location doesn't actually
  // support that type (Rebel recommended "septum" jewelry for Industrial
  // and Snug; Romantic recommended "hoops" for philtrumMedusa, which only
  // supports studs). Every displayed location/jewelryType pairing —
  // including index 0, the one "Try It On" actually applies — must stay
  // valid against the same catalog PiercingStudioDrawer filters against.
  it('pairs every recommended location with a jewelry type that location actually supports', () => {
    for (const archetype of PERSONALITY_ARCHETYPES) {
      const { recommendedLocations } = ARCHETYPE_RECOMMENDATIONS[archetype];
      for (const { locationId, jewelryType } of recommendedLocations) {
        const validTypes = PIERCING_LOCATION_JEWELRY_TYPES[locationId];
        expect(validTypes).toContain(jewelryType);
      }
    }
  });
});

describe('computeArchetype', () => {
  it('picks the archetype with the most answers', () => {
    const answers = ['romantic', 'romantic', 'romantic', 'minimalist', 'rebel', 'freeSpirit'] as const;
    expect(computeArchetype([...answers])).toBe('romantic');
  });

  it('breaks ties toward the first archetype in PERSONALITY_ARCHETYPES order', () => {
    // minimalist appears before rebel in PERSONALITY_ARCHETYPES, so a 1-1
    // tie between them resolves to minimalist.
    expect(computeArchetype(['rebel', 'minimalist'])).toBe('minimalist');
  });

  it('handles a single answer', () => {
    expect(computeArchetype(['freeSpirit'])).toBe('freeSpirit');
  });
});
