"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

const KEY = "pg-cookies";
type Choice = "all" | "necessary";

declare global {
  interface Window {
    PG_COOKIES?: Choice;
  }
}

const T: Record<Lang, { label: string; text: string; all: string; nec: string }> = {
  sk: { label: "Cookies", text: "Používame nevyhnutné cookies, aby web fungoval. Ďalšie môžete povoliť.", all: "Prijať všetko", nec: "Len nevyhnutné" },
  cz: { label: "Cookies", text: "Používáme nezbytné cookies, aby web fungoval. Další můžete povolit.", all: "Přijmout vše", nec: "Jen nezbytné" },
  en: { label: "Cookies", text: "We use necessary cookies to keep the site working. You can allow more.", all: "Accept all", nec: "Necessary only" },
  de: { label: "Cookies", text: "Wir verwenden notwendige Cookies, damit die Website funktioniert. Weitere können Sie erlauben.", all: "Alle akzeptieren", nec: "Nur notwendige" },
};

export default function Cookies({ lang }: { lang: Lang }) {
  const [show, setShow] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    let v: string | null = null;
    try { v = localStorage.getItem(KEY); } catch {}
    if (v === "all" || v === "necessary") {
      window.PG_COOKIES = v;
      return;
    }
    // príde až po načítaní stránky (na úvode po loaderi)
    const wait = document.documentElement.classList.contains("ld-on") ? 4200 : 1400;
    const id = setTimeout(() => { setShow(true); requestAnimationFrame(() => requestAnimationFrame(() => setOn(true))); }, wait);
    return () => clearTimeout(id);
  }, []);

  function pick(c: Choice) {
    try { localStorage.setItem(KEY, c); } catch {}
    window.PG_COOKIES = c;
    setOn(false);
    setTimeout(() => setShow(false), 650);
  }

  if (!show) return null;
  const t = T[lang];
  return (
    <div className={`ck${on ? " is-on" : ""}`} role="region" aria-label={t.label}>
      <p className="ck-h">{t.label}</p>
      <p className="ck-t">{t.text}</p>
      <div className="ck-b">
        <button type="button" className="ck-btn ck-btn--main" onClick={() => pick("all")}>{t.all}</button>
        <button type="button" className="ck-btn" onClick={() => pick("necessary")}>{t.nec}</button>
      </div>
    </div>
  );
}
