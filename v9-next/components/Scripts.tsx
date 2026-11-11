"use client";
/* Spustí skripty stránky (tie isté ako vo v9) až po hydratácii Reactu, v presnom poradí.
   Skripty menia DOM (rozdelenie nadpisov, depth plátna), preto nesmú bežať pred hydratáciou. */
import { useEffect } from "react";

const BASE = ["/js/gsap.min.js", "/js/ScrollTrigger.min.js", "/js/SplitText.min.js", "/js/logo-write.js", "/js/site.js"];
let started = false;

function load(src: string, module = false) {
  return new Promise<void>((ok, bad) => {
    const s = document.createElement("script");
    if (module) s.type = "module";
    s.src = src;
    s.async = false;
    s.onload = () => ok();
    s.onerror = () => bad(new Error("Skript sa nenačítal: " + src));
    document.body.appendChild(s);
  });
}

export default function Scripts({ data, page = [], module }: { data?: string; page?: string[]; module?: string }) {
  useEffect(() => {
    if (started) return; // v režime vývoja React spúšťa efekt dvakrát
    started = true;
    (async () => {
      for (const src of BASE) await load(src);
      if (data) {
        const s = document.createElement("script");
        s.text = data;
        document.body.appendChild(s);
      }
      for (const src of page) await load(src);
      if (module) await load(module, true);
    })().catch((e) => console.error(e));
  }, [data, page, module]);
  return null;
}
