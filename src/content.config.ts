import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    cover: z.string(),
    coverAlt: z.string(),
    section: z.string().default('随笔'),
    tocDepth: z.union([z.literal(2), z.literal(3)]).default(3),
    tags: z.array(z.string()).default([]),
    presentation: z.enum(['standard', 'showcase']).default('standard'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
