import { AnalyzeReadingPayload, ReadingModuleId, ReadingResult } from './types';

// Canned responses for USE_MOCK_API — lets the whole capture -> analyzing ->
// reveal flow be exercised end to end with no backend running and no AI
// provider key configured, one per module so mock mode can actually verify
// each module's card stack differs. Shapes match the per-module response
// schemas in backend/src/services/readingSchema.ts.
// Remove alongside the config flag before public release.
const MOCK_READING_RESULTS: Record<ReadingModuleId, ReadingResult> = {
  'three-expression': {
    module: 'character_analysis',
    archetype_card: {
      title: 'Character Archetype',
      badge_tag: 'Analytical Visionary',
      summary: 'Placeholder pseudo-API output for testing, not a real reading.',
    },
    facial_structure_card: {
      title: 'Facial Structure',
      shape_tag: 'Oval',
      description: 'Placeholder text — balanced proportions with a defined jawline and a forehead slightly wider than the chin.',
    },
    spirit_animal_card: {
      title: 'Spirit Animal Match',
      animal: 'Wolf',
      description: 'Placeholder text — a steady, direct gaze and a defined jawline read as sharp awareness and quiet independence.',
    },
    traits_card: {
      title: 'Facial Trait Analysis',
      metadata_badges: [
        { key: 'Eye Energy', value: 'Direct & Piercing' },
        { key: 'Brow Line', value: 'Focused & Structured' },
        { key: 'Jaw Energy', value: 'Determined & Grounded' },
      ],
      strength_pills: ['Strategic Thinking', 'Emotional Resilience', 'Charismatic Presence'],
      growth_pills: ['Pacing Energy', 'Over-analyzing'],
    },
    celebrity_match_card: {
      title: 'Celebrity Archetype Match',
      match_name: 'A Well-Known Public Figure',
      match_description:
        'Placeholder text — shares the same calm-under-pressure register, holding a room without raising the volume.',
    },
  },
  'relationship-harmony': {
    module: 'relationship_harmony',
    vibe_card: {
      title: 'Relational Archetype',
      badge_tag: 'Grounded & Playful Harmonizer',
      summary:
        'Placeholder pseudo-API output for testing, not a real reading. One brings steady reassurance, the other brings momentum — the two meet somewhere comfortable.',
    },
    chemistry_score_card: {
      title: 'Chemistry & Synergy Score',
      overall_score: 92,
      breakdown_metrics: [
        { label: 'Empathy', score: 89, icon: 'heart' },
        { label: 'Communication', score: 94, icon: 'chat' },
        { label: 'Attachment', score: 82, icon: 'shield' },
        { label: 'Energy Match', score: 96, icon: 'zap' },
      ],
    },
    dynamics_card: {
      title: 'Relationship Dynamics',
      best_chemistry_pills: ['Spontaneous Energy', 'Grounded Calmness', 'Intellectual Spark'],
      vibes_to_avoid_pills: ['Superficial Drama', 'Inconsistent Plans'],
    },
    guidance_card: {
      title: 'Harmony Recommendations',
      checklist_items: [
        { headline: 'Direct Communication', description: 'Say what you need early, in plain calm language, rather than hinting.' },
        { headline: 'Space & Autonomy', description: 'Deep closeness works best here with real personal room built in around it.' },
      ],
    },
  },
  'career-match': {
    module: 'career_path',
    work_archetype_card: {
      title: 'Career Archetype',
      badge_tag: 'Strategic Innovator',
      summary: 'Placeholder pseudo-API output for testing, not a real reading.',
    },
    domains_card: {
      title: 'Recommended Industries',
      top_industry_pills: ['Engineering & R&D', 'Strategic Consulting', 'Creative Tech Leadership'],
    },
    recommendations_card: {
      title: 'Ideal Role Matches',
      checklist_items: [
        {
          headline: 'Systems Architect / Lead Engineer',
          description: 'Leverages sustained focus and structured problem-solving when the pressure is on.',
        },
        {
          headline: 'Product Strategist',
          description: 'Pairs analytical range with the observational read that makes a room feel understood.',
        },
      ],
    },
  },
};

const MOCK_LATENCY_MS = 1200;

export async function analyzeReadingMock(payload: AnalyzeReadingPayload): Promise<ReadingResult> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  return MOCK_READING_RESULTS[payload.module];
}
