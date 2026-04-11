/**
 * Build-time sitemap generator.
 * Reads event IDs from src/data/events/ filenames and writes dist/sitemap.xml.
 * Run after `vite build` via the build script in package.json.
 */

import { readdir, writeFile } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const EVENTS_DIR = join(ROOT, 'src/data/events');
const DIST_DIR = join(ROOT, 'dist');
const BASE_URL = 'https://ai-gov-lab-ieas.github.io';

const STATIC_URLS = [
  { loc: `${BASE_URL}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${BASE_URL}/event`, changefreq: 'weekly', priority: '0.8' },
];

function toXmlEntry({ loc, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority ? `    <priority>${priority}</priority>` : '',
    '  </url>',
  ].filter(Boolean).join('\n');
}

async function getEventIds() {
  const files = await readdir(EVENTS_DIR);
  return files
    .map(f => basename(f, '.ts'))
    .filter(id => !id.startsWith('_') && id !== 'index' && id !== 'types');
}

async function main() {
  const eventIds = await getEventIds();
  const eventUrls = eventIds.map(id => ({
    loc: `${BASE_URL}/event/${id}`,
    priority: '0.6',
  }));

  const allUrls = [...STATIC_URLS, ...eventUrls];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allUrls.map(toXmlEntry),
    '</urlset>',
  ].join('\n');

  const outPath = join(DIST_DIR, 'sitemap.xml');
  await writeFile(outPath, xml, 'utf-8');
  console.log(`sitemap.xml written to ${outPath} (${allUrls.length} URLs)`);
}

main().catch(err => { console.error(err); process.exit(1); });
