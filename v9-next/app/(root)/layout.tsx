import type { ReactNode } from "react";

export default function RootRedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sk">
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="48x48" />
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <meta httpEquiv="refresh" content="0; url=/sk/" />
        <link rel="canonical" href="https://playground.sarkozypatrik.sk/sk/" />
        <link rel="alternate" hrefLang="x-default" href="https://playground.sarkozypatrik.sk/sk/" />
        <link rel="alternate" hrefLang="sk" href="https://playground.sarkozypatrik.sk/sk/" />
        <link rel="alternate" hrefLang="cs" href="https://playground.sarkozypatrik.sk/cz/" />
        <link rel="alternate" hrefLang="en" href="https://playground.sarkozypatrik.sk/en/" />
        <link rel="alternate" hrefLang="de" href="https://playground.sarkozypatrik.sk/de/" />
        <script dangerouslySetInnerHTML={{ __html: 'location.replace("/sk/"+location.search+location.hash)' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
