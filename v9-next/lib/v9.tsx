/* Pomocné funkcie pre stránky: port v9/_build/build.py do TSX (rovnaké značky ako v9).
   Beží len na serveri pri builde (číta rozmery obrázkov a priečinky realizácií z public/). */
import fs from "node:fs";
import path from "node:path";
import { Fragment, type ReactNode } from "react";
import sk from "@/messages/sk.json";
import cz from "@/messages/cz.json";
import en from "@/messages/en.json";
import de from "@/messages/de.json";
import faqSk from "@/content/faq-sk.json";
import faqCz from "@/content/faq-cz.json";
import faqEn from "@/content/faq-en.json";
import faqDe from "@/content/faq-de.json";
import { href, type Lang, type PageKey } from "@/lib/i18n";

const PUB = path.join(process.cwd(), "public");
const MSG: Record<Lang, unknown> = { sk, cz, en, de };
const FAQ: Record<Lang, { q: string; a: string }[]> = { sk: faqSk, cz: faqCz, en: faqEn, de: faqDe };

/* Slinkee nemá písmená s diakritikou a jeho „I“ vyzerá ako J: tieto nadpisy majú iné Slinkee písmeno */
const OVR: Partial<Record<Lang, Record<string, string>>> = {
  cz: { "ihriska.places.h": "Pro provozy, kde jsou {D}ěti", "prerabka.why.h": "Často rychlejší a levnější než nové {H}řiště" },
  de: {
    "home.chapters[2].h": "Ein Gerüst nach Ihren {W}änden",
    "ihriska.places.h": "Für Betriebe, in denen Kinder {S}ind",
    "prerabka.process.h": "Umbau Schritt für {S}chritt",
    "prerabka.why.h": "Oft schneller und günstiger als ein neuer Spielpl{<A}tz",
  },
};

export type QA = [string, string];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

/* ---------- rozmery obrázka (WebP, PNG, JPEG) bez knižnice ---------- */
const sizes = new Map<string, [number, number]>();
export function isize(rel: string): [number, number] {
  const hit = sizes.get(rel);
  if (hit) return hit;
  const b = fs.readFileSync(path.join(PUB, rel));
  let w = 0, h = 0;
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const t = b.toString("ascii", 12, 16);
    if (t === "VP8 ") { w = b.readUInt16LE(26) & 0x3fff; h = b.readUInt16LE(28) & 0x3fff; }
    else if (t === "VP8L") { const n = b.readUInt32LE(21); w = (n & 0x3fff) + 1; h = ((n >> 14) & 0x3fff) + 1; }
    else if (t === "VP8X") { w = 1 + b.readUIntLE(24, 3); h = 1 + b.readUIntLE(27, 3); }
  } else if (b.readUInt32BE(0) === 0x89504e47) { w = b.readUInt32BE(16); h = b.readUInt32BE(20); }
  else if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      const mk = b[i + 1], len = b.readUInt16BE(i + 2);
      if (mk >= 0xc0 && mk <= 0xcf && mk !== 0xc4 && mk !== 0xc8 && mk !== 0xcc) { h = b.readUInt16BE(i + 5); w = b.readUInt16BE(i + 7); break; }
      i += 2 + len;
    }
  }
  if (!w || !h) throw new Error("Neznámy rozmer obrázka: " + rel);
  sizes.set(rel, [w, h]);
  return [w, h];
}

export function exists(rel: string) {
  return fs.existsSync(path.join(PUB, rel));
}

export function listDir(rel: string) {
  return fs.readdirSync(path.join(PUB, rel));
}

