import type { Metadata } from "next";
import Shell from "@/components/Shell";
import { GDPR } from "@/lib/gdpr";
import { HREFLANG, LANGS, SITE, toLang } from "@/lib/i18n";
import { site } from "@/lib/v9";

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const lang = toLang((await params).lang);
  const g = GDPR[lang];
  const url = `${SITE}/${lang}/ochrana-udajov/`;
  return {
    metadataBase: new URL(SITE),
    title: { absolute: g.title },
    description: g.description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(LANGS.map((l) => [HREFLANG[l], `${SITE}/${l}/ochrana-udajov/`])),
    },
    robots: { index: true, follow: true },
  };
}

export default async function OchranaUdajov({ params }: P) {
  const lang = toLang((await params).lang);
  const s = site(lang);
  const g = GDPR[lang];
  return (
    <Shell s={s} page="kontakt" path="ochrana-udajov">
      <section className="ph">
        <p className="eb rv" data-now="">{g.eb}</p>
        <h1 className="h h1" data-split="now">{g.h1}</h1>
        <p className="lead rv" data-now="" data-d=".15">{g.lead}</p>
        <p className="p rv" data-now="" data-d=".2" style={{ marginTop: "1em", opacity: 0.7 }}>{g.updated}</p>
      </section>
      {g.sections.map((sec) => (
        <section className="sec" key={sec.h}>
          <h2 className="h" style={{ fontSize: "clamp(1.4rem, 1rem + 1.4vw, 2.2rem)", marginBottom: "0.6em" }}>{sec.h}</h2>
          {sec.p.map((t) => <p className="p" key={t.slice(0, 40)}>{t}</p>)}
        </section>
      ))}
      <div style={{ height: "var(--sec)" }} />
    </Shell>
  );
}
