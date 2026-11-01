// prepis textu cez náhodné písmená, ktoré sa zľava ustália
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const UP = 'ABCDEFGHIJKLMNOPRSTUVZ', LOW = 'abcdefghijklmnoprstuvz', DIG = '0123456789';

export function scramble(el, text = el.textContent, dur = 620) {
  cancelAnimationFrame(el._raf);
  if (reduce) { el.textContent = text; return; }
  const len = text.length, t0 = performance.now();
  const at = Array.from({ length: len }, (_, i) => (0.12 + 0.55 * (i / len) + 0.33 * Math.random()) * dur);
  const pool = (c) => /[0-9]/.test(c) ? DIG : c === c.toUpperCase() && c !== c.toLowerCase() ? UP : LOW;
  const tick = (now) => {
    const e = now - t0; let out = '';
    for (let i = 0; i < len; i++) {
      const c = text[i];
      if (e >= at[i] || /[\s.,:()]/.test(c)) out += c;
      else { const p = pool(c); out += p[(Math.random() * p.length) | 0]; }
    }
    el.textContent = out;
    if (e < dur) el._raf = requestAnimationFrame(tick); else el.textContent = text;
  };
  el._raf = requestAnimationFrame(tick);
}

// podstránky: obrovské slovo a nadpisy sekcií, každý len raz pri prvom zobrazení
const els = [...document.querySelectorAll('.mega, .row h2, .prose h2')].filter((el) => !el.children.length);
const io = new IntersectionObserver((list) => list.forEach((x) => {
  if (!x.isIntersecting) return;
  io.unobserve(x.target);
  scramble(x.target, x.target.textContent, x.target.classList.contains('mega') ? 900 : 620);
}), { rootMargin: '0px 0px -15% 0px' });
els.forEach((el) => io.observe(el));
