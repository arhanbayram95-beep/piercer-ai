import { VisionModelClient } from '../../src/services/geminiClient';
import { generateMatch, MatchGenerationError } from '../../src/services/matchService';
import { MatchRequest } from '../../src/services/matchSchema';

function buildRequest(overrides: Partial<MatchRequest> = {}): MatchRequest {
  return { photo: 'ZmFrZS1waG90bw==', ...overrides };
}

describe('generateMatch', () => {
  it('parses recommendations from the model text response', async () => {
    const generateContent = jest.fn().mockResolvedValue({
      text: JSON.stringify({
        recommendations: [
          { locationId: 'helix', reason: 'Your ear shape frames a helix piercing beautifully.' },
          { locationId: 'septum', reason: 'A septum ring would suit your look.' },
        ],
      }),
    });
    const client: VisionModelClient = { models: { generateContent } };

    const result = await generateMatch(client, buildRequest());

    expect(result.recommendations).toHaveLength(2);
    expect(result.recommendations[0]).toEqual({
      locationId: 'helix',
      reason: 'Your ear shape frames a helix piercing beautifully.',
    });
  });

  it('sends the photo as inlineData and requests JSON structured output', async () => {
    const generateContent = jest.fn().mockResolvedValue({
      text: JSON.stringify({ recommendations: [{ locationId: 'lobe', reason: 'Classic and versatile.' }] }),
    });
    const client: VisionModelClient = { models: { generateContent } };

    await generateMatch(client, buildRequest({ photo: 'cGhvdG8tZGF0YQ==' }));

    const call = generateContent.mock.calls[0][0];
    expect(call.contents[0].parts[0].inlineData).toEqual({ mimeType: 'image/jpeg', data: 'cGhvdG8tZGF0YQ==' });
    expect(call.config.responseMimeType).toBe('application/json');
    expect(call.config.responseSchema).toBeDefined();
  });

  it('throws MatchGenerationError when the model returns no text', async () => {
    const generateContent = jest.fn().mockResolvedValue({});
    const client: VisionModelClient = { models: { generateContent } };

    await expect(generateMatch(client, buildRequest())).rejects.toBeInstanceOf(MatchGenerationError);
  });

  it('throws MatchGenerationError when the model returns unparsable text', async () => {
    const generateContent = jest.fn().mockResolvedValue({ text: 'not json' });
    const client: VisionModelClient = { models: { generateContent } };

    await expect(generateMatch(client, buildRequest())).rejects.toBeInstanceOf(MatchGenerationError);
  });

  it('throws MatchGenerationError when a recommendation has an invalid locationId', async () => {
    const generateContent = jest.fn().mockResolvedValue({
      text: JSON.stringify({ recommendations: [{ locationId: 'not-a-real-location', reason: 'because' }] }),
    });
    const client: VisionModelClient = { models: { generateContent } };

    await expect(generateMatch(client, buildRequest())).rejects.toBeInstanceOf(MatchGenerationError);
  });

  it('throws MatchGenerationError when recommendations is missing entirely', async () => {
    const generateContent = jest.fn().mockResolvedValue({ text: JSON.stringify({}) });
    const client: VisionModelClient = { models: { generateContent } };

    await expect(generateMatch(client, buildRequest())).rejects.toBeInstanceOf(MatchGenerationError);
  });
});
