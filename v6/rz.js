// Realizácie: stavba ihriska sa prehráva sama (bez scrollu), na konci chvíľu stojí a začne znova
const N = 240, FPS = 24, HOLD = 3;
const canvas = document.getElementById('rzc'), ctx = canvas.getContext('2d');
const reduce = false; // prefers-reduced-motion sa zámerne ignoruje
const frames = new Array(N);
let shown = -1, visible = true, paused = false, t0 = performance.now(), pt = 0;
const hb = document.getElementById('hv-btn');
if (hb) hb.addEventListener('click', () => {
  paused = !paused; hb.textContent = paused ? 'Prehrať' : 'Pauza'; hb.setAttribute('aria-pressed', String(paused));
  if (paused) pt = performance.now(); else t0 += performance.now() - pt;
});
const SRC = (i) => `frames/stavba/f_${String(i + 1).padStart(3, '0')}.webp`;

const order = [0];
for (let s = 8; s >= 1; s >>= 1) for (let i = 0; i < N; i += s) if (!order.includes(i)) order.push(i);
const load = (i) => new Promise((res) => { const im = new Image(); im.decoding = 'async'; im.onload = () => { frames[i] = im; res(); }; im.onerror = res; im.src = SRC(i); });
let started = false;
function start() {
  if (started) return; started = true;
  const q = order.slice();
  const w = async () => { while (q.length) { await load(q.shift()); draw(true); } };
  for (let k = 0; k < 4; k++) w();
}
function fit() {
  const r = canvas.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1), w = Math.round(r.width * d), h = Math.round(r.height * d);
  if (w && h && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; shown = -1; }
}
function best(i) { for (let k = 0; k < N; k++) { if (frames[i - k]) return i - k; if (frames[i + k]) return i + k; } return -1; }
let want = 0;
function draw(force, pos) {
  if (pos != null) want = pos;
  fit();
  const i = best(Math.max(0, Math.min(N - 1, want)));
  if (i < 0 || (i === shown && !force)) return;
  const im = frames[i], cw = canvas.width, ch = canvas.height;
  const k = Math.max(cw / im.naturalWidth, ch / im.naturalHeight), w = im.naturalWidth * k, h = im.naturalHeight * k;
  ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
  shown = i;
}
function tick(now) {
  if (visible && !document.hidden && !paused) {
    const cyc = N / FPS + HOLD, t = ((now - t0) / 1000) % cyc;
    draw(false, Math.min(N - 1, Math.floor(t * FPS)));
  }
  requestAnimationFrame(tick);
}
new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) start(); }, { rootMargin: '10% 0px' }).observe(canvas);
new ResizeObserver(() => draw(true)).observe(canvas);
start();
if (reduce) { load(N - 1).then(() => draw(true, N - 1)); } else requestAnimationFrame(tick);
