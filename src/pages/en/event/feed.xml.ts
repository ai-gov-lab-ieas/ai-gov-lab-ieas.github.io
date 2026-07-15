import type { APIRoute } from 'astro';
import { buildAtomFeed } from '../../../lib/atom';
import { POSTS } from '../../../data/events/loader';

export const GET: APIRoute = () => {
  const body = buildAtomFeed('en', POSTS);
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
};
