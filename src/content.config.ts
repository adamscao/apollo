import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One folder per news item, one Markdown file per language:
//   src/content/news/<YYYY-MM-DD-slug>/{zh,zh-hant,en,fr}.md
// Entry ids come out as "<YYYY-MM-DD-slug>/<lang>".
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['company', 'industry', 'local']),
    summary: z.string(),
    // Path under public/, e.g. /news/<slug>/cover.jpg
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    // Original source for industry/local items (link out rather than reprint).
    source: z.object({ name: z.string(), url: z.string().url() }).optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = { news };
