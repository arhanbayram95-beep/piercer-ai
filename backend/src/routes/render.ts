import { FastifyInstance } from 'fastify';
import { requireActiveEntitlement } from '../middleware/entitlement';
import { VisionModelClient } from '../services/geminiClient';
import { generateRender, RenderGenerationError } from '../services/renderService';
import {
  isJewelryFinish,
  isJewelryType,
  isValidAdditionalItems,
  JewelryItem,
  RenderRequest,
} from '../services/renderSchema';

interface RenderPreviewBody {
  photo: string;
  jewelryType: string;
  finish: string;
  additionalItems?: unknown;
}

const RENDER_PREVIEW_SCHEMA = {
  body: {
    type: 'object',
    required: ['photo', 'jewelryType', 'finish'],
    properties: {
      photo: { type: 'string', minLength: 1 },
      jewelryType: { type: 'string' },
      finish: { type: 'string' },
      additionalItems: {
        type: 'array',
        items: {
          type: 'object',
          required: ['jewelryType', 'finish'],
          properties: {
            jewelryType: { type: 'string' },
            finish: { type: 'string' },
          },
        },
      },
    },
  },
} as const;

// HTTP layer only — parse, validate, call the service, respond. No AI
// provider SDK calls here (those live in services/renderService.ts), per
// CLAUDE.md's backend/src/routes/ boundary rule. `body.photo` is a local
// variable that goes out of scope once this handler returns — never
// written to disk or a database, per the Privacy Architecture's
// process-and-discard rule (PROJECT_SPEC.md §3).
export function registerRenderRoutes(app: FastifyInstance, visionModelClient: VisionModelClient): void {
  app.post<{ Body: RenderPreviewBody }>(
    '/api/v1/render/preview',
    { schema: RENDER_PREVIEW_SCHEMA, preHandler: requireActiveEntitlement },
    async (request, reply) => {
      const { photo, jewelryType, finish, additionalItems } = request.body;

      if (!isJewelryType(jewelryType)) {
        reply.status(400).send({ error: `Unsupported jewelryType: ${jewelryType}` });
        return;
      }
      if (!isJewelryFinish(finish)) {
        reply.status(400).send({ error: `Unsupported finish: ${finish}` });
        return;
      }

      let validatedAdditionalItems: JewelryItem[] | undefined;
      if (additionalItems !== undefined) {
        if (!isValidAdditionalItems(additionalItems)) {
          reply.status(400).send({ error: 'Invalid additionalItems: each entry needs a supported jewelryType/finish, up to the stacking limit.' });
          return;
        }
        validatedAdditionalItems = additionalItems;
      }

      const renderRequest: RenderRequest = {
        photo,
        jewelryType,
        finish,
        additionalItems: validatedAdditionalItems,
      };

      try {
        const result = await generateRender(visionModelClient, renderRequest);
        reply.status(200).send(result);
      } catch (error) {
        if (error instanceof RenderGenerationError) {
          reply.status(502).send({ error: error.message });
          return;
        }
        throw error;
      }
    }
  );
}
