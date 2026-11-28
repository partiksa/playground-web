import type { MetadataRoute } from "next";
import { absUrl, HREFLANG, LANGS, languages, PAGES, SITE } from "@/lib/i18n";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const list: MetadataRoute.Sitemap = LANGS.flatMap((lang) =>
    PAGES.map((page) => ({
      url: absUrl(lang, page),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page === "home" ? 1 : page === "kontakt" ? 0.6 : 0.8,
      alternates: { languages: languages(page) },
    })),
  );
  return list.concat(LANGS.map((lang) => ({
    url: `${SITE}/${lang}/ochrana-udajov/`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.2,
    alternates: { languages: Object.fromEntries(LANGS.map((l) => [HREFLANG[l], `${SITE}/${l}/ochrana-udajov/`])) },
  })));
}
