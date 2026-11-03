// Logo sa píše čiarou: maska po stredovej čiare odkrýva pôvodný tvar loga.
import D from './writing.js';

const NS = 'http://www.w3.org/2000/svg';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let uid = 0;
const el = (tag, at = {}) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); return e; };

// logo, ktoré sa píše (úvod)
export function logo(host) {
  const v = D._logo, id = `w${++uid}`;
  const svg = el('svg', { viewBox: `0 0 ${v.w} ${v.h}`, class: 'logo-svg', 'aria-hidden': 'true' });
  const m = el('mask', { id, maskUnits: 'userSpaceOnUse', x: -20, y: -20, width: v.w + 40, height: v.h + 40 });
  // v SVG loga je podčiarknutie zvlášť (cesty 0 až 4, rozdelené slučkami y a g), písmená sú cesty 5 a 6.
  // Písmená odkrýva maska po stredovej čiare, podčiarknutie vlastná maska zľava doprava.
  const n = v.s.length - 1, U = 5; // posledný ťah v dátach je podčiarknutie, tu sa nepoužíva
  const ps = v.s.slice(0, n).map((d, i) => { const p = el('path', { d, fill: 'none', stroke: '#fff', 'stroke-width': v.mw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }); p.style.strokeDasharray = `${v.l[i] + 1} ${v.l[i] * 3 + 20}`; /* dlhá medzera: žiadne bodky pred začiatkom */ p.style.strokeDashoffset = v.l[i] + 1; m.append(p); return p; });
  const um = el('mask', { id: id + 'u', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: v.w, height: v.h });
  const bar = el('rect', { x: 40, y: 95, width: 260, height: 40, fill: '#fff' });
  bar.style.transformOrigin = '40px 0'; bar.style.transform = 'scaleX(0)';
  um.append(bar);
  svg.append(m, um,
    el('path', { d: v.d.slice(U).join(' '), fill: 'currentColor', mask: `url(#${id})` }),
    el('path', { d: v.d.slice(0, U).join(' '), fill: 'currentColor', mask: `url(#${id}u)` }));
  host.append(svg);
  return (T = 1500) => {
    if (reduce) { ps.forEach((p) => { p.style.strokeDashoffset = 0; }); bar.style.transform = 'none'; return Promise.resolve(); }
    // písmená v poradí, potom pauza a podčiarknutie jedným švihom: rýchly štart, dlhý dobeh
    const tot = v.l.slice(0, n).reduce((a, b) => a + b, 0); let t = 0;
    const run = ps.map((p, i) => { const d = v.l[i] / tot * T, a = p.animate([{ strokeDashoffset: v.l[i] + 1 }, { strokeDashoffset: 0 }], { duration: d, delay: t, fill: 'forwards', easing: 'linear' }); t += d; return a.finished; });
    run.push(bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: T * 0.45, delay: t + 150, fill: 'forwards', easing: 'cubic-bezier(.3,.7,.1,1)' }).finished);
    return Promise.all(run);
  };
}
