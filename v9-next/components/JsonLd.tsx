/* Štruktúrované dáta (port jsonld() z v9/_build/build.py): firma, web, stránka, omrvinky, služba, časté otázky. */
import { getPageSeo, getSeo } from "@/lib/content";
import { absUrl, HREFLANG, LANGS, SITE, type PageKey } from "@/lib/i18n";
import { plain, type QA, type Site } from "@/lib/v9";

const SVC: Partial<Record<PageKey, number>> = { ihriska: 0, prerabka: 1, revizie: 2 };

export default function JsonLd({ s, page, faq }: { s: Site; page: PageKey; faq: QA[] }) {
  const { m, T, lang } = s;
  const base = SITE + "/";
  const org = getSeo(lang).organization as Record<string, string>;
  const oid = base + "#org";
  const { title, description } = getPageSeo(lang, page);
  const url = absUrl(lang, page);
  const areas = T(["Slovensko", "Česko", "Francúzsko", "Taliansko", "Estónsko", "Rumunsko"],
    ["Slovensko", "Česko", "Francie", "Itálie", "Estonsko", "Rumunsko"],
    ["Slovakia", "Czechia", "France", "Italy", "Estonia", "Romania"],
    ["Slowakei", "Tschechien", "Frankreich", "Italien", "Estland", "Rumänien"]);
  const graph: Record<string, unknown>[] = [
    {
      "@type": ["Organization", "LocalBusiness"], "@id": oid, name: org.name, url: base, logo: base + "logo.svg",
      image: base + "og.jpg", email: org.email, telephone: org.telephone, description: m("seo.orgDescription"),
      address: { "@type": "PostalAddress", streetAddress: "Poštová 6562/20", addressLocality: "Trnava", postalCode: "917 01", addressCountry: "SK" },
      areaServed: areas, vatID: "SK2023714429", taxID: "2023714429", identifier: "IČO 47051990",
    },
    { "@type": "WebSite", "@id": base + "#web", url: base, name: "PLAYGROUND", publisher: { "@id": oid }, inLanguage: LANGS.map((L) => HREFLANG[L]) },
    { "@type": "WebPage", "@id": url + "#page", url, name: title, description, inLanguage: HREFLANG[lang], isPartOf: { "@id": base + "#web" }, about: { "@id": oid } },
  ];
  if (page !== "home") {
    graph.push({
      "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: plain(m("common.nav.home")), item: absUrl(lang, "home") },
        { "@type": "ListItem", position: 2, name: plain(m(`common.nav.${page}`)), item: url },
      ],
    });
  }
  const si = SVC[page];
  if (si !== undefined) {
    const sv = m(`seo.services[${si}]`);
    graph.push({ "@type": "Service", name: sv.name, description: sv.description, provider: { "@id": oid }, areaServed: areas, url });
  }
  if (faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: plain(q), acceptedAnswer: { "@type": "Answer", text: plain(a) } })),
    });
  }
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
