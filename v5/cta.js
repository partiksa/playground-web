// „NAPÍŠTE NÁM": verzálky Plus Jakarta, dve písmená Slinkee (prvé N a posledné M), bez animácie.
const NS = 'http://www.w3.org/2000/svg';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const el = (tag, at = {}) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); return e; };

function build(h) {
  const text = h.textContent.trim().toUpperCase();
  const first = text.indexOf('N'), last = text.lastIndexOf('M');
  h.textContent = ''; h.classList.add('cw'); h.setAttribute('aria-label', text.toLowerCase().replace(/^./, (c) => c.toUpperCase()));
  let word = null, i = 0, endEl = null;
  [...text].forEach((ch, k) => {
    if (ch === ' ') { h.append(' '); word = null; return; }
    if (!word) { word = document.createElement('span'); word.className = 'cw-word'; word.setAttribute('aria-hidden', 'true'); h.append(word); }
    const l = document.createElement('span'); l.className = 'cw-l'; l.style.setProperty('--i', i++);
    if (k === first || k === last) { const sl = document.createElement('span'); sl.className = 'sl'; sl.textContent = ch; l.append(sl); if (k === last) endEl = sl; }
    else l.textContent = ch;
    word.append(l);
  });
  const bl = document.createElement('span'); bl.className = 'cw-bl'; bl.style.cssText = 'display:inline-block;width:0;height:0'; word.append(bl);
  return { n: i, endEl, bl };
}

function setup(sec) {
  const h = sec.querySelector('h2');
  if (h) build(h);
}

document.querySelectorAll('.cta-end, .home-cta').forEach(setup);
