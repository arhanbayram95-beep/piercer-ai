import Fastify, { FastifyError, FastifyInstance } from 'fastify';
import { VisionModelClient } from './services/geminiClient';
import { registerCors } from './middleware/cors';
import { registerRateLimit } from './middleware/rateLimit';
import { registerLegalRoutes } from './routes/legal';
import { registerRenderRoutes } from './routes/render';

// Generous enough for several full-resolution phone photos (uncapped
// resolution capture, quality 0.6 JPEG) plus JSON overhead, with headroom —
// Fastify's own default bodyLimit is 1 MiB for the whole request, far too
// small for even one such photo field.
const BODY_LIMIT_BYTES = 25 * 1024 * 1024;

export async function buildApp(visionModelClient: VisionModelClient): Promise<FastifyInstance> {
  const app = Fastify({ logger: false, bodyLimit: BODY_LIMIT_BYTES });
  // Must complete before any route is registered — see the comment on
  // registerRateLimit for why an unawaited call silently no-ops.
  await registerCors(app);
  await registerRateLimit(app);
  registerLegalRoutes(app);
  registerRenderRoutes(app, visionModelClient);

  // Defense-in-depth: every expected failure path already responds with a
  // sanitized message; Fastify's own schema-validation errors, passed
  // through below, are already safe — they only describe which
  // field/constraint failed. This catches anything genuinely unexpected — a
  // bug, a dependency throwing something unsanitized — before Fastify's
  // default handler would otherwise echo error.message straight back to the
  // client.
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
    console.error('Unhandled error in piercer.ai backend:', error);
    reply.status(500).send({ error: 'Something went wrong. Please try again.' });
  });

  return app;
}
