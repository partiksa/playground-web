import { preload } from "react-dom";
import Shell from "@/components/Shell";
import { toLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { site } from "@/lib/v9";

type P = { params: Promise<{ lang: string }> };
export const generateMetadata = ({ params }: P) => pageMetadata(params, "ihriska");

export default async function Ihriska({ params }: P) {
  const s = site(toLang((await params).lang));
  const { m, T, fmt, P, AR, fig, btnDopyt, secHd, rows, pcards, more, faqSec, F, cta, why } = s;
  preload("/360/r12.webp", { as: "image" });

  const steps = [1, 2, 3, 4, 5].map((i) => m(`home.chapters[${i}].eb`) as string);
  const sp = [
    T("Zistíme, pre koho je ihrisko a čo od neho čakáte.", "Zjistíme, pro koho je hřiště a co od něj očekáváte.",
      "We find out who the playground is for and what you expect from it.", "Wir klären, für wen der Spielplatz ist und was Sie von ihm erwarten."),
    T("Presne zameriame plochu, výšku stropu, vstupy a okná.", "Přesně zaměříme plochu, výšku stropu, vstupy a okna.",
      "We precisely measure the floor area, ceiling height, entrances and windows.", "Wir vermessen Fläche, Deckenhöhe, Eingänge und Fenster genau."),
    T("Návrh, ktorý využije dostupný priestor a sedí na cieľovú skupinu.", "Návrh, který využije dostupný prostor a sedí cílové skupině.",
      "A design that makes use of the available space and suits the target group.", "Ein Entwurf, der den verfügbaren Raum nutzt und zur Zielgruppe passt."),
    T("Konštrukcia, obaly a herné prvky.", "Konstrukce, obaly a herní prvky.", "Structure, padding and play elements.", "Konstruktion, Polsterung und Spielelemente."),
    T("Ihrisko odovzdáme pripravené na okamžité používanie.", "Hřiště předáme připravené k okamžitému používání.",
      "We hand over the playground ready for immediate use.", "Wir übergeben den Spielplatz sofort betriebsbereit."),
  ];
  const els = [0, 1, 2, 3, 4, 5].map((i) => m(`ihriska.elements.items[${i}]`) as string);
  const places = [0, 1, 2, 3, 4].map((i) => [m(`ihriska.places.items[${i}].t`), m(`ihriska.places.items[${i}].p`)] as [string, string]);
  const faq = F(2, 4, 8, 9);

  return (
    <Shell s={s} page="ihriska" faq={faq} scripts={["/js/ihriska.js"]}>
      <section className="ph ph--ih">
        <h1 className="ph-h1">
          <span className="eb rv" data-now="">{fmt(m("ihriska.eb"))}</span>
          {" "}
          <span className="h h1" data-split="now">{fmt(m("ihriska.h1"))}</span>
        </h1>
        <div className="ih-top">
          <div className="txt">
            <p className="lead rv" data-now="" data-d=".15">{fmt(m("ihriska.lead"))}</p>
            <div className="acts rv" data-now="" data-d=".25">
              {btnDopyt("nove")}
              <a className="more" href="#vznik">{fmt(m("ihriska.more"))}</a>
            </div>
          </div>
          <figure className="v3d">
            <div className="v3d-in r169"><canvas role="img" aria-label={m("ihriska.vizLabel")} /></div>
            <figcaption className="cap">{fmt(m("ihriska.vizCap"))}</figcaption>
          </figure>
        </div>
      </section>

      <section className="sec grid">
        <div className="c-txt">
          <p className="eb rv"><span className="n">01</span> {fmt(m("ihriska.construction.eb"))}</p>
          <h2 className="h h2" data-split="">{fmt(m("ihriska.construction.h"))}</h2>
          <p className="p rv">{fmt(m("ihriska.construction.p[0]"))}</p>
          <p className="p rv">{fmt(m("ihriska.construction.p[1]"))}</p>
        </div>
        <div className="c-fig">{fig("img/ihriska-konstrukcia.webp", m("ihriska.construction.alt"), "r34")}</div>
      </section>

      <section className="sec">
        {secHd(T("Postup", "Postup", "Process", "Ablauf"), T("Päť krokov po {O}dovzdanie", "Pět kroků k {P}ředání", "Five steps to {H}andover", "Fünf Schritte bis zur Über{G}abe"), undefined, "02")}
        {rows(steps.map((t, i) => [t, sp[i]] as [string, string]))}
        {more("#vznik", m("ihriska.more"))}
      </section>

      <section className="sec">
        {secHd(m("ihriska.elements.eb"), m("ihriska.elements.h"), undefined, "03")}
        {rows(els, true, false)}
        <p className="p rv" style={{ marginTop: 24 }}>{fmt(m("ihriska.elements.note"))}</p>
        <div className="full" style={{ marginTop: "clamp(56px,7vw,112px)" }}>{fig("img/ihriska-prvky.webp", m("ihriska.elements.alt"), "r21")}</div>
      </section>

      <section className="sec">
        {secHd(m("ihriska.places.eb"), m("ihriska.places.h"), undefined, "04")}
        {rows(places)}
      </section>

      <section className="sec grid flip">
        <div className="c-txt">
          <p className="eb rv"><span className="n">05</span> {fmt(m("ihriska.material.eb"))}</p>
          <h2 className="h h2" data-split="">{fmt(m("ihriska.material.h"))}</h2>
          <p className="p rv">{fmt(m("ihriska.material.p[0]"))}</p>
          <p className="p rv">{fmt(m("ihriska.material.p[1]"))}</p>
          <div className="acts rv">
            <a className="more" href={P("revizie")}>{fmt(m("ihriska.material.linkRevizie"))} {AR}</a>
            <a className="more" href={P("realizacie")}>{fmt(m("ihriska.material.linkRealizacie"))} {AR}</a>
          </div>
        </div>
        <div className="c-fig">{fig("img/ihriska-sklad.webp", m("ihriska.material.alt"), "r34")}</div>
      </section>

      {why("06")}

      <section className="sec">
        {secHd(m("common.nav.realizacie"), T("Nové ihriská z {P}raxe", "Nová hřiště z {P}raxe", "New playgrounds in {P}ractice", "Neue Spielplätze aus der {P}raxis"), undefined, "07")}
        {pcards(["trnava", "samorin", "oravice"], true)}
        {more(P("realizacie"), m("o-nas.samorin.more"))}
      </section>

      <section className="sec" id="vznik" aria-labelledby="vznik-h">
        {secHd(T("Montáž", "Montáž", "Installation", "Montage"), m("ihriska.more"), "vznik-h", "08")}
        <div className="full vznik">
          <video src="/video/stavba.mp4" poster="/video/stavba.webp" muted playsInline loop preload="none" data-autoplay=""
            aria-label={T("3D render stavby vesmírneho ihriska v prázdnej hale", "3D render stavby vesmírného hřiště v prázdné hale", "3D render of the space playground being built in an empty hall", "3D-Render: Aufbau des Weltraum-Spielplatzes in einer leeren Halle")} />
        </div>
      </section>

      {faqSec(faq, "09")}
      {cta("nove")}
    </Shell>
  );
}
