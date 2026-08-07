import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';

// Public launch has no RevenueCat gate yet (requireActiveEntitlement is a
// permissive stub, see entitlement.ts) and no per-device identifier is sent
// today, so IP address (the plugin's default key) is the only signal
// available to stop a script from hammering a paid Gemini call for free.
// Generous enough that someone genuinely trying all three reading modules
// in one sitting never notices it.
const MAX_REQUESTS_PER_WINDOW = 20;
const WINDOW = '10 minutes';

// MUST be awaited, and awaited before any route is registered on `app`.
// @fastify/rate-limit applies itself to routes via an onRoute hook set up
// inside its (async) plugin body — that body only actually runs once
// Fastify's plugin queue is flushed, which `await app.register(...)` forces.
// Registering it without awaiting first, then immediately calling
// registerReadingRoutes, adds the route to the router before the plugin's
// onRoute hook exists to see it, so it silently never gets rate-limited —
// confirmed by reproducing it in isolation (unawaited: no x-ratelimit-*
// headers, ever; awaited: headers present and decrementing from request 1).
export async function registerRateLimit(app: FastifyInstance): Promise<void> {
  await app.register(rateLimit, {
    global: true,
    max: MAX_REQUESTS_PER_WINDOW,
    timeWindow: WINDOW,
    // A real Error with .statusCode, not a plain object — app.ts's
    // setErrorHandler keys off .statusCode === 429 to route this to a 429
    // response; a plain object has no such property and would otherwise
    // fall into that handler's generic "unexpected error" 500 branch.
    errorResponseBuilder: () => {
      const err = new Error("You're doing that a bit too fast — please wait a few minutes and try again.");
      (err as Error & { statusCode: number }).statusCode = 429;
      return err;
    },
  });
}
