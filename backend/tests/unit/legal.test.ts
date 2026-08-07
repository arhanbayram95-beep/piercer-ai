import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { ReadingModelClient } from '../../src/services/geminiClient';

describe('legal document routes', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    const readingModelClient: ReadingModelClient = { models: { generateContent: jest.fn() } };
    app = await buildApp(readingModelClient);
  });

  afterEach(async () => {
    await app.close();
  });

  it('serves the privacy policy as HTML', async () => {
    const response = await app.inject({ method: 'GET', url: '/legal/privacy' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.body).toContain('Privacy Policy');
    expect(response.body).toContain('Face Data (User Photos)');
  });

  it('serves the terms & conditions as HTML', async () => {
    const response = await app.inject({ method: 'GET', url: '/legal/terms' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.body).toContain('Terms &amp; Conditions');
    expect(response.body).toContain('Subscriptions &amp; Free Trial');
  });

  it('is exempt from rate limiting', async () => {
    let last;
    for (let i = 0; i < 25; i++) {
      last = await app.inject({ method: 'GET', url: '/legal/privacy' });
    }

    expect(last?.statusCode).toBe(200);
  });
});
