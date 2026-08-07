import Fastify, { FastifyError, FastifyInstance } from 'fastify';
import { ReadingModelClient } from './services/geminiClient';
import { registerCors } from './middleware/cors';
import { registerRateLimit } from './middleware/rateLimit';
import { registerLegalRoutes } from './routes/legal';
import { registerReadingRoutes } from './routes/reading';

// Fastify's own default bodyLimit is 1 MiB for the whole request — far
// smaller than even a single photo field's own 8,000,000-character
// allowance in analyzeBodySchema (routes/reading.ts), let alone three of
// them. 25 MiB comfortably covers 3 real full-resolution phone photos
// (uncapped resolution capture, quality 0.6 JPEG) at that per-field cap
// plus JSON overhead, with headroom.
const BODY_LIMIT_BYTES = 25 * 1024 * 1024;

export async function buildApp(readingModelClient: ReadingModelClient): Promise<FastifyInstance> {
  const app = Fastify({ logger: false, bodyLimit: BODY_LIMIT_BYTES });
  // Must complete before any route is registered — see the comment on
  // registerRateLimit for why an unawaited call silently no-ops.
  await registerCors(app);
  await registerRateLimit(app);
  registerReadingRoutes(app, readingModelClient);
  registerLegalRoutes(app);

  // Defense-in-depth: every expected failure path already responds with a
  // sanitized message (ReadingServiceError handling in routes/reading.ts;
  // Fastify's own schema-validation errors, passed through below, are
  // already safe — they only describe which field/constraint failed).
  // This catches anything genuinely unexpected — a bug, a dependency
  // throwing something unsanitized — before Fastify's default handler
  // would otherwise echo error.message straight back to the client.
  app.setErrorHandler((error: FastifyError, _request, reply) => {
    if (error.validation) {
      reply.status(error.statusCode ?? 400).send({ error: error.message });
      return;
    }
    // @fastify/rate-limit throws its errorResponseBuilder's return value on
    // exceeding the limit (see middleware/rateLimit.ts) -- an expected,
    // already-sanitized control-flow response, not the "something broke"
    // case the branch below is for.
    if (error.statusCode === 429) {
      reply.status(429).send({ error: error.message });
      return;
    }
    console.error('Unhandled error in Face Reader backend:', error);
    reply.status(500).send({ error: 'Something went wrong. Please try again.' });
  });

  return app;
}
