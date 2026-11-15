import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import "../extras.css";
import Cookies from "@/components/Cookies";
import ImgReady from "@/components/ImgReady";
import { jakarta, slinkee } from "@/lib/fonts";
import { HREFLANG, LANGS, SITE, toLang } from "@/lib/i18n";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "48x48" },
      { url: "/favicon.svg?v=3", type: "image/svg+xml" },
      { url: "/favicon.png?v=3", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png?v=3",
  },
};
export const viewport: Viewport = { themeColor: "#DEDDDB", width: "device-width", initialScale: 1 };

/* Pred prvým vykreslením: načítanie s logom len na úvode, vždy (aj po kliknutí na logo).
   Na podstránkach sa neukazuje. Ukáže sa aj pri zapnutom „Obmedziť pohyb“ (rozhodnutia Patrika 2026-11-11). */
/* Stráž triedy ld-on: ak Safari alebo jeho rozšírenie zmení HTML pred hydratáciou, React stránku vykreslí nanovo a triedy na <html> zmaže
   (chyba #418, loader potom len blikne). MutationObserver ju vráti ešte pred vykreslením; site.js stráž vypne (window.__pgLd = 0). */
const BOOT = `if(/^\\/(sk|cz|en|de)\\/?$/.test(location.pathname)){var h=document.documentElement;h.classList.add("ld-on");window.__pgLd=1;new MutationObserver(function(){if(window.__pgLd&&!h.classList.contains("ld-on"))h.classList.add("ld-on")}).observe(h,{attributes:true,attributeFilter:["class"]})}`;

export default async function LangLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const lang = toLang((await params).lang);
  return (
    <html lang={HREFLANG[lang]} data-root="/" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body className={`${jakarta.variable} ${slinkee.variable}`} suppressHydrationWarning>{children}<Cookies lang={lang} /><ImgReady /></body>
    </html>
  );
}
