import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { VisionModelClient } from '../../src/services/geminiClient';

describe('POST /api/v1/match/photo', () => {
  let app: FastifyInstance;
  let generateContent: jest.Mock;

  beforeEach(async () => {
    generateContent = jest.fn().mockResolvedValue({
      text: JSON.stringify({ recommendations: [{ locationId: 'helix', reason: 'Suits your ear shape.' }] }),
    });
    const visionModelClient: VisionModelClient = { models: { generateContent } };
    app = await buildApp(visionModelClient);
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns recommendations on a valid request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/match/photo',
      payload: { photo: 'ZmFrZS1waG90bw==' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ recommendations: [{ locationId: 'helix', reason: 'Suits your ear shape.' }] });
  });

  it('rejects a request missing the photo field', async () => {
    const response = await app.inject({ method: 'POST', url: '/api/v1/match/photo', payload: {} });
    expect(response.statusCode).toBe(400);
  });

  it('returns 502 when the AI model fails to return usable recommendations', async () => {
    generateContent.mockResolvedValue({ text: 'not json' });

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/match/photo',
      payload: { photo: 'ZmFrZS1waG90bw==' },
    });

    expect(response.statusCode).toBe(502);
  });

  it('returns 500 without leaking internal error details when the AI client throws unexpectedly', async () => {
    generateContent.mockRejectedValue(new Error('network exploded with a stack trace nobody should see'));

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/match/photo',
      payload: { photo: 'ZmFrZS1waG90bw==' },
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: 'Something went wrong. Please try again.' });
  });
});
