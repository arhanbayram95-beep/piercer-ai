import { assembleRenderPrompt } from '../../src/services/renderPrompt';

describe('assembleRenderPrompt', () => {
  it('describes the selected jewelry type and finish', () => {
    const prompt = assembleRenderPrompt('septum', 'gold');
    expect(prompt).toContain('gold');
    expect(prompt).toContain('septum ring');
  });

  it('always includes the entertainment/identity-preservation safety rules', () => {
    const prompt = assembleRenderPrompt('hoops', 'silver');
    expect(prompt).toContain('entertainment preview');
    expect(prompt).toContain("Preserve the person's identity");
  });

  it('produces a distinct prompt per jewelry type', () => {
    const hoops = assembleRenderPrompt('hoops', 'silver');
    const dermal = assembleRenderPrompt('dermal', 'silver');
    expect(hoops).not.toEqual(dermal);
  });

  it('produces a distinct prompt per finish', () => {
    const silver = assembleRenderPrompt('studs', 'silver');
    const blackSteel = assembleRenderPrompt('studs', 'blackSteel');
    expect(silver).not.toEqual(blackSteel);
  });
});
