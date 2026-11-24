import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Carrega arquivos Markdown e MDX de `src/content/blog/`.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// Tags em minúsculas, sem acento de preferência (viram URLs: /tags/ia/)
			tags: z.array(z.string().regex(/^[a-z0-9-]+$/, 'use letras minúsculas, números e hífen')).default([]),
			// Posts com draft: true aparecem no `npm run dev`, mas não são publicados.
			draft: z.boolean().default(false),
			heroImage: z.optional(image()),
		}),
});

export const collections = { blog };
