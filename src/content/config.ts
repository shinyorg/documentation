import { defineCollection, z } from 'astro:content';
import { SITE } from '../consts';

const docs = defineCollection({
	schema: z.object({
		title: z.string().default(SITE.title),
		description: z.string().default(SITE.description),
		release: z.string().default("v3.0"),
		// product: z.string(),
		dir: z.union([z.literal('ltr'), z.literal('rtl')]).default('ltr'),
		image: z
			.object({
				src: z.string(),
				alt: z.string(),
			})
			.optional()
	}),
});

const blog = defineCollection({
	schema: z.object({
		draft: z.boolean().default(false),
		title: z.string(),
		release: z.string().default("v3.0"),
		image: z.object({
			src: z.string(),
			alt: z.string(),
		}),
		author: z.string().default('Allan Ritchie'),
		tags: z.array(z.string().default("announcements")),
		// An optional frontmatter property. Very common!
		// footnote: z.string().optional(),
		// In frontmatter, dates written without quotes around them are interpreted as Date objects
		pubDate: z.date(),
		// You can also transform a date string (e.g. "2022-07-08") to a Date object
		// publishDate: z.string().transform((str) => new Date(str)),
		// Advanced: Validate that the string is also a URL
		canonicalURL: z.string().url().optional()
	})
});

export const collections = { 
	'client': docs, 
	'server': docs, 
	'releases': docs, 
	'blog': blog 
};