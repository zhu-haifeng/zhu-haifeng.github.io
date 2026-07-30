import { readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');
const workspaceRoot = resolve(repoRoot, '..');
const sourcePath = join(workspaceRoot, '北京游记草稿.md');
const imageDirectory = join(workspaceRoot, '微信上传缓存');
const outputPath = join(repoRoot, 'src', 'content', 'posts', 'beijing.md');

function readJpegSize(filePath) {
  const data = readFileSync(filePath);
  const startOfFrame = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;

  while (offset + 9 < data.length) {
    if (data[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = data[offset + 1];
    if (startOfFrame.has(marker)) {
      return { height: data.readUInt16BE(offset + 5), width: data.readUInt16BE(offset + 7) };
    }
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }
    const segmentLength = data.readUInt16BE(offset + 2);
    if (segmentLength < 2) break;
    offset += segmentLength + 2;
  }
  throw new Error(`Unable to read JPEG dimensions: ${filePath}`);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const source = readFileSync(sourcePath, 'utf8');
const body = [];
let titleSkipped = false;

for (const line of source.split(/\r?\n/)) {
  if (!titleSkipped && /^#\s+/.test(line)) {
    titleSkipped = true;
    continue;
  }

  const image = line.match(/^!\[(.*?)\]\((.+?)(?:\s+"([^"]+)")?\)$/);
  if (!image) {
    body.push(line);
    continue;
  }

  const [, alt, sourceImagePath, customCaption] = image;
  const caption = customCaption || alt;
  const fileName = basename(sourceImagePath);
  const imagePath = join(imageDirectory, fileName);
  const { width, height } = readJpegSize(imagePath);
  const orientationClass = height > width ? ' portrait' : '';

  body.push(`<figure class="photo${orientationClass}">`);
  body.push(`  <img src="/images/beijing/${encodeURIComponent(fileName)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async">`);
  body.push(`  <figcaption>${escapeHtml(caption)}</figcaption>`);
  body.push('</figure>');
}

while (body.length && body[0].trim() === '') body.shift();

const frontmatter = `---
title: 来中国，为什么绕不开北京
description: 从天坛、天安门和故宫，到圆明园与鸟巢，在北京的中轴与历史现场中，理解为什么一趟中国旅行绕不开北京。
publishedAt: 2026-07-30
updatedAt: 2026-07-31
cover: /images/beijing/dji_export_photo_20260729172202543_1785318125515edit.jpg
coverAlt: 从景山南望故宫与北京中轴线
tags:
  - 北京
  - 旅行
  - 历史
draft: false
---

`;

writeFileSync(outputPath, `${frontmatter}${body.join('\n').trimEnd()}\n`, 'utf8');
console.log(`Imported article to ${outputPath}`);
