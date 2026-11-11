import Shell from "@/components/Shell";
import { toLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { isize, listDir, plain, RZ, site } from "@/lib/v9";

type P = { params: Promise<{ lang: string }> };
export const generateMetadata = ({ params }: P) => pageMetadata(params, "realizacie");

/* fotky, ktoré sa v galérii nezobrazia (úzke panorámy, deti, montáž) */
const EXCLUDED: Record<string, string[]> = {
  hlohovec: ["01.webp", "06.webp"],
  "uhersky-brod": ["01.webp", "04.webp"],
  oravice: ["01.webp", "02.webp", "03.webp", "04.webp", "05.webp", "09.webp"],
  pezinok: ["09.webp"],
};

export default async function Realizacie({ params }: P) {
  const s = site(toLang((await params).lang));
  const { m, T, fmt, fig, cta, rzItem } = s;

  const flt: [string, string][] = [
    ["all", T("Všetko", "Vše", "All", "Alle")],
    ["nove", T("Nové ihriská", "Nová hřiště", "New playgrounds", "Neue Spielplätze")],
    ["prerabka", T("Prerábky a sťahovanie", "Přestavby a stěhování", "Rebuilds and relocations", "Umbauten und Umzüge")],
    ["obnova", T("Obnovy a doplnky", "Obnovy a doplňky", "Renovations and add-ons", "Renovierungen und Ergänzungen")],
  ];
  const data = RZ.map(([slug], i) => {
    const it = rzItem(i);
    const fs = listDir(`rz/${slug}`).filter((f) => f.endsWith(".webp") && !(EXCLUDED[slug] ?? []).includes(f)).sort();
    return { s: slug, t: plain(it.t), p: it.p, y: it.y, d: it.d, f: fs.map((f) => [f, ...isize(`rz/${slug}/${f}`)]) };
  });

  const after = (
    <div className="md" id="md" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="md-t" data-photo={m("realizacie.modal.photo")}>
      <div className="md-bar">
        <span className="n" />
        <span className="sp" />
        <button className="md-prev" type="button">{m("realizacie.modal.prev")}</button>
        <button className="md-next" type="button">{m("realizacie.modal.next")}</button>
        <button className="md-x" type="button">{m("realizacie.modal.close")}</button>
      </div>
      <div className="md-in">
        <div className="md-txt"><p className="eb" /><h2 className="h" id="md-t" /><p className="p" /></div>
        <div className="md-gw">
          <div className="md-gal" />
          <button className="hs-ar" type="button" aria-label={T("Ďalšia fotka", "Další fotka", "Next photo", "Nächstes Foto")}>{"\u2192"}</button>
        </div>
      </div>
    </div>
  );

  return (
    <Shell s={s} page="realizacie" after={after} data={"var RZ = " + JSON.stringify(data) + ";"} scripts={["/js/realizacie.js"]}>
      <section className="ph">
        <p className="eb rv" data-now="">{fmt(m("realizacie.eb"))}</p>
        <h1 className="h h1" data-split="now">{fmt(m("realizacie.h1"))}</h1>
        <p className="lead rv" data-now="" data-d=".15">{fmt(m("realizacie.lead"))}</p>
      </section>

      <section className="sec" aria-label={m("realizacie.listLabel")}>
        <ol className="rz-list">
          {RZ.slice(0, 6).map(([slug, img, g], i) => {
            const it = rzItem(i);
            const big = Math.floor(i / 2) % 2 === 0;
            const pos = (i % 2 === 0) === big ? "big" : "small";
            return (
              <li className={`rz ${pos}`} data-g={g} id={slug} key={slug}>
                <button className="rz-card" type="button" data-i={i} aria-haspopup="dialog">
                  {fig(img, it.alt, "r43")}
                  <span className="rz-meta">
                    <span className="n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="rz-t">{fmt(it.t)}</span>
                    <span className="rz-pl">{fmt(it.p)}<span className="rz-y">{fmt(it.y)}</span></span>
                    <span className="rz-d">{fmt(it.d)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {flt.slice(1).map(([g, t]) => (
        <section className="sec rz-cat" aria-label={t} key={g}>
          <div className="rz-cat-hd"><h2 className="h h3 rv">{t}</h2></div>
          <div className="hs">
            <ul className="hs-track">
              {RZ.map(([slug, img, gg], i) => gg !== g ? null : (
                <li className="hs-item" id={i >= 6 ? slug : undefined} key={slug}>
                  <button className="rz-card" type="button" data-i={i} aria-haspopup="dialog">
                    {fig(img, rzItem(i).alt, "r43", false)}
                    <span className="pc-m"><span className="pc-pl">{fmt(rzItem(i).p)} · {fmt(rzItem(i).y)}</span><span className="rz-t">{fmt(rzItem(i).t)}</span></span>
                  </button>
                </li>
              ))}
            </ul>
            <button className="hs-ar" type="button" aria-label={T("Posunúť", "Posunout", "Scroll", "Weiter")}>{"\u2192"}</button>
          </div>
        </section>
      ))}

      {cta()}
    </Shell>
  );
}
