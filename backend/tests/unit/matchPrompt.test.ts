import { assembleMatchPrompt } from '../../src/services/matchPrompt';

describe('assembleMatchPrompt', () => {
  it('lists every valid location ID for the model to choose from', () => {
    const prompt = assembleMatchPrompt();
    expect(prompt).toContain('lobe');
    expect(prompt).toContain('dermal');
    expect(prompt).toContain('septum');
  });

  it('includes the light, non-clinical tone rules', () => {
    const prompt = assembleMatchPrompt();
    expect(prompt).toContain('light, fun, and encouraging');
    expect(prompt).toContain('never clinical or diagnostic');
  });

  it('never comments on identity or personal details', () => {
    const prompt = assembleMatchPrompt();
    expect(prompt).toContain('never guess their age, identity, or personal details');
  });
});
