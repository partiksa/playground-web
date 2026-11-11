import fs from "node:fs";
import path from "node:path";
import { getDict, type Lang, type PageKey } from "@/lib/i18n";

/* Súbory content/seo-<lang>.json a content/faq-<lang>.json dopĺňa iný proces.
   Ak chýbajú, platí slovenská verzia, potom hodnoty z messages (alebo prázdne pole). */

export type SeoPage = { title?: string; description?: string };
export type SeoService = { name: string; description: string };
export type SeoOrganization = Record<string, unknown>;
export type SeoFile = {
  pages?: Partial<Record<PageKey, SeoPage>> & Record<string, SeoPage | undefined>;
  organization?: SeoOrganization;
  services?: SeoService[];
};
export type FaqItem = { q: string; a: string };

const DIR = path.join(process.cwd(), "content");

function readJson<T>(name: string): T | null {
  const file = path.join(DIR, name);
  try {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

export function getSeo(lang: Lang): SeoFile {
  const data = readJson<SeoFile>(`seo-${lang}.json`) ?? readJson<SeoFile>("seo-sk.json");
  return data && typeof data === "object" ? data : {};
}

export function getPageSeo(lang: Lang, page: PageKey): { title: string; description: string } {
  const pages = getSeo(lang).pages;
  const own = pages?.[page] ?? (page === "home" ? pages?.["index"] : undefined);
  const fb = getDict(lang).meta[page];
  return {
    title: (own?.title || "").trim() || fb.title,
    description: (own?.description || "").trim() || fb.description,
  };
}

export function getServices(lang: Lang): SeoService[] {
  const list = getSeo(lang).services;
  const ok = Array.isArray(list) ? list.filter((s) => s && s.name && s.description) : [];
  return ok.length ? ok : getDict(lang).seo.services;
}

export function getFaq(lang: Lang): FaqItem[] {
  const data = readJson<unknown>(`faq-${lang}.json`) ?? readJson<unknown>("faq-sk.json");
  const list = Array.isArray(data) ? data : data && typeof data === "object" && Array.isArray((data as { items?: unknown }).items) ? (data as { items: unknown[] }).items : [];
  return list.filter((x): x is FaqItem => !!x && typeof (x as FaqItem).q === "string" && typeof (x as FaqItem).a === "string" && !!(x as FaqItem).q.trim());
}
