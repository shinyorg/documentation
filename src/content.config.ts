import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema'

const baseSchema = docsSchema({
  extend: (context) => blogSchema(context).extend({
    comments: z.boolean().optional(),
  })
});

// Embargo future-dated posts: anything with a `date` later than build time is
// forced to `draft: true`, which keeps it out of production builds entirely
// (no page, no blog list entry, no RSS, no sitemap). Drafts still render in
// `npm run dev` so upcoming posts can be previewed locally.
// NOTE: because this is a static site, a post only goes live on the next build
// after its date — the daily scheduled run in .github/workflows/deploy.yml.
const scheduledSchema = (context: Parameters<ReturnType<typeof docsSchema>>[0]) =>
  baseSchema(context).transform((data) => {
    if (import.meta.env.MODE !== 'production') return data;
    if (data.date instanceof Date && data.date.getTime() > Date.now()) {
      return { ...data, draft: true };
    }
    return data;
  });

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: scheduledSchema
  })
  // docs: defineCollection({ schema: docsSchema() }),
  // i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
};
