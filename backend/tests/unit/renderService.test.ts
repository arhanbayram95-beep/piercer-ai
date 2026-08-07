import { VisionModelClient } from '../../src/services/geminiClient';
import { generateRender, RenderGenerationError } from '../../src/services/renderService';
import { RenderRequest } from '../../src/services/renderSchema';

function buildRequest(overrides: Partial<RenderRequest> = {}): RenderRequest {
  return {
    photo: 'ZmFrZS1waG90bw==',
    jewelryType: 'hoops',
    finish: 'silver',
    ...overrides,
  };
}

describe('generateRender', () => {
  it('extracts the rendered image from the first inlineData part in the response', async () => {
    const generateContent = jest.fn().mockResolvedValue({
      candidates: [
        {
          content: {
            parts: [{ text: 'Here you go!' }, { inlineData: { data: 'cmVuZGVyZWQ=', mimeType: 'image/png' } }],
          },
        },
      ],
    });
    const client: VisionModelClient = { models: { generateContent } };

    const result = await generateRender(client, buildRequest());

    expect(result).toEqual({ renderedImage: 'cmVuZGVyZWQ=', mimeType: 'image/png' });
  });

  it('sends the photo as inlineData and the assembled prompt as a text part', async () => {
    const generateContent = jest.fn().mockResolvedValue({
      candidates: [{ content: { parts: [{ inlineData: { data: 'YWJj', mimeType: 'image/png' } }] } }],
    });
    const client: VisionModelClient = { models: { generateContent } };

    await generateRender(client, buildRequest({ photo: 'cGhvdG8tZGF0YQ==', jewelryType: 'septum', finish: 'gold' }));

    const call = generateContent.mock.calls[0][0];
    const parts = call.contents[0].parts;
    expect(parts[0].inlineData).toEqual({ mimeType: 'image/jpeg', data: 'cGhvdG8tZGF0YQ==' });
    expect(parts[1].text).toContain('septum');
    expect(parts[1].text).toContain('gold');
  });

  it('includes stacked additionalItems in the assembled prompt', async () => {
    const generateContent = jest.fn().mockResolvedValue({
      candidates: [{ content: { parts: [{ inlineData: { data: 'YWJj', mimeType: 'image/png' } }] } }],
    });
    const client: VisionModelClient = { models: { generateContent } };

    await generateRender(
      client,
      buildRequest({ additionalItems: [{ jewelryType: 'dermal', finish: 'blackSteel' }] })
    );

    const call = generateContent.mock.calls[0][0];
    const promptText = call.contents[0].parts[1].text;
    expect(promptText).toContain('hoop');
    expect(promptText).toContain('dermal');
    expect(promptText).toContain('black steel');
  });

  it('throws RenderGenerationError when the model returns no image part', async () => {
    const generateContent = jest.fn().mockResolvedValue({
      candidates: [{ content: { parts: [{ text: 'Sorry, I cannot do that.' }] } }],
    });
    const client: VisionModelClient = { models: { generateContent } };

    await expect(generateRender(client, buildRequest())).rejects.toBeInstanceOf(RenderGenerationError);
  });

  it('throws RenderGenerationError when the response has no candidates at all', async () => {
    const generateContent = jest.fn().mockResolvedValue({});
    const client: VisionModelClient = { models: { generateContent } };

    await expect(generateRender(client, buildRequest())).rejects.toBeInstanceOf(RenderGenerationError);
  });
});
