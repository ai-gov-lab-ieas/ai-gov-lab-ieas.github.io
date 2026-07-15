import type { APIRoute, GetStaticPaths } from 'astro';
import { MEMBERS, type Member } from '../../data/members';
import { renderMemberMarkdown } from '../../lib/render';

export const getStaticPaths = (() =>
  MEMBERS.map((member) => ({ params: { slug: member.slug }, props: { member } }))
) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { member } = props as { member: Member };
  const body = renderMemberMarkdown(member, 'zh');
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
