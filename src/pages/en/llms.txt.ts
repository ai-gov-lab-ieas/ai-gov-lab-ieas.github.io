import type { APIRoute } from 'astro';
import { buildLlmsTxt } from '../../lib/llmsTxt';

export const GET: APIRoute = () =>
  new Response(buildLlmsTxt('en'), {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
