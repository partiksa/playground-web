import Shell from "@/components/Shell";
import { toLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { site, type QA } from "@/lib/v9";

type P = { params: Promise<{ lang: string }> };
export const generateMetadata = ({ params }: P) => pageMetadata(params, "nafukovacie-atrakcie");

/* Fotky a údaje zo starého webu play-ground.sk (Prenájom atrakcií, Prečo atrakcie od nás). */
export default async function Nafukovacie({ params }: P) {
  const s = site(toLang((await params).lang));
  const { m, T, fmt, P, fig, tel, secHd, rows, faqSec, cta } = s;
  const K = "nafukovacie-atrakcie";
  const dopyt = P("kontakt", "?co=nafukovacie");

  // [fotka, názov, krátky údaj]
  const items: [string, string, string][] = [
    ["drak", T("Kombo Drak", "Kombo Drak", "Dragon Combo", "Kombi Drache"), T("5,5 × 5 m · 230 V", "5,5 × 5 m · 230 V", "5.5 × 5 m · 230 V", "5,5 × 5 m · 230 V")],
    ["palmy", T("Hrad Palmy", "Hrad Palmy", "Palm Castle", "Burg Palmen"), T("3,5 × 3,5 m · 230 V", "3,5 × 3,5 m · 230 V", "3.5 × 3.5 m · 230 V", "3,5 × 3,5 m · 230 V")],
    ["vlak", T("Prekážková dráha Vlak", "Překážková dráha Vlak", "Train Obstacle Course", "Hindernisbahn Zug"), T("12 × 4 m · 230 V", "12 × 4 m · 230 V", "12 × 4 m · 230 V", "12 × 4 m · 230 V")],
    ["piratska", T("Kombo Pirátska loď", "Kombo Pirátská loď", "Pirate Ship Combo", "Kombi Piratenschiff"), T("Skákacia plocha a šmykľavka", "Skákací plocha a skluzavka", "Bouncing area and slide", "Hüpffläche und Rutsche")],
    ["safari", T("Kombo Safari Jeep", "Kombo Safari Jeep", "Safari Jeep Combo", "Kombi Safari-Jeep"), T("Šmykľavka, hrad a prekážky", "Skluzavka, hrad a překážky", "Slide, castle and obstacles", "Rutsche, Burg und Hindernisse")],
    ["chobotnica", T("Kombo Chobotnica", "Kombo Chobotnice", "Octopus Combo", "Kombi Krake"), T("Prekážky a šmykľavka", "Překážky a skluzavka", "Obstacles and slide", "Hindernisse und Rutsche")],
    ["dzungla", T("Kombo Džungľa", "Kombo Džungle", "Jungle Combo", "Kombi Dschungel"), T("Menšia, vojde sa do záhrady", "Menší, vejde se do zahrady", "Compact, fits most gardens", "Kompakt, passt in fast jeden Garten")],
    ["dino", T("Dino šmykľavka", "Dino skluzavka", "Dino Slide", "Dino-Rutsche"), T("Veľká, aj pre väčšie deti", "Velká, i pro větší děti", "Large, also for older kids", "Groß, auch für ältere Kinder")],
    ["klasik", T("Šmykľavka Klasik", "Skluzavka Klasik", "Classic Slide", "Rutsche Klassik"), T("Stredná, pre všetky deti", "Střední, pro všechny děti", "Medium, for kids of all ages", "Mittelgroß, für alle Kinder")],
    ["gladiator", T("Gladiátor aréna", "Gladiátor aréna", "Gladiator Arena", "Gladiator-Arena"), T("Súboj dvoch hráčov", "Souboj dvou hráčů", "Duel for two players", "Duell für zwei Spieler")],
    ["tvar", T("Maľovanie na tvár", "Malování na obličej", "Face painting", "Kinderschminken"), T("Jedna alebo dve maliarky", "Jedna nebo dvě malířky", "One or two face painters", "Ein oder zwei Schminkerinnen")],
  ];

  const sale: [string, string][] = [
    [T("Hrubé PVC Tarpaulin", "Silné PVC Tarpaulin", "Heavy PVC tarpaulin", "Robuste PVC-Plane"),
      T("Hrúbka 0,55 až 0,60 mm, hustota 1 000 g/m². Materiál je pevný v ťahu, nepremokavý, odolný voči UV žiareniu a ošetrený proti horeniu.",
        "Tloušťka 0,55 až 0,60 mm, hustota 1 000 g/m². Materiál je pevný v tahu, nepromokavý, odolný vůči UV záření a ošetřený proti hoření.",
        "0.55 to 0.60 mm thick, 1,000 g/m². The material is tear-resistant, waterproof, UV-resistant and treated against fire.",
        "0,55 bis 0,60 mm stark, 1.000 g/m². Das Material ist reißfest, wasserdicht, UV-beständig und schwer entflammbar ausgerüstet.")],
    [T("3 roky záruky", "3 roky záruky", "3-year warranty", "3 Jahre Garantie"),
      T("Na nafukovadlá dávame záruku 3 roky. Robíme záručný aj pozáručný servis.",
        "Na nafukovadla dáváme záruku 3 roky. Děláme záruční i pozáruční servis.",
        "Our inflatables come with a 3-year warranty, with service during and after the warranty period.",
        "Auf unsere Hüpfburgen geben wir 3 Jahre Garantie, mit Service während und nach der Garantiezeit.")],
    [T("Certifikáty", "Certifikáty", "Certificates", "Zertifikate"),
      T("Ku každému nafukovadlu dostanete kópie certifikátov TÜV, CE, SGS a DIN.",
        "Ke každému nafukovadlu dostanete kopie certifikátů TÜV, CE, SGS a DIN.",
        "Every inflatable comes with copies of its TÜV, CE, SGS and DIN certificates.",
        "Zu jeder Hüpfburg erhalten Sie Kopien der Zertifikate TÜV, CE, SGS und DIN.")],
    [T("Výroba na zákazku", "Výroba na zakázku", "Made to order", "Anfertigung nach Maß"),
      T("Nafukovadlo navrhneme podľa vašich požiadaviek: tvar, farby aj logo. Robíme hrady, šmykľavky, kombá, labyrinty, športové a reklamné atrakcie.",
        "Nafukovadlo navrhneme podle vašich požadavků: tvar, barvy i logo. Děláme hrady, skluzavky, komba, labyrinty, sportovní a reklamní atrakce.",
        "We design the inflatable to your brief: shape, colours and logo. We make castles, slides, combos, mazes, sports and promotional inflatables.",
        "Wir entwerfen die Hüpfburg nach Ihren Wünschen: Form, Farben und Logo. Wir fertigen Burgen, Rutschen, Kombis, Labyrinthe, Sport- und Werbeattraktionen.")],
  ];

  const faq: QA[] = [
    [T("Čo je v cene prenájmu?", "Co je v ceně pronájmu?", "What does the rental price include?", "Was ist im Mietpreis enthalten?"),
      T("V cene je obsluha atrakcie. Doprava v cene nie je, dohodneme ju podľa miesta akcie.",
        "V ceně je obsluha atrakce. Doprava v ceně není, domluvíme ji podle místa akce.",
        "The price includes an operator for the attraction. Transport is not included; we agree it based on the event location.",
        "Im Preis ist die Betreuung der Attraktion enthalten. Der Transport ist nicht inbegriffen, wir vereinbaren ihn je nach Veranstaltungsort.")],
    [T("Čo potrebujem na mieste?", "Co potřebuji na místě?", "What do I need on site?", "Was brauche ich vor Ort?"),
      T("Rovnú plochu podľa rozmerov atrakcie a zásuvku 230 V. Rozmery nájdete pri atrakcii, pri ostatných vám ich povieme.",
        "Rovnou plochu podle rozměrů atrakce a zásuvku 230 V. Rozměry najdete u atrakce, u ostatních vám je řekneme.",
        "A flat area matching the size of the attraction and a 230 V socket. Sizes are listed with each attraction; for the others, just ask.",
        "Eine ebene Fläche passend zur Größe der Attraktion und eine 230-V-Steckdose. Die Maße stehen bei der Attraktion, bei den anderen nennen wir sie Ihnen.")],
    [T("Dá sa atrakcia aj kúpiť?", "Dá se atrakce i koupit?", "Can I buy an attraction?", "Kann ich eine Attraktion auch kaufen?"),
      T("Áno. Predávame nafukovadlá z PVC Tarpaulin s 3-ročnou zárukou a vyrobíme aj atrakciu na zákazku.",
        "Ano. Prodáváme nafukovadla z PVC Tarpaulin se zárukou 3 roky a vyrobíme i atrakci na zakázku.",
        "Yes. We sell PVC tarpaulin inflatables with a 3-year warranty and also build attractions to order.",
        "Ja. Wir verkaufen Hüpfburgen aus PVC-Plane mit 3 Jahren Garantie und fertigen auch Attraktionen nach Maß.")],
  ];

  return (
    <Shell s={s} page={K} faq={faq}>
      <section className="ph">
        <h1 className="ph-h1">
          <span className="eb rv" data-now="">{fmt(m(`${K}.eb`))}</span>
          {" "}
          <span className="h h1" data-split="now">{fmt(m(`${K}.h1`))}</span>
        </h1>
        <p className="lead rv" data-now="" data-d=".15">{fmt(m(`${K}.lead`))}</p>
        <div className="acts rv" data-now="" data-d=".25">
          <a className="btn btn--red" href={dopyt}>{fmt(m(`${K}.button`))} <span className="ar" aria-hidden="true">→</span></a>
          {tel()}
        </div>
      </section>

      <section className="sec">
        <div className="full">{fig("img/naf-hlavna.webp", m(`${K}.alt`), "r21", true, true)}</div>
        <p className="cap rv">{fmt(m(`${K}.cap`))}</p>
      </section>

      <section className="sec">
        {secHd(T("Prenájom", "Pronájem", "Rental", "Vermietung"), T("Atrakcie na {P}renájom", "Atrakce k {P}ronájmu", "Attractions for {R}ent", "Attraktionen zur {M}iete"), undefined, "01")}
        <p className="p rv" style={{ marginBottom: "clamp(32px,4vw,56px)", maxWidth: "52ch" }}>
          {fmt(T("V cene prenájmu je obsluha. Dopravu dohodneme podľa miesta akcie.",
            "V ceně pronájmu je obsluha. Dopravu domluvíme podle místa akce.",
            "The rental price includes an operator. We agree transport based on the event location.",
            "Im Mietpreis ist die Betreuung enthalten. Den Transport vereinbaren wir je nach Veranstaltungsort."))}
        </p>
        <div className="pcards c3">
          {items.map(([img, t, d]) => (
            <a className="pc" href={dopyt} key={img}>
              {fig(`img/naf-${img}.webp`, t, "r43")}
              <span className="pc-m rv"><span className="pc-pl">{fmt(d)}</span><span className="pc-t">{fmt(t)}</span></span>
            </a>
          ))}
        </div>
      </section>

      <section className="sec">
        {secHd(T("Predaj", "Prodej", "Sale", "Verkauf"), T("Nafukovadlá na {K}úpu", "Nafukovadla ke {K}oupi", "Inflatables to {B}uy", "Hüpfburgen zum {K}auf"), undefined, "02")}
        {rows(sale)}
      </section>

      {faqSec(faq, "03")}
      {cta("nafukovacie")}
    </Shell>
  );
}
