import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema'
import type { Loader, LoaderContext } from 'astro/loaders';

const baseSchema = docsSchema({
  extend: (context) => blogSchema(context).extend({
    comments: z.boolean().optional(),
  })
});

// Embargo future-dated posts: anything with a `date` later than build time is
// dropped from the store entirely in production builds (no page, no blog list
// entry, no tag page, no RSS, no sitemap). Entries still load in `npm run dev`
// so upcoming posts can be previewed locally.
//
// This MUST happen in the loader, not in a schema `transform()`. The content
// layer caches whatever the schema produced, keyed on the file's content digest
// — so a post committed while it was still future-dated would have `draft: true`
// baked into the cache and would never publish, because its file never changes
// again. CI restores that cache too (withastro/action caches `node_modules/.astro`).
// Deleting here runs on every build regardless of cache state, and a deleted
// entry is simply re-parsed on the next build once its date has passed.
//
// NOTE: because this is a static site, a post only goes live on the next build
// after its date — the daily scheduled run in .github/workflows/deploy.yml.
function embargoedDocsLoader(): Loader {
  const loader = docsLoader();
  return {
    ...loader,
    name: 'starlight-docs-loader-embargoed',
    async load(context: LoaderContext) {
      await loader.load(context);
      if (import.meta.env.MODE !== 'production') return;

      const now = Date.now();
      for (const [id, entry] of context.store.entries()) {
        const date = entry.data?.date;
        const time =
          date instanceof Date ? date.getTime() : typeof date === 'string' ? Date.parse(date) : NaN;

        if (!Number.isNaN(time) && time > now) {
          context.store.delete(id);
          context.logger.info(`Embargoed until ${new Date(time).toISOString().slice(0, 10)}: ${id}`);
        }
      }
    },
  };
}

export const collections = {
  docs: defineCollection({
    loader: embargoedDocsLoader(),
    schema: baseSchema
  })
  // docs: defineCollection({ schema: docsSchema() }),
  // i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
};