/* ---------- kontext stránky: texty a formátovanie v jednom jazyku ---------- */
export function site(lang: Lang) {
  const msg = MSG[lang];

  function m(key: string): Any {
    const o = OVR[lang]?.[key];
    if (o !== undefined) return o;
    let x: Any = msg;
    for (const part of key.match(/[^.[\]]+|\[\d+\]/g) ?? []) x = part.startsWith("[") ? x[+part.slice(1, -1)] : x[part];
    if (x === undefined) throw new Error(`Chýba text ${lang}:${key}`);
    return x;
  }

  function T<V>(s: V, c: V, e: V, d: V): V {
    return { sk: s, cz: c, en: e, de: d }[lang];
  }

  /** text -> React: Slinkee písmená {X}, {<X}, {X>}; slovo so Slinkee sa nezalomí; jednopísmenové predložky v SK a CZ držia so slovom */
  function fmt(t: string): ReactNode {
    if (lang === "sk" || lang === "cz") t = t.replace(/(?<![^\s(])([aAiIoOuUvVsSzZkK]) /g, "$1 ");
    t = t.replace(/\bEN (\d)/g, "EN $1");
    const out: ReactNode[] = [];
    t.split(" ").forEach((tok, i) => {
      if (i) out.push(" ");
      out.push(<Fragment key={i}>{word(tok)}</Fragment>);
    });
    return out;
  }

  function word(tok: string): ReactNode {
    const RE = /\{(<?)([^{}<>])(>?)\}/g;
    const lines = (s: string, k: string): ReactNode[] =>
      s.split("\n").flatMap((p, j) => (j ? [<br key={k + "b" + j} />, p] : [p]));
    if (!RE.test(tok)) return lines(tok, "t");
    RE.lastIndex = 0;
    const parts: ReactNode[] = [];
    let last = 0, k = 0;
    for (const mo of tok.matchAll(RE)) {
      const i = mo.index ?? 0;
      if (i > last) parts.push(...lines(tok.slice(last, i), "p" + k));
      const cls = "sl" + (mo[1] ? " sl--loose-left" : "") + (mo[3] ? " sl--loose-right" : "");
      parts.push(<span className={cls} key={"s" + k++}>{mo[2]}</span>);
      last = i + mo[0].length;
    }
    if (last < tok.length) parts.push(...lines(tok.slice(last), "e"));
    return <span className="w">{parts}</span>;
  }

  const P = (page: PageKey, q = "") => href(lang, page, q);
  const AR = <span className="ar" aria-hidden="true">→</span>;

  function fig(src: string, alt: string, cls = "r43", wipe = true, eager = false) {
    const [w, h] = isize(src);
    const d = src.replace(".webp", "-d.webp");
    return (
      <figure className={`dp${wipe ? " wipe" : ""} ${cls}`} data-depth={exists(d) ? "/" + d : undefined}>
        <img src={"/" + src} alt={plain(alt)} width={w} height={h} loading={eager ? undefined : "lazy"} decoding="async" />
      </figure>
    );
  }

  const tel = () => <a className="tel" href={`tel:${m("common.phoneHref")}`}>{m("common.phone")}</a>;
  const btnDopyt = (co = "") => (
    <a className="btn btn--red" href={P("kontakt", co ? `?co=${co}` : "")}>{m("common.cta")} {AR}</a>
  );

  function secHd(eb: string, h: string, hid?: string, n?: string) {
    return (
      <div className="sec-hd">
        <p className="eb rv">{n && <><span className="n">{n}</span> </>}{fmt(eb)}</p>
        <h2 className="h h2" id={hid} data-split="">{fmt(h)}</h2>
      </div>
    );
  }

  function rows(items: (string | [string, string])[], short = false) {
    return (
      <ol className={`rows${short ? " rows--short" : ""}`}>
        {items.map((it, k) => {
          const [t, p] = typeof it === "string" ? [it, null] : it;
          return (
            <li className="row" key={k}>
              <span className="n">{String(k + 1).padStart(2, "0")}</span>
              <h3 className="h h3">{fmt(t)}</h3>
              {p && <p className="p">{fmt(p)}</p>}
            </li>
          );
        })}
      </ol>
    );
  }

  function faqBlock(items: QA[]) {
    return (
      <div className="faq-grid">
        <div className="faq">
          {items.map(([q, a], i) => (
            <details className="qa" key={i}>
              <summary><h3 className="h h3">{fmt(q)}</h3><i className="pm" aria-hidden="true" /></summary>
              <div className="a"><p className="p">{fmt(a)}</p></div>
            </details>
          ))}
        </div>
      </div>
    );
  }

  function faqSec(items: QA[], n?: string) {
    return (
      <section className="sec" aria-labelledby="faq-h">
        {secHd(m("o-nas.faq.eb"), m("o-nas.faq.h"), "faq-h", n)}
        {faqBlock(items)}
      </section>
    );
  }

  const F = (...idx: number[]): QA[] => idx.map((i) => [FAQ[lang][i].q, FAQ[lang][i].a]);

  function cta(co = "") {
    return (
      <section className="cta" aria-labelledby="cta-h">
        <h2 className="h" id="cta-h" data-split="">{fmt(m("cta.title"))}</h2>
        <p className="lead rv">{fmt(m("cta.lead"))}</p>
        <div className="acts rv" data-d=".1">
          {btnDopyt(co)}
          {tel()}
        </div>
      </section>
    );
  }

  const rzItem = (i: number) => m(`realizacie.items[${i}]`);

  function pcard(slug: string, cls = "r43") {
    const i = RZI[slug], it = rzItem(i);
    return (
      <a className="pc" href={P("realizacie") + "#" + slug} key={slug}>
        {fig(RZ[i][1], it.alt, cls)}
        <span className="pc-m rv"><span className="pc-pl">{fmt(it.p)} · {fmt(it.y)}</span><span className="pc-t">{fmt(it.t)}</span></span>
      </a>
    );
  }

  const pcards = (slugs: string[], c3 = false) => <div className={`pcards${c3 ? " c3" : ""}`}>{slugs.map((s) => pcard(s))}</div>;
  const more = (to: string, label: string) => <div className="sec-more rv"><a className="more" href={to}>{fmt(label)} {AR}</a></div>;

  return { lang, m, T, fmt, P, AR, fig, tel, btnDopyt, secHd, rows, faqBlock, faqSec, F, cta, rzItem, pcard, pcards, more };
}

export type Site = ReturnType<typeof site>;

/** text bez Slinkee značiek (titulky, alt, JSON-LD) */
export function plain(t: string) {
  return t.replace(/\{<?([^{}<>])>?\}/g, "$1");
}

/* ---------- realizácie (spoločné dáta) ---------- */
export const RZ: [string, string, string][] = [ // slug, obálka, skupina
  ["trnava", "img/projekt-04.webp", "nove"],
  ["dunajska-luzna", "img/projekt-07.webp", "prerabka"],
  ["klatovy", "rz/klatovy/02.webp", "obnova"],
  ["samorin", "img/projekt-02.webp", "nove"],
  ["hlohovec", "img/projekt-10.webp", "prerabka"],
  ["pezinok", "img/projekt-05.webp", "nove"],
  ["kraluv-dvur", "img/projekt-01.webp", "prerabka"],
  ["karvina-stena", "img/projekt-11.webp", "obnova"],
  ["karvina-tubing", "img/projekt-12.webp", "obnova"],
  ["praha", "img/projekt-08.webp", "prerabka"],
  ["uhersky-brod", "img/projekt-09.webp", "obnova"],
  ["oravice", "rz/oravice/07.webp", "nove"],
];
export const RZI: Record<string, number> = Object.fromEntries(RZ.map(([s], i) => [s, i]));
