import type { ReactNode } from "react";
import { SITE } from "@/lib/i18n";

export default function RootRedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sk">
      <head>
        <link rel="icon" href="/favicon.ico?v=3" sizes="48x48" />
        <link rel="icon" href="/favicon.svg?v=3" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3" />
        <meta httpEquiv="refresh" content="0; url=/sk/" />
        <link rel="canonical" href={SITE + "/sk/"} />
        <link rel="alternate" hrefLang="x-default" href={SITE + "/sk/"} />
        <link rel="alternate" hrefLang="sk" href={SITE + "/sk/"} />
        <link rel="alternate" hrefLang="cs" href={SITE + "/cz/"} />
        <link rel="alternate" hrefLang="en" href={SITE + "/en/"} />
        <link rel="alternate" hrefLang="de" href={SITE + "/de/"} />
        <script dangerouslySetInnerHTML={{ __html: 'location.replace("/sk/"+location.search+location.hash)' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
