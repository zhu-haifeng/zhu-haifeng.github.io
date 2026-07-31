import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const outputDir = new URL('../assets/images/higashino/', import.meta.url);

const images = [
  ['xianyi-ren-x.jpg', 'https://mmbiz.qpic.cn/mmbiz_jpg/6bL9463sKAAS2EyAKDNownm3L7IxDYf5SuBOicWIbKPf4wWoFNzBicOia89Ea5gnGafWx9v2rKPGrIozPmpVMJdxibepib8mtan5vb7NPasqqq5A/640'],
  ['byakuyako.jpg', 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/6bL9463sKACbFWXia0ZPMxK8EpicaOJbVDly8UVcxfqt9BbMqL4QOeXu2FYib7uQTzibeVDxKjVPuXXiaP85y5tQIGLDjN08yaVA0YV5wWOfaDDI/640'],
  ['malice.jpg', 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/6bL9463sKADLFZRicAM6KSfcDwAJiaFKvuwlrYnm1qzBc0fPny3q18Mv0V0jibVSUJUdj9ddJMleOl7JUC16iakLHLoARuCd4LLeKtRBnYrz34M/640'],
  ['namiya.jpg', 'https://mmbiz.qpic.cn/mmbiz_jpg/6bL9463sKACkXug26oMT5GOhFhwrtzp1X9mV5eZ0sicibdKI8G03bHKqAmfKdBmOaHtwsVq0At9X8H8mcDEMsZQDa03icowOvA3Ubr9SbKFCEA/640'],
  ['prayer.jpg', 'https://mmbiz.qpic.cn/mmbiz_jpg/6bL9463sKADBhxZ2dKhGbSv7IHQTA5icq6tz6SPFLzjqTichgiaXq4ib8CPDpzVibdMzWIXw8IbqXRfuwGvptv4PCibeTkiaxXYtuuyGxv7zwKFb0c/640'],
  ['suspect-x-film.jpg', 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/6bL9463sKACLzFlpoKpnJCphFZpzEjos62sLTG6s3wFaP6TFNZ3dzMScEWpAVdHRmMsics7MuIRnrGVYp8TPicKz6kibh16hGoIGE4hBK8opYM/640'],
  ['byakuyako-drama.jpg', 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/6bL9463sKACXyibEj3IJvtxdmGtlUBSuTFElZ5WibyicZDV3HFXJtUrPsibMsMJgkqbB5tN2oymQ1beEAUnXicc8DnDtFWZXHZ1Md2Ry35qmtbjs/640'],
  ['masquerade-hotel.png', 'https://mmbiz.qpic.cn/mmbiz_png/6bL9463sKACRNqaBtAGHibyfJt2ptMgE1yt1q2zCic679nSSrQPdicKX5PibCub7icyUlZCMWd78P4Tq3NfIm2hPUZZbxz1PmLup9ucPSasAYlkI/640'],
];

await mkdir(outputDir, { recursive: true });

for (const [filename, url] of images) {
  const response = await fetch(url, {
    headers: {
      Referer: 'https://mp.weixin.qq.com/',
      'User-Agent': 'Mozilla/5.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download ${filename}: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  const expectedType = extname(filename) === '.png' ? 'image/png' : 'image/jpeg';
  if (!contentType.startsWith(expectedType)) {
    throw new Error(`Unexpected content type for ${filename}: ${contentType}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  await writeFile(new URL(filename, outputDir), bytes);
  console.log(`${filename}: ${bytes.length} bytes`);
}

console.log(`Imported ${images.length} images into ${join('assets', 'images', 'higashino')}.`);
