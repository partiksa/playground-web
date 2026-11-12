import Shell from "@/components/Shell";
import { toLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { site, type QA } from "@/lib/v9";

type P = { params: Promise<{ lang: string }> };
export const generateMetadata = ({ params }: P) => pageMetadata(params, "prerabka");

/* 3D štúdia (js/prerabka-3d.js) je ES modul s three.js z /vendor */
const IMAP = JSON.stringify({ imports: { three: "/vendor/build/three.module.js", "three/addons/": "/vendor/addons/" } });

export default async function Prerabka({ params }: P) {
  const s = site(toLang((await params).lang));
  const { m, T, fmt, P, fig, tel, btnDopyt, secHd, rows, pcards, more, faqSec, cta } = s;

  const at = ["0", ".16", ".40", ".60", ".84"];
  const when: [string, string][] = [
    [T("Konštrukcia je v poriadku", "Konstrukce je v pořádku", "The structure is sound", "Die Konstruktion ist in Ordnung"),
      T("Železo, spojky a moduly sú nepoškodené, opotrebované sú len obaly, siete alebo prvky.",
        "Železo, spojky a moduly jsou nepoškozené, opotřebované jsou jen obaly, sítě nebo prvky.",
        "The steel, connectors and modules are undamaged. Only the padding, nets or elements are worn.",
        "Stahl, Verbinder und Module sind unbeschädigt, abgenutzt sind nur Polster, Netze oder Elemente.")],
    [T("Ihrisko nespĺňa normy", "Hřiště nesplňuje normy", "The playground does not meet the standards", "Der Spielplatz erfüllt die Normen nicht"),
      T("Staré alebo nekvalitné ihrisko upravíme podľa aktuálnych noriem EN 1176 a EN 1177.",
        "Staré nebo nekvalitní hřiště upravíme podle aktuálních norem EN 1176 a EN 1177.",
        "We bring an old or low-quality playground up to the current EN 1176 and EN 1177 standards.",
        "Einen alten oder minderwertigen Spielplatz passen wir an die aktuellen Normen EN 1176 und EN 1177 an.")],
    [T("Chcete nový vzhľad", "Chcete nový vzhled", "You want a new look", "Sie wünschen ein neues Aussehen"),
      T("Nové farby, dizajn, lepšie využitie priestoru a nové atrakcie bez kúpy celého ihriska.",
        "Nové barvy, design, lepší využití prostoru a nové atrakce bez koupě celého hřiště.",
        "New colors, design, better use of space and new attractions without buying a whole new playground.",
        "Neue Farben, neues Design, bessere Raumnutzung und neue Attraktionen, ohne einen ganzen Spielplatz zu kaufen.")],
    [T("Sťahujete prevádzku", "Stěhujete provoz", "You are moving your venue", "Sie ziehen mit Ihrem Betrieb um"),
      T("Ihrisko rozoberieme, prevezieme a postavíme v novom priestore, aj s úpravou na nový rozmer.",
        "Hřiště rozebereme, převezeme a postavíme v novém prostoru, i s úpravou na nový rozměr.",
        "We dismantle, transport and rebuild the playground in the new space, adapted to the new dimensions if needed.",
        "Wir bauen den Spielplatz ab, transportieren ihn und bauen ihn am neuen Ort auf, bei Bedarf an die neuen Maße angepasst.")],
  ];
  const faq: QA[] = [
    [T("Oplatí sa prerobiť staré ihrisko?", "Vyplatí se přestavět staré hřiště?", "Is it worth rebuilding an old playground?", "Lohnt sich der Umbau eines alten Spielplatzes?"),
      T("Väčšinou áno. Použijeme pôvodnú konštrukciu, spojky a nepoškodené moduly, takže prerábka býva rýchlejšia a lacnejšia než nové ihrisko. Po obhliadke vám povieme, či sa oplatí.",
        "Většinou ano. Použijeme původní konstrukci, spojky a nepoškozené moduly, takže přestavba bývá rychlejší a levnější než nové hřiště. Po prohlídce vám řekneme, zda se vyplatí.",
        "Usually, yes. We reuse the original structure, joints and undamaged modules, so a rebuild is often faster and cheaper than a new playground. After an inspection we tell you whether it pays off.",
        "Meistens ja. Wir verwenden die ursprüngliche Konstruktion, Verbinder und intakte Module, daher ist ein Umbau oft schneller und günstiger als ein neuer Spielplatz. Nach einer Besichtigung sagen wir Ihnen, ob es sich lohnt.")],
    [T("Kedy sa oplatí prerobiť a nie kúpiť nové?", "Kdy se vyplatí přestavět a ne koupit nové?", "When is a rebuild better than buying new?", "Wann ist ein Umbau besser als ein Neukauf?"),
      T("Keď je nosná konštrukcia v dobrom stave a opotrebované sú len obaly, siete alebo prvky. Vtedy vymeníme, čo treba, zmeníme farby a doplníme nové atrakcie.",
        "Když je nosná konstrukce v dobrém stavu a opotřebované jsou jen obaly, sítě nebo prvky. Pak vyměníme, co je potřeba, změníme barvy a doplníme nové atrakce.",
        "When the load-bearing structure is in good condition and only the padding, nets or elements are worn. We then replace what is needed, change the colors and add new attractions.",
        "Wenn die Tragkonstruktion in gutem Zustand ist und nur Polster, Netze oder Elemente abgenutzt sind. Dann tauschen wir aus, was nötig ist, ändern die Farben und ergänzen neue Attraktionen.")],
    [T("Ako dlho trvá presťahovanie ihriska?", "Jak dlouho trvá přestěhování hřiště?", "How long does relocating a playground take?", "Wie lange dauert der Umzug eines Spielplatzes?"),
      T("Závisí od veľkosti ihriska. Menšie ihrisko presťahujeme za niekoľko dní, väčšie viacposchodové približne za jeden až dva týždne vrátane demontáže, prevozu a montáže. Presný termín uvedieme v ponuke.",
        "Záleží na velikosti hřiště. Menší hřiště přestěhujeme za několik dní, větší vícepatrové přibližně za jeden až dva týdny včetně demontáže, převozu a montáže. Přesný termín uvedeme v nabídce.",
        "It depends on the size. A smaller playground takes a few days, a larger multi-level one roughly one to two weeks including dismantling, transport and installation. We state the exact timing in our offer.",
        "Das hängt von der Größe ab. Einen kleineren Spielplatz ziehen wir in wenigen Tagen um, einen größeren mehrstöckigen in etwa ein bis zwei Wochen inklusive Abbau, Transport und Montage. Den genauen Termin nennen wir im Angebot.")],
    [T("Viete ihrisko prispôsobiť novému priestoru?", "Umíte hřiště přizpůsobit novému prostoru?", "Can you adapt the playground to a new space?", "Können Sie den Spielplatz an einen neuen Raum anpassen?"),
      T("Áno. Nový priestor zameriame a ihrisko upravíme na jeho rozmery: zmeníme dispozíciu, počet poschodí alebo doplníme prvky.",
        "Ano. Nový prostor zaměříme a hřiště upravíme na jeho rozměry: změníme dispozici, počet pater nebo doplníme prvky.",
        "Yes. We measure the new space and adapt the playground to it: a different layout, number of levels or added elements.",
        "Ja. Wir vermessen den neuen Raum und passen den Spielplatz an seine Maße an: andere Aufteilung, Anzahl der Ebenen oder zusätzliche Elemente.")],
  ];

  return (
    <Shell s={s} page="prerabka" faq={faq} module="/js/prerabka-3d.js">
      <script type="importmap" dangerouslySetInnerHTML={{ __html: IMAP }} />
      <section className="ph">
        <h1 className="ph-h1">
          <span className="eb rv" data-now="">{fmt(m("prerabka.eb"))}</span>
          {" "}
          <span className="h h1" data-split="now">{fmt(m("prerabka.h1"))}</span>
        </h1>
        <p className="lead rv" data-now="" data-d=".15">{fmt(m("prerabka.lead"))}</p>
        <div className="acts rv" data-now="" data-d=".25">
          {btnDopyt("prerabka")}
          {tel()}
        </div>
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
          {fig("img/prerabka-stahovanie.webp", m("prerabka.moving.alt"), "r43")}
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
