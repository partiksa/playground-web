// Scroll-linked prehrávanie snímok na canvas.
// Použitie: scrollFrames({ canvas, section, dir: 'frames/', count: 120, ext: 'webp' })
// section = vysoký blok (napr. 300vh); canvas v ňom je sticky.
export function scrollFrames({ canvas, section, dir, count, ext = 'webp', ease = 0.14 }) {
  const ctx = canvas.getContext('2d');
  const pad = n => String(n).padStart(3, '0');
  const imgs = new Array(count);
  let cur = 0, target = 0, drawn = -1, raf = 0;

  const load = i => imgs[i] || (imgs[i] = Object.assign(new Image(), { src: `${dir}f${pad(i + 1)}.${ext}`, decoding: 'async' }));

  function size() {
    const r = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d); drawn = -1;
  }
  function draw(i) {
    // nahradí chýbajúcu snímku najbližšou načítanou
    for (let k = 0; k < count; k++) for (const j of [i - k, i + k]) {
      const im = imgs[j];
      if (im && im.complete && im.naturalWidth) {
        if (j === drawn) return;
        const cw = canvas.width, ch = canvas.height, s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
        const w = im.naturalWidth * s, h = im.naturalHeight * s;
        ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h); drawn = j; return;
      }
    }
  }
  function progress() {
    const r = section.getBoundingClientRect(), span = r.height - innerHeight;
    return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
  }
  function tick() {
    target = progress() * (count - 1);
    cur += (target - cur) * ease;
    if (Math.abs(target - cur) < 0.01) cur = target;
    draw(Math.round(cur));
    raf = (cur !== target) ? requestAnimationFrame(tick) : 0;
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  // poradie načítania: prvá, posledná, potom každá 8., potom zvyšok
  const order = [0, count - 1];
  for (let s = 8; s >= 1; s = s >> 1) for (let i = 0; i < count; i += s) if (!order.includes(i)) order.push(i);
  order.forEach(i => { const im = load(i); im.onload = kick; });

  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', () => { size(); kick(); });
  size(); kick();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // bez animácie: ukáž hotové ihrisko
    addEventListener('scroll', () => {}, { passive: true }); cur = target = count - 1; load(count - 1).onload = () => draw(count - 1);
  }
}
