import sk from "@/messages/sk.json";
import cz from "@/messages/cz.json";
import en from "@/messages/en.json";
import de from "@/messages/de.json";

export const SITE = "https://play-ground.sk";
export const LANGS = ["sk", "cz", "en", "de"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "sk";

/** Kód jazyka pre hreflang a <html lang>; URL pre češtinu ostáva /cz/. */
export const HREFLANG: Record<Lang, string> = { sk: "sk", cz: "cs", en: "en", de: "de" };
export const OG_LOCALE: Record<Lang, string> = { sk: "sk_SK", cz: "cs_CZ", en: "en_US", de: "de_DE" };

export const PAGES = ["home", "ihriska", "prerabka", "revizie", "realizacie", "o-nas", "kontakt"] as const;
export type PageKey = (typeof PAGES)[number];
export const MENU: PageKey[] = ["ihriska", "prerabka", "revizie", "realizacie", "o-nas", "kontakt"];

export type Dict = typeof sk;
/* Chýbajúce kľúče v preklade doplní slovenčina. */
function merge(base: unknown, over: unknown): unknown {
  if (Array.isArray(base)) return Array.isArray(over) && over.length ? over : base;
  if (base && typeof base === "object") {
    const o = (over && typeof over === "object" ? over : {}) as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(base as object)) out[k] = merge((base as Record<string, unknown>)[k], o[k]);
    return out;
  }
  return typeof over === typeof base ? over : base;
}
const DICTS: Record<Lang, Dict> = {
  sk,
  cz: merge(sk, cz) as Dict,
  en: merge(sk, en) as Dict,
  de: merge(sk, de) as Dict,
};

export function isLang(x: string): x is Lang {
  return (LANGS as readonly string[]).includes(x);
}
export function getDict(lang: string): Dict {
  return DICTS[isLang(lang) ? lang : DEFAULT_LANG];
}
export function toLang(lang: string): Lang {
  return isLang(lang) ? lang : DEFAULT_LANG;
}

/** Relatívna adresa stránky s lomkou na konci, napr. /sk/ihriska/ */
export function href(lang: Lang, page: PageKey, query = ""): string {
  return `/${lang}/${page === "home" ? "" : page + "/"}${query}`;
}
export function absUrl(lang: Lang, page: PageKey): string {
  return SITE + href(lang, page);
}
/** hreflang mapa pre metadata a sitemap */
export function languages(page: PageKey): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LANGS) out[HREFLANG[l]] = absUrl(l, page);
  out["x-default"] = absUrl(DEFAULT_LANG, page);
  return out;
}
/** jednoduché dosadenie {name} */
export function fill(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}
