import { FastifyInstance } from 'fastify';
import { requireActiveEntitlement } from '../middleware/entitlement';
import { VisionModelClient } from '../services/geminiClient';
import { generateMatch, MatchGenerationError } from '../services/matchService';
import { MatchRequest } from '../services/matchSchema';

interface MatchPhotoBody {
  photo: string;
}

const MATCH_PHOTO_SCHEMA = {
  body: {
    type: 'object',
    required: ['photo'],
    properties: {
      photo: { type: 'string', minLength: 1 },
    },
  },
} as const;

// HTTP layer only — parse, validate, call the service, respond. No AI
// provider SDK calls here (those live in services/matchService.ts), per
// CLAUDE.md's backend/src/routes/ boundary rule. `body.photo` is never
// written to disk or a database, per the Privacy Architecture's
// process-and-discard rule (PROJECT_SPEC.md §3).
export function registerMatchRoutes(app: FastifyInstance, visionModelClient: VisionModelClient): void {
  app.post<{ Body: MatchPhotoBody }>(
    '/api/v1/match/photo',
    { schema: MATCH_PHOTO_SCHEMA, preHandler: requireActiveEntitlement },
    async (request, reply) => {
      const { photo } = request.body;
      const matchRequest: MatchRequest = { photo };

      try {
        const result = await generateMatch(visionModelClient, matchRequest);
        reply.status(200).send(result);
      } catch (error) {
        if (error instanceof MatchGenerationError) {
          reply.status(502).send({ error: error.message });
          return;
        }
        throw error;
      }
    }
  );
}
