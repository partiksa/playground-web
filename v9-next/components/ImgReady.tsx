"use client";

import { useEffect } from "react";

function mark(img: Element) {
  const fig = img.closest(".dp");
  if (fig) fig.classList.add("is-ld");
}

export default function ImgReady() {
  useEffect(() => {
    document.querySelectorAll<HTMLImageElement>(".dp img").forEach((img) => {
      if (img.complete) mark(img);
    });
    const onLoad = (e: Event) => {
      const t = e.target;
      if (t instanceof HTMLImageElement) mark(t);
    };
    document.addEventListener("load", onLoad, true);
    return () => document.removeEventListener("load", onLoad, true);
  }, []);
  return null;
}
