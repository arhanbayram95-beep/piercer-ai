import { buildApp } from './app';
import { loadEnv } from './config/env';
import { createGeminiClient } from './services/geminiClient';

async function main(): Promise<void> {
  const env = loadEnv();
  const readingModelClient = createGeminiClient(env.geminiApiKey);
  const app = await buildApp(readingModelClient);

  // Port 3000, per project convention — the Expo frontend owns 8081.
  await app.listen({ port: env.port, host: '0.0.0.0' });
  console.log(`piercer.ai backend listening on port ${env.port}`);
}

main().catch((error) => {
  console.error('Failed to start piercer.ai backend:', error);
  process.exit(1);
});
