import { getCollection, type CollectionEntry } from 'astro:content';

export type Lang = 'zh' | 'zh-hant' | 'en' | 'fr';
export type NewsEntry = CollectionEntry<'news'>;

// "<slug>/<lang>" -> { slug, lang }
export const splitId = (id: string) => {
  const i = id.lastIndexOf('/');
  return { slug: id.slice(0, i), lang: id.slice(i + 1) as Lang };
};

const LANGS: Lang[] = ['zh', 'zh-hant', 'en', 'fr'];

// Every item must exist in all four languages, otherwise the flag switcher
// on its article page would lead to a 404. Fail the build instead.
async function assertComplete() {
  const bySlug = new Map<string, Set<string>>();
  for (const e of await getCollection('news', e => !e.data.draft)) {
    const { slug, lang } = splitId(e.id);
    if (!bySlug.has(slug)) bySlug.set(slug, new Set());
    bySlug.get(slug)!.add(lang);
  }
  for (const [slug, langs] of bySlug) {
    const missing = LANGS.filter(l => !langs.has(l));
    if (missing.length) throw new Error(`News "${slug}" is missing: ${missing.join(', ')}`);
  }
}

// Published items in one language, newest first.
export async function getNews(lang: Lang) {
  await assertComplete();
  const all = await getCollection('news', e => !e.data.draft && splitId(e.id).lang === lang);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const newsStrings = {
  zh: {
    categories: { company: '公司动态', industry: '行业资讯', local: '本地新闻' },
    all: '全部', readMore: '阅读全文', back: '返回新闻动态', source: '来源',
    empty: '内容即将上线', dateLocale: 'zh-CN'
  },
  'zh-hant': {
    categories: { company: '公司動態', industry: '行業資訊', local: '本地新聞' },
    all: '全部', readMore: '閱讀全文', back: '返回新聞動態', source: '來源',
    empty: '內容即將上線', dateLocale: 'zh-HK'
  },
  en: {
    categories: { company: 'Company News', industry: 'Industry Insights', local: 'Local News' },
    all: 'All', readMore: 'Read more', back: 'Back to News', source: 'Source',
    empty: 'Coming Soon', dateLocale: 'en-CA'
  },
  fr: {
    categories: { company: "Nouvelles de l'entreprise", industry: "Industrie de l'assurance", local: 'Nouvelles locales' },
    all: 'Tout', readMore: 'Lire la suite', back: 'Retour aux actualités', source: 'Source',
    empty: 'Bientôt disponible', dateLocale: 'fr-CA'
  }
} as const;

export const formatDate = (d: Date, lang: Lang) =>
  d.toLocaleDateString(newsStrings[lang].dateLocale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
