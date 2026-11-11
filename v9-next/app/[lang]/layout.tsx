import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { jakarta, slinkee } from "@/lib/fonts";
import { HREFLANG, LANGS, SITE, toLang } from "@/lib/i18n";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.png", type: "image/png", sizes: "32x32" }],
    apple: "/apple-touch-icon.png",
  },
};
export const viewport: Viewport = { themeColor: "#DEDDDB", width: "device-width", initialScale: 1 };

/* Pred prvým vykreslením: načítanie s logom len pri prvej návšteve v relácii (ako v9). */
const BOOT = `try{if(!sessionStorage.getItem("pg-ld")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("ld-on")}catch(e){}`;

export default async function LangLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const lang = toLang((await params).lang);
  return (
    <html lang={HREFLANG[lang]} data-root="/" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body className={`${jakarta.variable} ${slinkee.variable}`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
