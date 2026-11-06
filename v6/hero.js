// stavba ihriska: 240 snímkov videa sa prehráva podľa scrollu
const N = 240, FIRST = 8, SRC = (i) => `frames/stavba/f_${String(i + 1).padStart(3, '0')}.webp`;
const canvas = document.getElementById('c'), ctx = canvas.getContext('2d'), track = document.getElementById('track'), tc = document.getElementById('tc');
const reduce = false; // prefers-reduced-motion sa zámerne ignoruje
const frames = new Array(N);
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
  // render v hale: snímok vyplní celú plochu (orezaný na stranách)
  const k = Math.max(cw / im.naturalWidth, ch / im.naturalHeight), w = im.naturalWidth * k, h = im.naturalHeight * k;
  ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
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
const T0 = performance.now(), PLAY = 10, HOLD = 3;
const target = () => reduce ? 1 : clamp((((performance.now() - T0) / 1000) % (PLAY + HOLD)) / PLAY);
cur = target(); let prev = performance.now();
function tick(now) {
  const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
  cur = target();
  const r = track.getBoundingClientRect();
  if (r.top < innerHeight && r.bottom > 0) { draw(false); clock(); }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
addEventListener('resize', () => draw(true));
