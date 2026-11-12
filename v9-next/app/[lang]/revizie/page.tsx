import Shell from "@/components/Shell";
import { toLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { site, type QA } from "@/lib/v9";

type P = { params: Promise<{ lang: string }> };
export const generateMetadata = ({ params }: P) => pageMetadata(params, "revizie");

export default async function Revizie({ params }: P) {
  const s = site(toLang((await params).lang));
  const { m, T, fmt, P, AR, fig, tel, secHd, rows, faqSec, cta } = s;

  const scope = [
    T("Nosná konštrukcia a spoje", "Nosná konstrukce a spoje", "Load-bearing structure and joints", "Tragkonstruktion und Verbindungen"),
    T("Siete a ich uchytenie", "Sítě a jejich uchycení", "Nets and their fixings", "Netze und ihre Befestigung"),
    T("Penové obaly a vinyl", "Pěnové obaly a vinyl", "Foam padding and vinyl", "Schaumstoffpolster und Vinyl"),
    T("Šmykľavky a herné prvky", "Skluzavky a herní prvky", "Slides and play elements", "Rutschen und Spielelemente"),
    T("Dopadové plochy podľa EN 1177", "Dopadové plochy podle EN 1177", "Impact surfaces to EN 1177", "Fallschutzflächen nach EN 1177"),
    T("Medzery, v ktorých by sa dieťa mohlo zachytiť", "Mezery, ve kterých by se dítě mohlo zachytit",
      "Gaps in which a child could get trapped", "Spalten, in denen sich ein Kind verfangen könnte"),
  ];
  const flow: [string, string][] = [
    [T("Termín", "Termín", "Booking", "Termin"),
      T("Napíšte nám alebo zavolajte. Dohodneme termín kontroly.", "Napište nám nebo zavolejte. Domluvíme termín kontroly.",
        "Write or call us and we agree on a date for the inspection.", "Schreiben oder rufen Sie uns an, wir vereinbaren einen Prüftermin.")],
    [T("Kontrola na mieste", "Kontrola na místě", "On-site inspection", "Prüfung vor Ort"),
      T("Ihrisko posúdime podľa noriem EN 1176 a EN 1177.", "Hřiště posoudíme podle norem EN 1176 a EN 1177.",
        "We assess the playground to EN 1176 and EN 1177.", "Wir beurteilen den Spielplatz nach EN 1176 und EN 1177.")],
    [T("Oprava a diely", "Oprava a díly", "Repair and parts", "Reparatur und Teile"),
      T("Opravíme, čo treba, a vymeníme opotrebované diely. Diely máme na sklade.",
        "Opravíme, co je potřeba, a vyměníme opotřebované díly. Díly máme na skladě.",
        "We fix what is needed and replace worn parts. We keep parts in stock.",
        "Wir reparieren, was nötig ist, und tauschen abgenutzte Teile aus. Teile haben wir auf Lager.")],
  ];
  const freq: QA = [
    T("Ako často treba kontrolovať detské ihrisko?", "Jak často je třeba kontrolovat dětské hřiště?",
      "How often should a playground be inspected?", "Wie oft muss ein Spielplatz geprüft werden?"),
    T("Norma EN 1176-7 odporúča bežnú vizuálnu kontrolu prevádzkovateľom, prevádzkovú kontrolu raz za jeden až tri mesiace a hlavnú kontrolu raz ročne. Hlavnú ročnú kontrolu a servis robíme my.",
      "Norma EN 1176-7 doporučuje běžnou vizuální kontrolu provozovatelem, provozní kontrolu jednou za jeden až tři měsíce a hlavní kontrolu jednou ročně. Hlavní roční kontrolu a servis děláme my.",
      "EN 1176-7 recommends routine visual checks by the operator, an operational inspection every one to three months and a main inspection once a year. We carry out the annual main inspection and service.",
      "Die EN 1176-7 empfiehlt regelmäßige Sichtkontrollen durch den Betreiber, eine operative Inspektion alle ein bis drei Monate und eine jährliche Hauptinspektion. Die jährliche Hauptinspektion und den Service übernehmen wir."),
  ];
  const faq: QA[] = [freq,
    [T("Ako dlho trvá revízia?", "Jak dlouho trvá revize?", "How long does an inspection take?", "Wie lange dauert eine Prüfung?"),
      T("Závisí od veľkosti ihriska. Menšie ihrisko skontrolujeme za niekoľko hodín, väčšie viacposchodové môže trvať celý deň. Čas dohodneme vopred, aby ste vedeli naplánovať prevádzku.",
        "Záleží na velikosti hřiště. Menší hřiště zkontrolujeme za několik hodin, větší vícepatrové může trvat celý den. Čas domluvíme předem, abyste mohli naplánovat provoz.",
        "It depends on the size. A smaller playground takes a few hours, a larger multi-level one can take a full day. We agree the time in advance so you can plan your opening hours.",
        "Das hängt von der Größe ab. Einen kleineren Spielplatz prüfen wir in einigen Stunden, ein größerer mehrstöckiger kann einen ganzen Tag dauern. Die Zeit vereinbaren wir vorab, damit Sie den Betrieb planen können.")],
    [T("Ak niečo nespĺňa normu, opravíte to?", "Když něco nesplňuje normu, opravíte to?", "If something does not meet the standard, will you fix it?", "Wenn etwas nicht der Norm entspricht, reparieren Sie es?"),
      T("Áno. V správe z revízie uvedieme, čo nesedí s normou, a navrhneme opravu. Bežné diely máme na sklade, takže veľa opráv urobíme hneď alebo pri ďalšej návšteve.",
        "Ano. Ve zprávě z revize uvedeme, co nesedí s normou, a navrhneme opravu. Běžné díly máme na skladě, takže mnoho oprav uděláme hned nebo při další návštěvě.",
        "Yes. The inspection report lists what does not meet the standard and proposes a repair. We keep common parts in stock, so many repairs are done on the spot or at the next visit.",
        "Ja. Im Prüfbericht führen wir auf, was nicht der Norm entspricht, und schlagen eine Reparatur vor. Gängige Teile haben wir auf Lager, viele Reparaturen erledigen wir sofort oder beim nächsten Besuch.")],
  ];

  return (
    <Shell s={s} page="revizie" faq={faq}>
      <section className="ph">
        <h1 className="ph-h1">
          <span className="eb rv" data-now="">{fmt(m("revizie.eb"))}</span>
          {" "}
          <span className="h h1" data-split="now">{fmt(m("revizie.h1"))}</span>
        </h1>
        <p className="lead rv" data-now="" data-d=".15">{fmt(m("revizie.lead"))}</p>
        <div className="acts rv" data-now="" data-d=".25">
          <a className="btn btn--red" href={P("kontakt", "?co=reviza")}>{fmt(m("revizie.button"))} {AR}</a>
          {tel()}
        </div>
      </section>

      <section className="sec">
        {secHd(T("Rozsah", "Rozsah", "Scope", "Umfang"), T("Čo {K}ontrolujeme", "Co {K}ontrolujeme", "What we {C}heck", "Was wir {P}rüfen"), undefined, "01")}
        {rows(scope, true)}
        <div className="full" style={{ marginTop: "clamp(56px,7vw,112px)" }}>{fig("img/revizie-kontrola-siete.webp", m("revizie.alt"), "r21")}</div>
        <p className="cap rv">{fmt(m("revizie.cap"))}</p>
      </section>

      <section className="sec">
        {secHd(T("Priebeh", "Průběh", "How it works", "Ablauf"), T("Od termínu po {O}pravu", "Od termínu po {O}pravu", "From booking to {R}epair", "Vom Termin zur {R}eparatur"), undefined, "02")}
        {rows(flow)}
      </section>

      {faqSec(faq, "03")}
      {cta("reviza")}
    </Shell>
  );
}
