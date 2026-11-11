import "./globals.css";
import "./extras.css";
import type { Metadata } from "next";
import { jakarta, slinkee } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "404 | PLAYGROUND",
  robots: { index: false },
};

const TXT = {
  sk: { t: "Stránka sa nenašla.", a: "Na úvod" },
  cz: { t: "Stránka nebyla nalezena.", a: "Na úvod" },
  en: { t: "Page not found.", a: "Home" },
  de: { t: "Seite nicht gefunden.", a: "Startseite" },
} as const;
const ORDER = ["sk", "cz", "en", "de"] as const;

/* Jazyk z URL: zobrazí sa len text pre daný jazyk, inak slovenčina. */
const PICK = `(function(){var m=location.pathname.match(/^\\/(sk|cz|en|de)(\\/|$)/),l=m?m[1]:"sk";document.documentElement.lang=l==="cz"?"cs":l;document.querySelectorAll("[data-l]").forEach(function(e){e.hidden=e.getAttribute("data-l")!==l})})()`;

export default function GlobalNotFound() {
  return (
    <html lang="sk" data-root="/">
      <body className={`${jakarta.variable} ${slinkee.variable}`}>
        <main className="nf">
          <a className="logo" href="/sk/" aria-label="PLAYGROUND"><i /></a>
          <h1>404</h1>
          {ORDER.map((l) => (
            <p key={l} data-l={l} hidden={l !== "sk"}>{TXT[l].t}</p>
          ))}
          <div className="nf-l">
            {ORDER.map((l) => (
              <a key={l} data-l={l} hidden={l !== "sk"} className="btn btn--red" href={`/${l}/`}>{TXT[l].a}</a>
            ))}
          </div>
          <nav className="nf-l" aria-label="Language">
            {ORDER.map((l) => (
              <a key={l} className="btn" href={`/${l}/`}>{l.toUpperCase()}</a>
            ))}
          </nav>
          <script dangerouslySetInnerHTML={{ __html: PICK }} />
        </main>
      </body>
    </html>
  );
}
