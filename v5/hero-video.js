// hero: stavba ihriska ako snímky videa, ktoré sa prehrávajú podľa scrollu
const N = 240, SRC = (i) => `frames/stavba/f_${String(i + 1).padStart(3, '0')}.webp`;
const canvas = document.getElementById('c'), ctx = canvas.getContext('2d');
const track = document.getElementById('track');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const frames = new Array(N);
let cur = 0, shown = -1, want = 0;

// načítanie: najprv každý 8. snímok (hrubý náhľad hneď), potom zvyšok
const FIRST = 0; // prvý snímok: prázdna hala
const order = [FIRST, FIRST + 1];
for (let s = 8; s >= 1; s >>= 1) for (let i = FIRST; i < N; i += s) if (!order.includes(i)) order.push(i);
order.push(N - 1);
function load(i) {
  return new Promise((res) => {
    const im = new Image(); im.decoding = 'async';
    im.onload = () => { frames[i] = im; res(); };
    im.onerror = res; im.src = SRC(i);
  });
}
(async () => {
  const q = order.slice(); const worker = async () => { while (q.length) { await load(q.shift()); draw(true); } };
  await Promise.all([worker(), worker(), worker(), worker()]);
})();

function fit() {
  const r = canvas.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
  const w = Math.round(r.width * d), h = Math.round(r.height * d);
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; shown = -1; }
}
function best(i) { // najbližší načítaný snímok
  for (let k = 0; k < N; k++) { if (frames[i - k]) return i - k; if (frames[i + k]) return i + k; }
  return -1;
}
function draw(force) {
  fit();
  const i = best(Math.max(0, Math.min(N - 1, Math.round(FIRST + cur * (N - 1 - FIRST)))));
  if (i < 0 || (i === shown && !force)) return;
  const im = frames[i], cw = canvas.width, ch = canvas.height, iw = im.naturalWidth, ih = im.naturalHeight;
  // vyplniť celú plochu; na úzkej obrazovke len do 1,9-násobku šírky, aby ihrisko ostalo celé
  const k = Math.max(cw / iw, Math.min(ch / ih, cw / iw * 1.9)), w = iw * k, h = ih * k;
  const x = (cw - w) / 2, y = Math.min(0, (ch - h) * 0.8);
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(im, x, y, w, h);
  if (y + h < ch) { // snímok nesiaha po spodok: spodný okraj sa stráca do pozadia stránky
    ctx.globalCompositeOperation = 'destination-in';
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, '#000'); g.addColorStop(0.8, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);
    ctx.globalCompositeOperation = 'source-over';
  }
  shown = i;
}

const clamp = (v) => Math.max(0, Math.min(1, v));
const PLAY = 10, HOLD = 3; let T0 = performance.now(), started = reduce;
const target = () => reduce ? 1 : !started ? 0 : clamp((((performance.now() - T0) / 1000) % (PLAY + HOLD)) / PLAY);
cur = target(); let prev = performance.now();
export function start() { started = true; T0 = performance.now(); }
function tick(now) {
  const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
  const t = target();
  // úvodné samo-prehratie: po odchode loga sa stavba na chvíľu rozbehne sama, potom ju vedie scroll
  cur = t;
  if (scrollY < innerHeight * 1.5) draw(false);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
addEventListener('resize', () => draw(true));
