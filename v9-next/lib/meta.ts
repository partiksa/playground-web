import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content";
import { absUrl, getDict, languages, LANGS, OG_LOCALE, SITE, toLang, type PageKey } from "@/lib/i18n";

const OG_IMAGE = { url: "/og.jpg", width: 1200, height: 630 };

export async function pageMetadata(params: Promise<{ lang: string }>, page: PageKey): Promise<Metadata> {
  const lang = toLang((await params).lang);
  const t = getDict(lang);
  const { title, description } = getPageSeo(lang, page);
  const url = absUrl(lang, page);
  return {
    metadataBase: new URL(SITE),
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: languages(page) },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: t.meta.siteName,
      locale: OG_LOCALE[lang],
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [{ ...OG_IMAGE, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    robots: { index: true, follow: true },
  };
}
