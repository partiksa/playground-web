import type { Metadata } from "next";
import { getDict, SITE } from "@/lib/i18n";

const t = getDict("sk");
export const metadata: Metadata = { metadataBase: new URL(SITE), title: t.root.title, robots: { index: false, follow: true } };

export default function RootPage() {
  return <p><a href="/sk/">{t.root.link}</a></p>;
}
