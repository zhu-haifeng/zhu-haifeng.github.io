import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
  const items = posts.map((post) => {
    const url = new URL(`/posts/${post.id}/`, site).href;
    return `<item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${post.data.publishedAt.toUTCString()}</pubDate>
      <description>${escapeXml(post.data.description)}</description>
    </item>`;
  }).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>山月随想录</title>
    <link>${new URL('/', site).href}</link>
    <description>旅行、城市与途中所想。</description>
    ${items}
  </channel>
</rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
