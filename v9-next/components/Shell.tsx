/* Kostra stránky (port build() z v9/_build/build.py): hlavička, obsah, pätička, štruktúrované dáta, skripty. */
import type { ReactNode } from "react";
import { Footer, Header } from "@/components/Chrome";
import JsonLd from "@/components/JsonLd";
import Scripts from "@/components/Scripts";
import type { PageKey } from "@/lib/i18n";
import type { QA, Site } from "@/lib/v9";

type Props = {
  s: Site;
  page: PageKey;
  children: ReactNode;
  faq?: QA[];
  after?: ReactNode;      // prvky za <main> (napr. detail realizácie)
  data?: string;          // dáta pre skript stránky (var RZ = ..., var KT = ...)
  scripts?: string[];     // skripty stránky (po site.js)
  module?: string;        // ES modul (Prerábka 3D)
};

export default function Shell({ s, page, children, faq = [], after, data, scripts = [], module }: Props) {
  return (
    <>
      <Header s={s} page={page} />
      <main className={page === "home" ? undefined : "page"} id="main">{children}</main>
      {after}
      <Footer s={s} />
      <JsonLd s={s} page={page} faq={faq} />
      <Scripts data={data} page={scripts} module={module} />
    </>
  );
}
