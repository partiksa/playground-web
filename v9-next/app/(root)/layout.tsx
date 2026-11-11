import type { ReactNode } from "react";

export default function RootRedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sk">
      <head>
        <meta httpEquiv="refresh" content="0; url=/sk/" />
        <link rel="canonical" href="https://play-ground.sk/sk/" />
        <link rel="alternate" hrefLang="x-default" href="https://play-ground.sk/sk/" />
        <link rel="alternate" hrefLang="sk" href="https://play-ground.sk/sk/" />
        <link rel="alternate" hrefLang="cs" href="https://play-ground.sk/cz/" />
        <link rel="alternate" hrefLang="en" href="https://play-ground.sk/en/" />
        <link rel="alternate" hrefLang="de" href="https://play-ground.sk/de/" />
        <script dangerouslySetInnerHTML={{ __html: 'location.replace("/sk/"+location.search+location.hash)' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
