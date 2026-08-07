import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { ReadingModelClient } from '../../src/services/geminiClient';

describe('global rate limiting', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    const readingModelClient: ReadingModelClient = { models: { generateContent: jest.fn() } };
    app = await buildApp(readingModelClient);
    // Legal routes are deliberately exempt from rate limiting (see
    // routes/legal.ts), so a throwaway route stands in for whatever
    // production endpoint eventually lands here — it only needs to pick up
    // the global @fastify/rate-limit registration under test.
    app.get('/__test-route', async () => ({ ok: true }));
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('allows requests under the limit through', async () => {
    const response = await app.inject({ method: 'GET', url: '/__test-route' });
    expect(response.statusCode).toBe(200);
  });

  it('returns 429 with a sanitized message once the per-IP limit is exceeded', async () => {
    // The configured limit is 20 requests / 10 minutes (see middleware/rateLimit.ts) —
    // .inject() calls all share the same default remote address, so firing
    // 21 in a row from one test genuinely exercises the real threshold.
    let last;
    for (let i = 0; i < 21; i++) {
      last = await app.inject({ method: 'GET', url: '/__test-route' });
    }

    expect(last?.statusCode).toBe(429);
    expect(last?.json()).toEqual({
      error: "You're doing that a bit too fast — please wait a few minutes and try again.",
    });
  });
});
