import {
  CareerPathResult,
  CharacterAnalysisResult,
  MODULE_PHOTO_COUNTS,
  ReadingResult,
  RelationshipHarmonyResult,
  readingBadgeCard,
  readingScoreCard,
  readingShareableSections,
} from './types';

// These three helpers are what stand between a module's response shape and
// the surfaces that render it module-agnostically — ResultsScreen's history
// rows, RevealScreen's share-card section picker, ShareOptionsModal. Each
// one switches on `module`, so every module needs its own case exercised:
// a missed branch surfaces as a blank history row or a share card silently
// dropping a section, not as a type error.
const CHARACTER: CharacterAnalysisResult = {
  module: 'character_analysis',
  archetype_card: {
    title: 'Character Archetype',
    badge_tag: 'Analytical Visionary',
    summary: 'You read as someone people trust instantly.',
  },
  facial_structure_card: {
    title: 'Facial Structure',
    shape_tag: 'Oval',
    description: 'Balanced proportions with a defined jawline.',
  },
  spirit_animal_card: {
    title: 'Spirit Animal Match',
    animal: 'Wolf',
    description: 'A steady gaze reads as sharp awareness.',
  },
  traits_card: {
    title: 'Facial Trait Analysis',
    metadata_badges: [{ key: 'Eye Energy', value: 'Direct & Piercing' }],
    strength_pills: ['Strategic Thinking', 'Quiet Authority'],
    growth_pills: ['Pacing Energy'],
  },
  celebrity_match_card: {
    title: 'Celebrity Archetype Match',
    match_name: 'A Public Figure',
    match_description: 'Same calm-under-pressure register.',
  },
};

const RELATIONSHIP: RelationshipHarmonyResult = {
  module: 'relationship_harmony',
  vibe_card: {
    title: 'Relational Archetype',
    badge_tag: 'Grounded & Playful Harmonizer',
    summary: 'Two styles that meet in the middle.',
  },
  chemistry_score_card: {
    title: 'Chemistry & Synergy Score',
    overall_score: 91,
    breakdown_metrics: [
      { label: 'Empathy', score: 88, icon: 'heart' },
      { label: 'Communication', score: 84, icon: 'chat' },
      { label: 'Attachment', score: 79, icon: 'shield' },
      { label: 'Energy Match', score: 95, icon: 'zap' },
    ],
  },
  dynamics_card: {
    title: 'Relationship Dynamics',
    best_chemistry_pills: ['Grounded Calmness', 'Shared Humour'],
    vibes_to_avoid_pills: ['Superficial Drama'],
  },
  guidance_card: {
    title: 'Harmony Recommendations',
    checklist_items: [
      { headline: 'Direct Communication', description: 'Say it early and plainly.' },
      { headline: 'Shared Downtime', description: 'Protect the unstructured hours.' },
    ],
  },
};

const CAREER: CareerPathResult = {
  module: 'career_path',
  work_archetype_card: {
    title: 'Career Archetype',
    badge_tag: 'Strategic Innovator',
    summary: 'You settle fastest in rooms that reward long-range thinking.',
  },
  domains_card: {
    title: 'Recommended Industries',
    top_industry_pills: ['Product Design', 'Applied Research', 'Venture Building'],
  },
  recommendations_card: {
    title: 'Ideal Role Matches',
    checklist_items: [
      { headline: 'Systems Architect', description: 'Owning the shape of a thing end to end.' },
      { headline: 'Research Lead', description: 'Setting direction rather than executing a brief.' },
    ],
  },
};

const ALL_READINGS: ReadingResult[] = [CHARACTER, RELATIONSHIP, CAREER];

describe('readingBadgeCard', () => {
  it('returns the leading badge card for every module', () => {
    expect(readingBadgeCard(CHARACTER)).toBe(CHARACTER.archetype_card);
    expect(readingBadgeCard(RELATIONSHIP)).toBe(RELATIONSHIP.vibe_card);
    expect(readingBadgeCard(CAREER)).toBe(CAREER.work_archetype_card);
  });
});

describe('readingScoreCard', () => {
  it('returns the chemistry score card for relationship harmony', () => {
    expect(readingScoreCard(RELATIONSHIP)).toBe(RELATIONSHIP.chemistry_score_card);
  });

  // Character analysis and career path deliberately dropped their score
  // cards so the reading opens on a badge, not a number (see api/types.ts).
  it('returns undefined for the modules that carry no score', () => {
    expect(readingScoreCard(CHARACTER)).toBeUndefined();
    expect(readingScoreCard(CAREER)).toBeUndefined();
  });
});

describe('readingShareableSections', () => {
  it('offers one section per card of a character analysis reading', () => {
    expect(readingShareableSections(CHARACTER).map((section) => section.id)).toEqual([
      'archetype',
      'facial-structure',
      'spirit-animal',
      'traits',
      'celebrity',
    ]);
  });

  it('offers one section per card of a relationship harmony reading', () => {
    expect(readingShareableSections(RELATIONSHIP).map((section) => section.id)).toEqual([
      'vibe',
      'chemistry',
      'dynamics',
      'guidance',
    ]);
  });

  it('offers one section per card of a career path reading', () => {
    expect(readingShareableSections(CAREER).map((section) => section.id)).toEqual([
      'work',
      'domains',
      'recommendations',
    ]);
  });

  it('titles every section with the card title straight off the reading', () => {
    expect(readingShareableSections(CAREER).map((section) => section.title)).toEqual([
      'Career Archetype',
      'Recommended Industries',
      'Ideal Role Matches',
    ]);
  });

  it('flattens list-shaped cards into readable prose rather than raw arrays', () => {
    const sections = readingShareableSections(CAREER);
    expect(sections.find((section) => section.id === 'domains')?.body).toBe(
      'Product Design, Applied Research, Venture Building'
    );
    expect(sections.find((section) => section.id === 'recommendations')?.body).toBe(
      'Systems Architect, Research Lead'
    );
  });

  // RevealScreen seeds its section picker from these ids and ShareCard keys
  // its rendered rows off them — a duplicate would collapse two cards into
  // one selectable row and drop content from the share card silently.
  it('gives every section a unique, non-empty id and body', () => {
    for (const reading of ALL_READINGS) {
      const sections = readingShareableSections(reading);
      expect(new Set(sections.map((section) => section.id)).size).toBe(sections.length);
      expect(sections.every((section) => section.id && section.title && section.body)).toBe(true);
    }
  });
});

describe('MODULE_PHOTO_COUNTS', () => {
  // AnalyzingScreen refuses to call the backend unless the captured count
  // matches exactly, and the backend enforces the same numbers in
  // generateReading — these two lists have to stay in lockstep.
  it('matches the per-module counts the backend enforces', () => {
    expect(MODULE_PHOTO_COUNTS).toEqual({
      'three-expression': 3,
      'relationship-harmony': 2,
      'career-match': 1,
    });
  });
});
