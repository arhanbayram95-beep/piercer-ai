import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';

// No cookie/session auth anywhere in this API (the client sends images +
// a module id, nothing credentialed) so reflecting any origin is safe —
// there's no session to leak cross-site. Needed for the app's web target
// and any browser-based testing (React Native's own fetch doesn't enforce
// CORS, but a browser does, and Fastify 404s an unregistered OPTIONS
// preflight by default without this).
//
// MUST be awaited, and awaited before any route is registered on `app` —
// same ordering requirement as registerRateLimit (see that file's comment).
export async function registerCors(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
  });
}
