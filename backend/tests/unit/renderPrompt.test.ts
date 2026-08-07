import { assembleRenderPrompt } from '../../src/services/renderPrompt';

describe('assembleRenderPrompt', () => {
  it('describes the selected jewelry type and finish for a single item', () => {
    const prompt = assembleRenderPrompt([{ jewelryType: 'septum', finish: 'gold' }]);
    expect(prompt).toContain('gold');
    expect(prompt).toContain('septum ring');
  });

  it('always includes the entertainment/identity-preservation safety rules', () => {
    const prompt = assembleRenderPrompt([{ jewelryType: 'hoops', finish: 'silver' }]);
    expect(prompt).toContain('entertainment preview');
    expect(prompt).toContain("Preserve the person's identity");
  });

  it('produces a distinct prompt per jewelry type', () => {
    const hoops = assembleRenderPrompt([{ jewelryType: 'hoops', finish: 'silver' }]);
    const dermal = assembleRenderPrompt([{ jewelryType: 'dermal', finish: 'silver' }]);
    expect(hoops).not.toEqual(dermal);
  });

  it('produces a distinct prompt per finish', () => {
    const silver = assembleRenderPrompt([{ jewelryType: 'studs', finish: 'silver' }]);
    const blackSteel = assembleRenderPrompt([{ jewelryType: 'studs', finish: 'blackSteel' }]);
    expect(silver).not.toEqual(blackSteel);
  });

  it('describes every stacked item when more than one is given', () => {
    const prompt = assembleRenderPrompt([
      { jewelryType: 'hoops', finish: 'silver' },
      { jewelryType: 'studs', finish: 'gold' },
    ]);
    expect(prompt).toContain('hoop ring');
    expect(prompt).toContain('stud');
    expect(prompt).toContain('silver');
    expect(prompt).toContain('gold');
  });

  it('throws when given an empty item list', () => {
    expect(() => assembleRenderPrompt([])).toThrow();
  });
});
