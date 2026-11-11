import Shell from "@/components/Shell";
import { toLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { site } from "@/lib/v9";

type P = { params: Promise<{ lang: string }> };
export const generateMetadata = ({ params }: P) => pageMetadata(params, "o-nas");

export default async function ONas({ params }: P) {
  const s = site(toLang((await params).lang));
  const { m, T, fmt, P, fig, secHd, rows, more, cta } = s;

  const st = [0, 1, 2].map((i) => m(`o-nas.stats[${i}]`));
  const diff = [0, 1, 2, 3].map((i) => [m(`o-nas.diff.rows[${i}].t`), m(`o-nas.diff.rows[${i}].p`)] as [string, string]);
  const countries = T(["Slovensko", "Česko", "Francúzsko", "Taliansko", "Estónsko", "Rumunsko"],
    ["Slovensko", "Česko", "Francie", "Itálie", "Estonsko", "Rumunsko"],
    ["Slovakia", "Czechia", "France", "Italy", "Estonia", "Romania"],
    ["Slowakei", "Tschechien", "Frankreich", "Italien", "Estland", "Rumänien"]);
  const alts = [0, 1, 2].map((i) => m(`o-nas.samorin.alts[${i}]`) as string);

  return (
    <Shell s={s} page="o-nas">
      <section className="ph">
        <p className="eb rv" data-now="">{fmt(m("o-nas.eb"))}</p>
        <h1 className="h h1" data-split="now">{fmt(m("o-nas.h1"))}</h1>
        <p className="lead rv" data-now="" data-d=".15">{fmt(m("o-nas.lead"))}</p>
        <ul className="stats" style={{ marginTop: "clamp(48px,6vw,96px)" }} aria-label={m("o-nas.statsLabel")}>
          {st.map((x, k) => (
            <li className="stat rv" data-d={(k * 0.08).toFixed(2)} key={k}>
              <b data-count={x.value} data-suf={x.suffix}>{x.value}{x.suffix}</b><span>{fmt(x.label)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="sec">
        <div className="full">{fig("img/samorin-5667.webp", m("o-nas.alt"), "r21")}</div>
      </section>

      <section className="sec">
        {secHd(m("o-nas.diff.eb"), m("o-nas.diff.h"))}
        {rows(diff)}
      </section>

      <section className="sec">
        {secHd(T("Kde pôsobíme", "Kde působíme", "Where we work", "Wo wir arbeiten"), T("Šesť {K}rajín", "Šest {Z}emí", "Six {C}ountries", "Sechs {L}änder"))}
        <div className="intro"><p className="lead rv">{fmt(T(
          "Sídlo máme v Trnave. Ihriská dovezieme a postavíme na Slovensku aj v zahraničí.",
          "Sídlo máme v Trnavě. Hřiště dovezeme a postavíme na Slovensku i v zahraničí.",
          "We are based in Trnava, Slovakia, and deliver and install playgrounds at home and abroad.",
          "Unser Sitz ist in Trnava, Slowakei. Spielplätze liefern und montieren wir im In- und Ausland."))}</p></div>
        <ul className="words">
          {countries.map((c) => <li key={c}><span>{c}</span></li>)}
        </ul>
      </section>

      <section className="sec">
        {secHd(m("o-nas.samorin.eb"), m("o-nas.samorin.h"))}
        <div className="sam">
          {fig("img/samorin-5671.webp", alts[0], "r34")}
          {fig("img/samorin-5679.webp", alts[1], "r34")}
          {fig("img/samorin-5684.webp", alts[2], "r34")}
        </div>
        {more(P("realizacie") + "#samorin", m("o-nas.samorin.more"))}
      </section>

      {cta()}
    </Shell>
  );
}
