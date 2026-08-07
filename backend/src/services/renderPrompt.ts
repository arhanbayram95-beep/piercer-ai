import { JewelryFinish, JewelryItem, JewelryType } from './renderSchema';

// Entertainment framing per CLAUDE.md/PROJECT_SPEC.md §1: this is a fun,
// non-clinical preview, not a real piercing recommendation. Shared across
// every jewelry/finish combination so the constraint can't drift out of one
// prompt variant without the others (same pattern the old face-reading
// feature used for its per-module SAFETY_RULES block).
const SAFETY_RULES = [
  'This is an entertainment preview, not a real piercing procedure, medical device recommendation, or professional consultation.',
  'Preserve the person\'s identity, skin, facial features, and the rest of the photo exactly as captured — only add the jewelry piece(s) themselves.',
  'Do not add, remove, or alter any actual piercing, wound, or body modification beyond placing the jewelry image(s) on the skin surface.',
  'Do not generate any medical, clinical, or diagnostic commentary.',
].join(' ');

const JEWELRY_TYPE_DESCRIPTIONS: Record<JewelryType, string> = {
  hoops: 'a hoop ring',
  studs: 'a small stud',
  barbells: 'a straight barbell',
  industrial: 'an industrial barbell spanning two piercing points',
  septum: 'a septum ring',
  dermal: 'a flat-top dermal anchor',
};

const FINISH_DESCRIPTIONS: Record<JewelryFinish, string> = {
  silver: 'a polished silver',
  gold: 'a polished gold',
  titanium: 'a brushed titanium',
  blackSteel: 'a matte black steel',
};

function describeItem(item: JewelryItem): string {
  return `${FINISH_DESCRIPTIONS[item.finish]} ${JEWELRY_TYPE_DESCRIPTIONS[item.jewelryType]}`;
}

// Pure function — no AI provider SDK in the loop — per CLAUDE.md's
// "Pure Functions" convention for prompt-assembly logic, so it's testable
// without mocking anything. Accepts one-or-more items so a single call
// covers both the plain single-piece render and the Pro-only "multi-
// piercing stacking" case (renderSchema.ts's RenderRequest.additionalItems)
// without a second code path.
export function assembleRenderPrompt(items: JewelryItem[]): string {
  if (items.length === 0) {
    throw new Error('assembleRenderPrompt requires at least one jewelry item.');
  }

  const piecesDescription =
    items.length === 1
      ? `${describeItem(items[0])} piercing`
      : `these piercings, each in its own realistic anatomical position: ${items.map(describeItem).join('; ')}`;

  return [
    `Edit this photo to show what it would look like with ${piecesDescription} placed naturally on the body part shown.`,
    'Match the lighting, shadows, and photo style of the original image so the jewelry looks like it belongs in the photo.',
    SAFETY_RULES,
  ].join(' ');
}
