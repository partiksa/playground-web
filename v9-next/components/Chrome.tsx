/* Hlavička, mobilné menu a pätička: rovnaké značky ako v9 (header() a footer() v build.py). */
import FooterBalls from "@/components/FooterBalls";
import { getDict, HREFLANG, href, LANGS, MENU, type Lang, type PageKey } from "@/lib/i18n";
import type { Site } from "@/lib/v9";

function LangSwitch({ s, page }: { s: Site; page: PageKey }) {
  return (
    <div className="lang" role="group" aria-label={s.m("common.langLabel")}>
      {LANGS.map((L) => {
        const c = getDict(L).common;
        return (
          <a key={L} href={href(L, page)} hrefLang={HREFLANG[L]} lang={HREFLANG[L]} title={c.langNames[L]}
            aria-current={L === s.lang ? "true" : undefined}>{c.langShort[L]}</a>
        );
      })}
    </div>
  );
}

export function Header({ s, page }: { s: Site; page: PageKey }) {
  const { m, fmt, P, tel } = s;
  return (
    <>
      <a className="skip" href="#main">{m("common.skip")}</a>
      <div className="ld" id="ld" aria-hidden="true"><div className="ld-bg" /><div className="ld-logo" /></div>

      <header className="hd js-hide" id="hd">
        <a className="logo" href={P("home")} aria-label={m("common.logoLabel")}><i /></a>
        <nav className="nav" aria-label={m("common.navLabel")}>
          <ul>
            {MENU.map((p) => <li key={p}><a href={P(p)} aria-current={p === page ? "page" : undefined}>{fmt(m(`common.nav.${p}`))}</a></li>)}
          </ul>
        </nav>
        {tel()}
        <LangSwitch s={s} page={page} />
        <a className="btn" href={P("kontakt")}>{m("common.cta")}</a>
        <button className="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="sheet" data-open={m("common.menu")} data-close={m("common.close")}>{m("common.menu")}</button>
      </header>

      <div className="sheet" id="sheet" aria-hidden="true">
        <ul>
          {MENU.map((p) => <li className="m-ln" key={p}><a href={P(p)} aria-current={p === page ? "page" : undefined}>{fmt(m(`common.nav.${p}`))}</a></li>)}
        </ul>
        <div className="meta">
          <a href={`tel:${m("common.phoneHref")}`}>{m("common.phone")}</a>
          <a href={`mailto:${m("common.email")}`}>{m("common.email")}</a>
          <LangSwitch s={s} page={page} />
        </div>
      </div>
    </>
  );
}

export function Footer({ s }: { s: Site }) {
  const { m, fmt, P } = s;
  return (
    <footer className="ft" id="ft">
      <div className="ft-top">
        <div>
          <a className="logo" href={P("home")} aria-label={m("common.logoLabel")}><i /></a>
          <p className="claim">{fmt(m("footer.claim"))}</p>
        </div>
        <div>
          <h2>{m("footer.contactTitle")}</h2>
          <ul>
            <li><a href={`tel:${m("common.phoneHref")}`}>{m("common.phone")}</a></li>
            <li><a href={`mailto:${m("common.email")}`}>{m("common.email")}</a></li>
            <li>{fmt(m("footer.address"))}</li>
          </ul>
        </div>
        <div>
          <h2>{m("footer.menuTitle")}</h2>
          <ul>{MENU.map((p) => <li key={p}><a href={P(p)}>{fmt(m(`common.nav.${p}`))}</a></li>)}</ul>
        </div>
        <div>
          <h2>{m("footer.companyTitle")}</h2>
          <ul>{(m("footer.company") as string[]).map((x) => <li key={x}>{fmt(x)}</li>)}</ul>
        </div>
      </div>
      <p className="ft-big" aria-hidden="true"><span className="ft-word">Play<span className="sl">G</span>round</span></p>
      <FooterBalls />
      <div className="ft-bot">
        <span>{m("footer.copyright")}</span>
        <span>{m("footer.place")}</span>
      </div>
    </footer>
  );
}

export type { Lang };
