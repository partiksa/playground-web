import type { MetadataRoute } from "next";
import { absUrl, LANGS, languages, PAGES } from "@/lib/i18n";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return LANGS.flatMap((lang) =>
    PAGES.map((page) => ({
      url: absUrl(lang, page),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page === "home" ? 1 : page === "kontakt" ? 0.6 : 0.8,
      alternates: { languages: languages(page) },
    })),
  );
}
