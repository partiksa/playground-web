// Sekvencia snímok na canvase: snímok podľa hodnoty 0..1 (scroll), plynulé dobiehanie.
// Načítava najprv každý 8. snímok (hneď hrubý pohyb), potom zvyšok.
export function sequence(canvas, { n, src, progress, zoom = 1, loop = false, snap = false, ax = 0.5 }) {
  const ctx = canvas.getContext('2d'), frames = new Array(n);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = progress(), shown = -1, visible = true, prev = performance.now();

  const order = [0];
  for (let s = 8; s >= 1; s >>= 1) for (let i = 0; i < n; i += s) if (!order.includes(i)) order.push(i);
  const load = (i) => new Promise((res) => {
    const im = new Image(); im.decoding = 'async';
    im.onload = () => { frames[i] = im; res(); }; im.onerror = res; im.src = src(i);
  });
  let started = false;
  function start() {
    if (started) return; started = true;
    const q = order.slice();
    const worker = async () => { while (q.length) { await load(q.shift()); draw(true); } };
    for (let k = 0; k < 4; k++) worker();
  }

  function fit() {
    const r = canvas.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    const w = Math.round(r.width * d), h = Math.round(r.height * d);
    if (w && h && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; shown = -1; }
  }
  function best(i) {
    for (let k = 0; k < n; k++) {
      const a = loop ? (i - k + n) % n : i - k, b = loop ? (i + k) % n : i + k;
      if (frames[a]) return a; if (frames[b]) return b;
    }
    return -1;
  }
  function draw(force) {
    fit();
    const raw = cur * (loop ? n : n - 1), i = best(loop ? ((Math.round(raw) % n) + n) % n : Math.max(0, Math.min(n - 1, Math.round(raw))));
    if (i < 0 || (i === shown && !force)) return;
    const im = frames[i], cw = canvas.width, ch = canvas.height;
    const k = Math.max(cw / im.naturalWidth, ch / im.naturalHeight) * zoom, w = im.naturalWidth * k, h = im.naturalHeight * k;
    ctx.drawImage(im, (cw - w) * ax, (ch - h) / 2, w, h);
    shown = i;
  }
  function tick(now) {
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    if (visible) {
      const t = progress();
      cur = (reduce || snap) ? t : cur + (t - cur) * (1 - Math.exp(-dt * 7));
      if (Math.abs(t - cur) < 0.0002) cur = t;
      draw(false);
    }
    requestAnimationFrame(tick);
  }
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) start(); }, { rootMargin: '50% 0px' }).observe(canvas);
  new ResizeObserver(() => draw(true)).observe(canvas);
  requestAnimationFrame(tick);
}
