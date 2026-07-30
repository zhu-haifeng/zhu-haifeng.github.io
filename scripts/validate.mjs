import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const postPath = join(repoRoot, 'src', 'content', 'posts', 'beijing.md');
const post = readFileSync(postPath, 'utf8');
const failures = [];

const requiredFiles = [
  'astro.config.mjs',
  'package.json',
  'src/pages/index.astro',
  'src/pages/about.astro',
  'src/pages/posts/[...id].astro',
  'src/styles/global.css',
  '.github/workflows/deploy.yml',
];

for (const file of requiredFiles) {
  if (!existsSync(join(repoRoot, file))) failures.push(`Missing required file: ${file}`);
}

const imageSources = [...post.matchAll(/<img src="([^"]+)"/g)].map((match) => match[1]);
for (const source of imageSources) {
  const assetPath = join(repoRoot, 'assets', decodeURIComponent(source.replace(/^\//, '')));
  if (!existsSync(assetPath)) failures.push(`Missing image: ${source}`);
}

if (imageSources.length !== 28) failures.push(`Expected 28 article images, found ${imageSources.length}`);
if ((post.match(/<figure class="photo portrait">/g) || []).length !== 11) failures.push('Portrait image classification changed');
if (/file:\/\/\/|C:\/Users|mmbiz\.qpic\.cn/.test(post)) failures.push('Post contains a non-portable image path');
if (!post.includes('good dumplings') || !post.includes('迪拜转机')) failures.push('The Forbidden City travel story is missing');
if (post.includes('图片：Joseph')) failures.push('Removed photo credit reappeared');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated ${imageSources.length} article images and all required site files.`);
