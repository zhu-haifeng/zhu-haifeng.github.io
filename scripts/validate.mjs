import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(repoRoot, 'src', 'content', 'posts');
const postFiles = readdirSync(postsDir).filter((file) => /\.mdx?$/.test(file));
const posts = new Map(postFiles.map((file) => [file, readFileSync(join(postsDir, file), 'utf8')]));
const beijingPost = posts.get('beijing.md') ?? '';
const higashinoPost = posts.get('higashino-keigo.md') ?? '';
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

let totalImageCount = 0;
for (const [filename, post] of posts) {
  const inlineImages = [...post.matchAll(/<img src="([^"]+)"/g)].map((match) => match[1]);
  const cover = post.match(/^cover:\s*(\S+)/m)?.[1];
  const imageSources = cover ? [cover, ...inlineImages] : inlineImages;
  totalImageCount += inlineImages.length;

  for (const source of imageSources) {
    if (/^(?:https?:|file:)|C:[/\\]Users/i.test(source)) {
      failures.push(`${filename} contains a non-portable image path: ${source}`);
      continue;
    }

    const assetPath = join(repoRoot, 'assets', decodeURIComponent(source.replace(/^\//, '')));
    if (!existsSync(assetPath)) failures.push(`${filename} is missing image: ${source}`);
  }
}

const beijingImages = [...beijingPost.matchAll(/<img src="([^"]+)"/g)];
if (beijingImages.length !== 28) failures.push(`Expected 28 Beijing article images, found ${beijingImages.length}`);
if ((beijingPost.match(/<figure class="photo portrait">/g) || []).length !== 11) failures.push('Beijing portrait image classification changed');
if (!beijingPost.includes('good dumplings') || !beijingPost.includes('迪拜转机')) failures.push('The Forbidden City travel story is missing');
if (beijingPost.includes('图片：Joseph')) failures.push('Removed photo credit reappeared');

const higashinoImages = [...higashinoPost.matchAll(/<img src="([^"]+)"/g)];
if (higashinoImages.length !== 8) failures.push(`Expected 8 Higashino article images, found ${higashinoImages.length}`);
if (!higashinoPost.includes('https://mp.weixin.qq.com/s/D0YaPKmEbx6XN3Meg41Cjg')) failures.push('Higashino source link is missing');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated ${posts.size} posts, ${totalImageCount} article images, and all required site files.`);
