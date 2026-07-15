import type { APIRoute } from 'astro';
import { buildLlmsFull } from '../lib/llmsTxt';

export const GET: APIRoute = () =>
  new Response(buildLlmsFull('zh'), {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
