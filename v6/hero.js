// stavba ihriska: 240 snímkov videa sa prehráva podľa scrollu
const N = 240, FIRST = 25, SRC = (i) => `assets/stavba/f${String(i + 1).padStart(3, '0')}.webp`;
const canvas = document.getElementById('c'), ctx = canvas.getContext('2d'), track = document.getElementById('track'), tc = document.getElementById('tc');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const frames = new Array(N);
const ZOOM = innerWidth > 860 ? 1.6 : 1.25; // väčšia animácia: model vyplní celú plochu
let cur = 0, shown = -1, secShown = -1;

// najprv hrubý náhľad (každý 8. snímok), potom zvyšok
const order = [FIRST, FIRST + 1];
for (let s = 8; s >= 1; s >>= 1) for (let i = FIRST; i < N; i += s) if (!order.includes(i)) order.push(i);
order.push(N - 1);
const load = (i) => new Promise((res) => { const im = new Image(); im.decoding = 'async'; im.onload = () => { frames[i] = im; res(); }; im.onerror = res; im.src = SRC(i); });
(async () => { const q = order.slice(); const w = async () => { while (q.length) { await load(q.shift()); draw(true); } }; await Promise.all([w(), w(), w(), w()]); })();

function fit() {
  const r = canvas.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1), w = Math.round(r.width * d), h = Math.round(r.height * d);
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; shown = -1; }
}
function best(i) { for (let k = 0; k < N; k++) { if (frames[i - k]) return i - k; if (frames[i + k]) return i + k; } return -1; }
function draw(force) {
  fit();
  const i = best(Math.max(0, Math.min(N - 1, Math.round(FIRST + cur * (N - 1 - FIRST)))));
  if (i < 0 || (i === shown && !force)) return;
  const im = frames[i], cw = canvas.width, ch = canvas.height;
  const k = Math.min(cw / im.naturalWidth, ch / im.naturalHeight) * ZOOM, w = im.naturalWidth * k, h = im.naturalHeight * k, x = (cw - w) / 2, y = (ch - h) / 2;
  ctx.clearRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(im, x, y, w, h);
  // okraje snímku sa plynulo strácajú do papiera
  ctx.globalCompositeOperation = 'destination-in';
  const x0 = Math.max(x, 0), x1 = Math.min(x + w, cw), y0 = Math.max(y, 0), y1 = Math.min(y + h, ch);
  const gx = ctx.createLinearGradient(x0, 0, x1, 0), gy = ctx.createLinearGradient(0, y0, 0, y1);
  [gx, gy].forEach((g) => { g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.05, '#000'); g.addColorStop(0.95, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch); });
  ctx.globalCompositeOperation = 'source-over';
  shown = i;
}
function clock() {
  const s = Math.round(cur * 10);
  if (s !== secShown) { secShown = s; tc.textContent = `0:${String(s).padStart(2, '0')} / 0:10`; }
  bar.style.transform = `scaleX(${cur.toFixed(4)})`;
  // aktuálny krok stavby: posledný, ktorého začiatok už scroll prešiel
  let k = 0; steps.forEach((li, i) => { if (cur >= +li.dataset.at - 0.001) k = i; });
  if (k !== stepShown) { stepShown = k; steps.forEach((li, i) => { li.classList.toggle('on', i === k); li.classList.toggle('done', i < k); }); }
}
const bar = document.getElementById('bar'), steps = [...document.querySelectorAll('#steps li')];
let stepShown = -1;
const clamp = (v) => Math.max(0, Math.min(1, v));
// progres od chvíle, keď sa scéna prilepí pod hlavičku, po jej odchod
const target = () => { if (reduce) return 1; const hh = document.querySelector('.site-header').offsetHeight, r = track.getBoundingClientRect(); return clamp((hh - r.top) / Math.max(1, r.height - (innerHeight - hh))); };
cur = target(); let prev = performance.now();
function tick(now) {
  const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
  const t = target(); cur += (t - cur) * (1 - Math.exp(-dt * 6));
  if (Math.abs(t - cur) < 0.0005) cur = t;
  const r = track.getBoundingClientRect();
  if (r.top < innerHeight && r.bottom > 0) { draw(false); clock(); }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
addEventListener('resize', () => draw(true));
