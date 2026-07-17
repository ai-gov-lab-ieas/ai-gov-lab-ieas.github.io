// Dedicated, hand-tuned SEO copy for every static page, per locale.
// Detail pages (events, people) derive their metadata from their data
// records instead — see resolvePageSeo() in src/lib/seo.ts.
//
// Copy rules: front-load primary keywords (AI 治理 / AI governance,
// 中央研究院 / Academia Sinica); descriptions ≤160 chars with a distinct
// value proposition per page; EN titles end with SITE_SUFFIX_EN
// (enforced by tests/pageSeo.test.ts).
import type { Locale } from '../config';
import { SITE_SUFFIX_EN, SITE_NAME_BILINGUAL_EN } from '../lib/seo';

export interface StaticPageSeo {
  title: string;        // full <title> — brand suffix already composed
  description: string;
  ogImageAlt: string;
}

export interface EventListPageSeo {
  title: string;
  description: (count: number) => string;  // keeps the live event count dynamic
  ogImageAlt: string;
}

export const PAGE_SEO: {
  home: Record<Locale, StaticPageSeo>;
  eventList: Record<Locale, EventListPageSeo>;
  peopleList: Record<Locale, StaticPageSeo>;
  notFound: Record<Locale, StaticPageSeo>;  // single bilingual page — zh entry is the one used
} = {
  home: {
    zh: {
      title: 'AI 治理觀念實驗室 - 中研院歐美所',
      description:
        'AI 治理觀念實驗室由中央研究院歐美研究所成立，聚焦生成式 AI 治理，結合法律、哲學、倫理學與資訊科學，透過全球規範與在地觀點的對話，豐富全球 AI 治理的討論。',
      ogImageAlt: 'AI 治理觀念實驗室',
    },
    en: {
      title: SITE_SUFFIX_EN,
      description:
        'AI governance research at IEAS, Academia Sinica: generative AI, law, philosophy, ethics, and computer science — bridging global norms and local contexts.',
      ogImageAlt: 'AI Governance Laboratory',
    },
  },
  eventList: {
    zh: {
      title: '學術活動 - AI 治理觀念實驗室',
      description: (count) =>
        `AI 治理觀念實驗室的專題演講、國際研討會與工作坊，共 ${count} 場學術活動，主題涵蓋 AI 治理、資料保護與 AI 倫理。`,
      ogImageAlt: 'AI 治理觀念實驗室學術活動',
    },
    en: {
      title: `Events - ${SITE_SUFFIX_EN}`,
      description: (count) =>
        `${count} lectures, conferences, and workshops on AI governance, data protection, and AI ethics at the AI Governance Laboratory, Academia Sinica.`,
      ogImageAlt: 'AI Governance Laboratory events',
    },
  },
  peopleList: {
    zh: {
      title: '參與成員 - AI 治理觀念實驗室',
      description:
        'AI 治理觀念實驗室成員：中央研究院跨領域研究人員，專長涵蓋法律、哲學、倫理學與資訊科學等 AI 治理相關領域。',
      ogImageAlt: 'AI 治理觀念實驗室參與成員',
    },
    en: {
      title: `Team - ${SITE_SUFFIX_EN}`,
      description:
        'Members of the AI Governance Laboratory — interdisciplinary researchers at Academia Sinica across law, philosophy, ethics, and computer science.',
      ogImageAlt: 'AI Governance Laboratory team',
    },
  },
  notFound: {
    zh: {
      title: `404 - ${SITE_NAME_BILINGUAL_EN}`,
      description: '找不到這個頁面 / Page not found',
      ogImageAlt: 'AI 治理觀念實驗室',
    },
    en: {
      title: `404 - ${SITE_NAME_BILINGUAL_EN}`,
      description: '找不到這個頁面 / Page not found',
      ogImageAlt: 'AI Governance Laboratory',
    },
  },
};
