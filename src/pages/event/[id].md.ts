import type { APIRoute, GetStaticPaths } from 'astro';
import { POSTS } from '../../data/events/loader';
import { renderEventMarkdown } from '../../lib/render';
import type { Event } from '../../data/events/types';

export const getStaticPaths = (() =>
  POSTS.map((event) => ({ params: { id: event.id }, props: { event } }))
) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { event } = props as { event: Event };
  const body = renderEventMarkdown(event, 'zh');
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
