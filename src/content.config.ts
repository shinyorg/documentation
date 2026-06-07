import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema'

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: (context) => blogSchema(context).extend({
        comments: z.boolean().optional(),
      })
    })
  })
  // docs: defineCollection({ schema: docsSchema() }),
  // i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
};