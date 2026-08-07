import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { ReadingModelClient } from '../../src/services/geminiClient';

describe('CORS', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    const readingModelClient: ReadingModelClient = { models: { generateContent: jest.fn() } };
    app = await buildApp(readingModelClient);
  });

  afterEach(async () => {
    await app.close();
  });

  it('answers a cross-origin preflight instead of 404ing it', async () => {
    const response = await app.inject({
      method: 'OPTIONS',
      url: '/legal/privacy',
      headers: {
        origin: 'https://example.com',
        'access-control-request-method': 'POST',
      },
    });

    expect(response.statusCode).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe('https://example.com');
  });

  it('reflects the request origin on real responses too', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/legal/privacy',
      headers: { origin: 'https://example.com' },
    });

    expect(response.headers['access-control-allow-origin']).toBe('https://example.com');
  });
});
