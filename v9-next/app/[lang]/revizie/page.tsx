import Shell from "@/components/Shell";
import { toLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { site, type QA } from "@/lib/v9";

type P = { params: Promise<{ lang: string }> };
export const generateMetadata = ({ params }: P) => pageMetadata(params, "revizie");

export default async function Revizie({ params }: P) {
  const s = site(toLang((await params).lang));
  const { m, T, fmt, P, AR, fig, tel, secHd, rows, faqSec, F, cta } = s;

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
  const faq = [...F(5), freq];

  return (
    <Shell s={s} page="revizie" faq={faq}>
      <section className="ph">
        <p className="eb rv" data-now="">{fmt(m("revizie.eb"))}</p>
        <h1 className="h h1" data-split="now">{fmt(m("revizie.h1"))}</h1>
        <p className="lead rv" data-now="" data-d=".15">{fmt(m("revizie.lead"))}</p>
        <div className="acts rv" data-now="" data-d=".25">
          <a className="btn btn--red" href={P("kontakt", "?co=reviza")}>{fmt(m("revizie.button"))} {AR}</a>
          {tel()}
        </div>
        <div className="full" style={{ marginTop: "clamp(48px,6vw,96px)" }}>{fig("img/revizie-kontrola-siete.webp", m("revizie.alt"), "r21")}</div>
        <p className="cap rv">{fmt(m("revizie.cap"))}</p>
      </section>

      <section className="sec">
        {secHd(T("Rozsah", "Rozsah", "Scope", "Umfang"), T("Čo {K}ontrolujeme", "Co {K}ontrolujeme", "What we {C}heck", "Was wir {P}rüfen"), undefined, "01")}
        {rows(scope, true)}
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
