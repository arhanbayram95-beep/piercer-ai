import { PiercingLocationId } from './piercingLocations';
import { TranslationKey } from '../i18n/translations';
import { JewelryFinish, JewelryType } from '../state/slices/studioSlice';

// Pure client-side quiz logic for the personality-matching module's quiz
// entry point (piece 3, quiz leg — genuinely separate from the photo leg in
// api/match.ts, per the product brief; this path makes no AI/backend call
// at all). 6 short multiple-choice questions, each option mapped to one of
// 4 light, on-brand archetypes; the archetype with the most answers wins
// (ties broken by whichever archetype scored first). Archetype -> piercing
// recommendation is a static rule-based lookup, not AI-generated.
export type PersonalityArchetype = 'minimalist' | 'romantic' | 'rebel' | 'freeSpirit';

export const PERSONALITY_ARCHETYPES: PersonalityArchetype[] = ['minimalist', 'romantic', 'rebel', 'freeSpirit'];

export interface QuizOption {
  archetype: PersonalityArchetype;
  labelKey: TranslationKey;
}

export interface QuizQuestion {
  id: string;
  questionKey: TranslationKey;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'weekend',
    questionKey: 'quiz.q.weekend',
    options: [
      { archetype: 'minimalist', labelKey: 'quiz.q.weekend.minimalist' },
      { archetype: 'romantic', labelKey: 'quiz.q.weekend.romantic' },
      { archetype: 'rebel', labelKey: 'quiz.q.weekend.rebel' },
      { archetype: 'freeSpirit', labelKey: 'quiz.q.weekend.freeSpirit' },
    ],
  },
  {
    id: 'palette',
    questionKey: 'quiz.q.palette',
    options: [
      { archetype: 'minimalist', labelKey: 'quiz.q.palette.minimalist' },
      { archetype: 'romantic', labelKey: 'quiz.q.palette.romantic' },
      { archetype: 'rebel', labelKey: 'quiz.q.palette.rebel' },
      { archetype: 'freeSpirit', labelKey: 'quiz.q.palette.freeSpirit' },
    ],
  },
  {
    id: 'playlist',
    questionKey: 'quiz.q.playlist',
    options: [
      { archetype: 'minimalist', labelKey: 'quiz.q.playlist.minimalist' },
      { archetype: 'romantic', labelKey: 'quiz.q.playlist.romantic' },
      { archetype: 'rebel', labelKey: 'quiz.q.playlist.rebel' },
      { archetype: 'freeSpirit', labelKey: 'quiz.q.playlist.freeSpirit' },
    ],
  },
  {
    id: 'accessory',
    questionKey: 'quiz.q.accessory',
    options: [
      { archetype: 'minimalist', labelKey: 'quiz.q.accessory.minimalist' },
      { archetype: 'romantic', labelKey: 'quiz.q.accessory.romantic' },
      { archetype: 'rebel', labelKey: 'quiz.q.accessory.rebel' },
      { archetype: 'freeSpirit', labelKey: 'quiz.q.accessory.freeSpirit' },
    ],
  },
  {
    id: 'trip',
    questionKey: 'quiz.q.trip',
    options: [
      { archetype: 'minimalist', labelKey: 'quiz.q.trip.minimalist' },
      { archetype: 'romantic', labelKey: 'quiz.q.trip.romantic' },
      { archetype: 'rebel', labelKey: 'quiz.q.trip.rebel' },
      { archetype: 'freeSpirit', labelKey: 'quiz.q.trip.freeSpirit' },
    ],
  },
  {
    id: 'outfit',
    questionKey: 'quiz.q.outfit',
    options: [
      { archetype: 'minimalist', labelKey: 'quiz.q.outfit.minimalist' },
      { archetype: 'romantic', labelKey: 'quiz.q.outfit.romantic' },
      { archetype: 'rebel', labelKey: 'quiz.q.outfit.rebel' },
      { archetype: 'freeSpirit', labelKey: 'quiz.q.outfit.freeSpirit' },
    ],
  },
];

export interface ArchetypeRecommendation {
  nameKey: TranslationKey;
  descriptionKey: TranslationKey;
  recommendedLocationIds: PiercingLocationId[];
  recommendedJewelryType: JewelryType;
  recommendedFinish: JewelryFinish;
}

export const ARCHETYPE_RECOMMENDATIONS: Record<PersonalityArchetype, ArchetypeRecommendation> = {
  minimalist: {
    nameKey: 'quiz.archetype.minimalist.name',
    descriptionKey: 'quiz.archetype.minimalist.description',
    recommendedLocationIds: ['lobe', 'upperLobe', 'nostril'],
    recommendedJewelryType: 'studs',
    recommendedFinish: 'silver',
  },
  romantic: {
    nameKey: 'quiz.archetype.romantic.name',
    descriptionKey: 'quiz.archetype.romantic.description',
    recommendedLocationIds: ['tragus', 'philtrumMedusa', 'helix'],
    recommendedJewelryType: 'hoops',
    recommendedFinish: 'gold',
  },
  rebel: {
    nameKey: 'quiz.archetype.rebel.name',
    descriptionKey: 'quiz.archetype.rebel.description',
    recommendedLocationIds: ['septum', 'industrial', 'snug'],
    recommendedJewelryType: 'barbells',
    recommendedFinish: 'blackSteel',
  },
  freeSpirit: {
    nameKey: 'quiz.archetype.freeSpirit.name',
    descriptionKey: 'quiz.archetype.freeSpirit.description',
    recommendedLocationIds: ['rook', 'daith', 'conch'],
    recommendedJewelryType: 'hoops',
    recommendedFinish: 'titanium',
  },
};

// Tally votes per archetype across all answered questions; the archetype
// with the most votes wins. Ties break toward whichever archetype appears
// first in PERSONALITY_ARCHETYPES, so the result is always deterministic
// for a given answer set (important for testing, not just UX polish).
export function computeArchetype(answers: PersonalityArchetype[]): PersonalityArchetype {
  const counts: Record<PersonalityArchetype, number> = {
    minimalist: 0,
    romantic: 0,
    rebel: 0,
    freeSpirit: 0,
  };
  for (const answer of answers) {
    counts[answer] += 1;
  }

  let winner: PersonalityArchetype = PERSONALITY_ARCHETYPES[0];
  let winnerCount = -1;
  for (const archetype of PERSONALITY_ARCHETYPES) {
    if (counts[archetype] > winnerCount) {
      winner = archetype;
      winnerCount = counts[archetype];
    }
  }
  return winner;
}
