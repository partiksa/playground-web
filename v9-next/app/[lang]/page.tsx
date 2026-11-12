import { preload } from "react-dom";
import Shell from "@/components/Shell";
import { toLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { site } from "@/lib/v9";

type P = { params: Promise<{ lang: string }> };
export const generateMetadata = ({ params }: P) => pageMetadata(params, "home");

const CH: [number, number][] = [[0, 20], [22, 46], [48, 66], [68, 98], [100, 148], [156, 184]];

export default async function Home({ params }: P) {
  const s = site(toLang((await params).lang));
  preload("/kav/k000.webp", { as: "image", fetchPriority: "high" });
  const { m, T, fmt, P, fig, tel, btnDopyt, secHd, pcards, more, faqSec, F, cta, rzItem, why } = s;

  const svc: [Parameters<typeof P>[0], string, string, string, string][] = [
    ["ihriska", m("common.nav.ihriska"), T("Návrh, 3D vizualizácia, výroba a montáž na kľúč. Podľa noriem EN 1176 a EN 1177.",
      "Návrh, 3D vizualizace, výroba a montáž na klíč. Podle norem EN 1176 a EN 1177.",
      "Design, 3D visualization, manufacture and turnkey installation. To EN 1176 and EN 1177.",
      "Planung, 3D-Visualisierung, Fertigung und schlüsselfertige Montage. Nach EN 1176 und EN 1177."),
      "img/projekt-04.webp", rzItem(0).alt],
    ["prerabka", T("Prerábka a sťahovanie", "Přestavba a stěhování", "Rebuild and relocation", "Umbau und Umzug"), m("prerabka.lead"),
      "img/projekt-07.webp", rzItem(1).alt],
    ["revizie", T("Revízie a servis", "Revize a servis", "Inspections and service", "Prüfung und Service"),
      T("Ročné kontroly podľa EN 1176 a EN 1177, opravy a náhradné diely z vlastného skladu.",
        "Roční kontroly podle EN 1176 a EN 1177, opravy a náhradní díly z vlastního skladu.",
        "Annual inspections to EN 1176 and EN 1177, repairs and spare parts from our own stock.",
        "Jährliche Prüfungen nach EN 1176 und EN 1177, Reparaturen und Ersatzteile aus eigenem Lager."),
      "rz/klatovy/02.webp", rzItem(2).alt],
  ];
  const st = [0, 1, 2].map((i) => m(`o-nas.stats[${i}]`));
  const labels = [st[0].label, st[1].label, T("krajín", "zemí", "countries", "Länder")];
  const faq = F(0, 1, 3, 10);

  return (
    <Shell s={s} page="home" faq={faq} scripts={["/js/home.js"]}>
      <section className="story" id="story" aria-label={m("home.storyLabel")}>
        <div className="stage">
          <canvas id="cv" aria-hidden="true" />
          <div className="chapters">
            {CH.map(([a, b], k) => {
              const c = m(`home.chapters[${k}]`);
              const H = k === 0 ? "h1" : "h2";
              return (
                <article className="ch" data-from={a} data-to={b} key={k}>
                  <span className="bg" />
                  <span className="bd" aria-hidden="true"><i /><i /><i /><i /></span>
                  <div className="in">
                    <p className="eb">{k > 0 && <><span className="n">{String(k).padStart(2, "0")}</span> </>}{fmt(c.eb)}</p>
                    <H className="h">{fmt(c.h)}</H>
                    <p className="p">{fmt(c.p)}</p>
                    {(k === 0 || k === 5) && <div className="acts">{btnDopyt("nove")}{tel()}</div>}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="svc-h">
        {secHd(T("Čo robíme", "Co děláme", "What we do", "Was wir machen"),
          T("Nové, prerobené|aj {S}kontrolované", "Nová, přestavěná|i {Z}kontrolovaná", "New, rebuilt|and {C}hecked", "Neu, umgebaut|und {G}eprüft"), "svc-h")}
        <div className="intro"><p className="lead rv">{fmt(T(
          "PLAYGROUND z Trnavy navrhuje, vyrába a montuje interiérové detské ihriská na mieru pre rodinné centrá, kaviarne, hotely, škôlky a aquaparky. Staré ihriská prerábame a sťahujeme, hotové kontrolujeme a servisujeme.",
          "PLAYGROUND z Trnavy navrhuje, vyrábí a montuje interiérová dětská hřiště na míru pro rodinná centra, kavárny, hotely, školky a aquaparky. Stará hřiště přestavujeme a stěhujeme, hotová kontrolujeme a servisujeme.",
          "PLAYGROUND from Trnava, Slovakia, designs, manufactures and installs custom indoor playgrounds for family centers, cafés, hotels, preschools and water parks. We rebuild and relocate old playgrounds and inspect and service existing ones.",
          "PLAYGROUND aus Trnava (Slowakei) plant, fertigt und montiert Indoor-Spielplätze nach Maß für Familienzentren, Cafés, Hotels, Kindergärten und Aquaparks. Alte Spielplätze bauen wir um oder ziehen sie um, bestehende prüfen und warten wir."))}</p></div>
        <div className="svc">
          {svc.map(([p, t, d, img, alt], k) => (
            <a href={P(p)} key={p}>
              {fig(img, alt, "")}
              <span className="svc-m rv"><span className="n">{String(k + 1).padStart(2, "0")}</span>
                <span className="h h3">{fmt(t)}</span><span className="ar" aria-hidden="true">→</span><span className="p">{fmt(d)}</span></span>
            </a>
          ))}
        </div>
      </section>

      <section className="sec" aria-label={m("o-nas.statsLabel")}>
        <ul className="stats stg">
          {st.map((x, i) => (
            <li className="stat" key={i}><b data-count={x.value} data-suf={x.suffix}>{x.value}{x.suffix}</b><span>{fmt(labels[i])}</span></li>
          ))}
        </ul>
      </section>

      {why()}

      <section className="sec" aria-labelledby="rz-h">
        {secHd(m("common.nav.realizacie"), T("Postavené,|nie {N}akreslené", "Postavená,|ne {N}akreslená", "Built,|not just {D}rawn", "Gebaut,|nicht nur {G}ezeichnet"), "rz-h")}
        {pcards(["samorin", "hlohovec", "pezinok", "karvina-tubing"])}
        {more(P("realizacie"), m("o-nas.samorin.more"))}
      </section>

      {faqSec(faq)}
      {cta("nove")}
    </Shell>
  );
}
