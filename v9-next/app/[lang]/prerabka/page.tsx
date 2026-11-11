import Shell from "@/components/Shell";
import { toLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { site } from "@/lib/v9";

type P = { params: Promise<{ lang: string }> };
export const generateMetadata = ({ params }: P) => pageMetadata(params, "prerabka");

/* 3D štúdia (js/prerabka-3d.js) je ES modul s three.js z /vendor */
const IMAP = JSON.stringify({ imports: { three: "/vendor/build/three.module.js", "three/addons/": "/vendor/addons/" } });

export default async function Prerabka({ params }: P) {
  const s = site(toLang((await params).lang));
  const { m, T, fmt, P, fig, tel, btnDopyt, secHd, rows, pcards, more, faqSec, F, cta } = s;

  const at = ["0", ".16", ".40", ".60", ".84"];
  const when: [string, string][] = [
    [T("Konštrukcia je v poriadku", "Konstrukce je v pořádku", "The structure is sound", "Die Konstruktion ist in Ordnung"),
      T("Železo, spojky a moduly sú nepoškodené, opotrebované sú len obaly, siete alebo prvky.",
        "Železo, spojky a moduly jsou nepoškozené, opotřebované jsou jen obaly, sítě nebo prvky.",
        "The steel, connectors and modules are undamaged. Only the padding, nets or elements are worn.",
        "Stahl, Verbinder und Module sind unbeschädigt, abgenutzt sind nur Polster, Netze oder Elemente.")],
    [T("Ihrisko nespĺňa normy", "Hřiště nesplňuje normy", "The playground does not meet the standards", "Der Spielplatz erfüllt die Normen nicht"),
      T("Staré, najčastejšie čínske ihrisko upravíme podľa aktuálnych noriem EN 1176 a EN 1177.",
        "Staré, nejčastěji čínské hřiště upravíme podle aktuálních norem EN 1176 a EN 1177.",
        "We bring an old playground, most often a Chinese one, up to the current EN 1176 and EN 1177 standards.",
        "Einen alten, meist chinesischen Spielplatz passen wir an die aktuellen Normen EN 1176 und EN 1177 an.")],
    [T("Chcete nový vzhľad", "Chcete nový vzhled", "You want a new look", "Sie wünschen ein neues Aussehen"),
      T("Nové farby, dizajn, lepšie využitie priestoru a nové atrakcie bez kúpy celého ihriska.",
        "Nové barvy, design, lepší využití prostoru a nové atrakce bez koupě celého hřiště.",
        "New colours, design, better use of space and new attractions without buying a whole new playground.",
        "Neue Farben, neues Design, bessere Raumnutzung und neue Attraktionen, ohne einen ganzen Spielplatz zu kaufen.")],
    [T("Sťahujete prevádzku", "Stěhujete provoz", "You are moving your venue", "Sie ziehen mit Ihrem Betrieb um"),
      T("Ihrisko rozoberieme, prevezieme a postavíme v novom priestore, aj s úpravou na nový rozmer.",
        "Hřiště rozebereme, převezeme a postavíme v novém prostoru, i s úpravou na nový rozměr.",
        "We dismantle, transport and rebuild the playground in the new space, adapted to the new dimensions if needed.",
        "Wir bauen den Spielplatz ab, transportieren ihn und bauen ihn am neuen Ort auf, bei Bedarf an die neuen Maße angepasst.")],
  ];
  const faq = F(6, 7);

  return (
    <Shell s={s} page="prerabka" faq={faq} module="/js/prerabka-3d.js">
      <script type="importmap" dangerouslySetInnerHTML={{ __html: IMAP }} />
      <section className="ph">
        <p className="eb rv" data-now="">{fmt(m("prerabka.eb"))}</p>
        <h1 className="h h1" data-split="now">{fmt(m("prerabka.h1"))}</h1>
        <p className="lead rv" data-now="" data-d=".15">{fmt(m("prerabka.lead"))}</p>
        <div className="acts rv" data-now="" data-d=".25">
          {btnDopyt("prerabka")}
          {tel()}
        </div>
        <div className="full" style={{ marginTop: "clamp(48px,6vw,96px)" }}>{fig("img/projekt-07.webp", m("prerabka.alt"), "r21")}</div>
        <p className="cap rv">{fmt(m("prerabka.cap"))}</p>
      </section>

      <section className="sec">
        <div className="sec-hd">
          <p className="eb rv"><span className="n">01</span> {fmt(m("prerabka.process.eb"))}</p>
          <h2 className="h h2" data-split="">{fmt(m("prerabka.process.h"))}</h2>
          <p className="p rv p3d-lead">{fmt(m("prerabka.process.p"))}</p>
        </div>
        <div className="p3d">
          <div className="p3d-stage">
            <ol className="p3d-steps">
              {at.map((a, k) => (
                <li data-at={a} key={k}><span className="n">{String(k + 1).padStart(2, "0")}</span> {fmt(m(`prerabka.process.steps[${k}]`))}</li>
              ))}
            </ol>
            <figure className="p3d-visual">
              <div className="p3d-view" role="img" aria-label={m("prerabka.process.vizLabel")} />
              <figcaption className="cap">{fmt(m("prerabka.process.vizCap"))}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="sec two">
        <div>
          <p className="eb rv"><span className="n">02</span> {fmt(m("prerabka.rebuild.eb"))}</p>
          <h2 className="h h3 rv">{fmt(m("prerabka.rebuild.h"))}</h2>
          <p className="p rv">{fmt(m("prerabka.rebuild.p"))}</p>
          <ul className="ul stg">
            {[0, 1, 2, 3, 4].map((i) => <li key={i}>{fmt(m(`prerabka.rebuild.list[${i}]`))}</li>)}
          </ul>
        </div>
        <div>
          <p className="eb rv"><span className="n">03</span> {fmt(m("prerabka.moving.eb"))}</p>
          <h2 className="h h3 rv">{fmt(m("prerabka.moving.h"))}</h2>
          <p className="p rv">{fmt(m("prerabka.moving.p"))}</p>
          {fig("img/projekt-10.webp", m("prerabka.moving.alt"), "r169")}
          <p className="cap rv">{fmt(m("prerabka.moving.cap"))}</p>
        </div>
      </section>

      <section className="sec">
        {secHd(T("Kedy sa oplatí", "Kdy se vyplatí", "When it pays off", "Wann es sich lohnt"),
          T("Prerábka má {Z}mysel, keď", "Přestavba dává {S}mysl, když", "A rebuild makes {S}ense when", "Ein Umbau lohnt {S}ich, wenn"), undefined, "04")}
        {rows(when)}
      </section>

      <section className="sec">
        <div className="sec-hd say-hd">
          <p className="eb rv"><span className="n">05</span> {fmt(m("prerabka.why.eb"))}</p>
          <h2 className="h say" data-split="">{fmt(m("prerabka.why.h"))}</h2>
        </div>
      </section>

      <section className="sec sec--tight">
        {secHd(m("common.nav.realizacie"), T("Prerobené a {P}resťahované", "Přestavěná a {P}řestěhovaná", "Rebuilt and {R}elocated", "Umgebaut und {U}mgezogen"), undefined, "06")}
        {pcards(["dunajska-luzna", "hlohovec", "klatovy", "kraluv-dvur"])}
        {more(P("realizacie"), m("prerabka.why.more"))}
      </section>

      {faqSec(faq, "07")}
      {cta("prerabka")}
    </Shell>
  );
}
