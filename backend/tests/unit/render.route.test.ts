import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { VisionModelClient } from '../../src/services/geminiClient';

function buildValidBody(overrides: Record<string, unknown> = {}) {
  return {
    photo: 'ZmFrZS1waG90bw==',
    jewelryType: 'hoops',
    finish: 'silver',
    ...overrides,
  };
}

describe('POST /api/v1/render/preview', () => {
  let app: FastifyInstance;
  let generateContent: jest.Mock;

  beforeEach(async () => {
    generateContent = jest.fn().mockResolvedValue({
      candidates: [{ content: { parts: [{ inlineData: { data: 'cmVuZGVyZWQ=', mimeType: 'image/png' } }] } }],
    });
    const visionModelClient: VisionModelClient = { models: { generateContent } };
    app = await buildApp(visionModelClient);
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns the rendered image on a valid request', async () => {
    const response = await app.inject({ method: 'POST', url: '/api/v1/render/preview', payload: buildValidBody() });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ renderedImage: 'cmVuZGVyZWQ=', mimeType: 'image/png' });
  });

  it('rejects a request missing the photo field', async () => {
    const body = buildValidBody();
    delete (body as Record<string, unknown>).photo;

    const response = await app.inject({ method: 'POST', url: '/api/v1/render/preview', payload: body });

    expect(response.statusCode).toBe(400);
  });

  it('rejects an unsupported jewelryType', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/render/preview',
      payload: buildValidBody({ jewelryType: 'crown' }),
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error).toContain('crown');
  });

  it('rejects an unsupported finish', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/render/preview',
      payload: buildValidBody({ finish: 'rose-gold' }),
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error).toContain('rose-gold');
  });

  it('accepts a request with stacked additionalItems', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/render/preview',
      payload: buildValidBody({ additionalItems: [{ jewelryType: 'dermal', finish: 'gold' }] }),
    });

    expect(response.statusCode).toBe(200);
  });

  it('rejects additionalItems containing an unsupported jewelryType', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/render/preview',
      payload: buildValidBody({ additionalItems: [{ jewelryType: 'crown', finish: 'gold' }] }),
    });

    expect(response.statusCode).toBe(400);
  });

  it('rejects additionalItems beyond the stacking limit', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/render/preview',
      payload: buildValidBody({
        additionalItems: [
          { jewelryType: 'dermal', finish: 'gold' },
          { jewelryType: 'studs', finish: 'silver' },
          { jewelryType: 'barbells', finish: 'titanium' },
          { jewelryType: 'septum', finish: 'blackSteel' },
        ],
      }),
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 502 when the AI model fails to return an image', async () => {
    generateContent.mockResolvedValue({ candidates: [{ content: { parts: [{ text: 'no image' }] } }] });

    const response = await app.inject({ method: 'POST', url: '/api/v1/render/preview', payload: buildValidBody() });

    expect(response.statusCode).toBe(502);
  });

  it('returns 500 without leaking internal error details when the AI client throws unexpectedly', async () => {
    generateContent.mockRejectedValue(new Error('network exploded with a stack trace nobody should see'));

    const response = await app.inject({ method: 'POST', url: '/api/v1/render/preview', payload: buildValidBody() });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: 'Something went wrong. Please try again.' });
  });
});
