import { FastifyReply, FastifyRequest } from 'fastify';

// STUB — RevenueCat integration is Phase 5.1 and needs REVENUECAT_API_KEY,
// which is not present in .env yet (see CLAUDE.md pause condition: missing
// secret credentials). This currently allows every request through so the
// rest of the pipeline is testable; do not treat it as real entitlement
// enforcement. Replace the body with a real RevenueCat subscriber lookup
// before Phase 5.1 ships.
export async function requireActiveEntitlement(_request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  return;
}
