import { DepthImage } from './depth.js';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

// nábeh textu po načítaní písma
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(() => document.body.classList.add('go')));

// jemné objavenie prvkov
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
$$('.rv, .panel, .bt, .rc').forEach((el) => io.observe(el));

// animované texty: nadpisy vychádzajú po slovách zospodu, štítky sa odkryjú zľava, čísla napočítajú
if (!reduce) {
  const words = (h) => {
    let i = 0;
    [...h.childNodes].forEach((n) => {
      if (n.nodeType !== 3 || !n.data.trim()) return;
      const f = document.createDocumentFragment();
      n.data.split(/( +)/).forEach((w) => {
        if (!w) return;
        if (/^ +$/.test(w)) { f.append(' '); return; }
        const o = document.createElement('span'), x = document.createElement('span');
        o.className = 'wd'; x.className = 'wi'; x.style.setProperty('--w', i++); x.textContent = w;
        o.append(x); f.append(o);
      });
      n.replaceWith(f);
    });
    h.classList.add('tx');
  };
  $$('main h1, main h2, .cta h2').filter((h) => !h.closest('.vh-copy, .modal, .thanks')).forEach((h) => { words(h); io.observe(h); });
  // štítky sa odkrývajú clip-pathom, preto sa sleduje ich rodič (clip-path skryje aj priesečník)
  const tlo = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; e.target._tl.forEach((x) => x.classList.add('in')); tlo.unobserve(e.target); }), { threshold: 0.05, rootMargin: '0px 0px -4% 0px' });
  $$('main .lab').filter((l) => !l.closest('.vh-copy, .modal, .steps, .bt, .v360, .f, .rz6-cap')).forEach((l) => { l.classList.add('tl'); const h = l.parentElement; (h._tl = h._tl || []).push(l); tlo.observe(h); });
  $$('.sp-body li').forEach((li) => { li.classList.add('tli'); li.style.setProperty('--k', [...li.parentNode.children].indexOf(li)); io.observe(li); });
  const count = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; count.unobserve(e.target);
    const b = e.target, m = b.textContent.match(/^(\d+)(.*)$/); if (!m) return;
    const to = +m[1], rest = m[2], t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 1400), v = 1 - Math.pow(1 - k, 4); b.textContent = Math.round(to * v) + rest; if (k < 1) requestAnimationFrame(step); };
    b.textContent = '0' + rest; requestAnimationFrame(step);
  }), { threshold: 0.6 });
  $$('.sp-stats b').forEach((b) => count.observe(b));
}

// menu na mobile
const nav = $('.nav'), mb = $('.menu-btn');
mb?.addEventListener('click', () => { const o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });

// rozbaľovací výber pri tlačidlách dopytu
const dds = $$('.dd');
const closeAll = (except) => dds.forEach((d) => { if (d !== except) { d.classList.remove('open'); d.querySelector('button').setAttribute('aria-expanded', 'false'); } });
dds.forEach((d) => {
  const b = d.querySelector('button');
  b.addEventListener('click', () => { const o = d.classList.toggle('open'); b.setAttribute('aria-expanded', o); closeAll(d); });
});
addEventListener('click', (e) => { if (!e.target.closest('.dd')) closeAll(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

// hero so stavbou ihriska
if ($('#c')) import('./hero.js');

// video s deťmi: pri obmedzenom pohybe stojí, tlačidlo ho zastaví a spustí
const hv = $('#hv'), hb = $('#hv-btn');
if (hv) {
  const set = (on) => { on ? hv.play().catch(() => {}) : hv.pause(); hb.textContent = on ? 'Pauza' : 'Prehrať'; hb.setAttribute('aria-pressed', String(!on)); };
  if (reduce) set(false);
  hb.addEventListener('click', () => set(hv.paused));
}

// depth fotky: kamera ide dovnútra podľa scrollu, myš posúva hĺbku
const items = new Map();
if (!reduce) {
  const lazy = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    lazy.unobserve(e.target);
    const host = $('[data-depth]', e.target);
    items.set(e.target, { d: new DepthImage(host, host.dataset.img, host.dataset.depth), hover: 0, mx: 0, my: 0 });
  }), { rootMargin: '250px' });
  $$('.panel, .bt').forEach((c) => {
    lazy.observe(c);
    c.addEventListener('pointermove', (ev) => { const it = items.get(c); if (!it) return; const r = c.getBoundingClientRect(); it.hover = 1; it.mx = (ev.clientX - r.left) / r.width * 2 - 1; it.my = (ev.clientY - r.top) / r.height * 2 - 1; });
    c.addEventListener('pointerleave', () => { const it = items.get(c); if (it) { it.hover = 0; it.mx = it.my = 0; } });
  });
  addEventListener('resize', () => items.forEach((i) => i.d.resize()));
  let prev = performance.now();
  const loop = (now) => {
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    items.forEach((it, c) => {
      const r = c.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      it.d.set(p * 0.75 + it.hover * 0.25, it.mx, it.my);
      it.d.step(dt);
    });
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

// bento karty: 3D náklon podľa myši a svetlo pod kurzorom (podľa award-winning-website)
if (fine && !reduce) {
  $$('.bt:not(.bt-360)').forEach((c) => {
    const inn = $('.bt-in', c);
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      inn.style.transform = `perspective(700px) rotateX(${(y - 0.5) * 6}deg) rotateY(${(x - 0.5) * -6}deg) scale3d(.97,.97,.97)`;
      inn.style.setProperty('--mx', `${x * r.width}px`); inn.style.setProperty('--my', `${y * r.height}px`);
    });
    c.addEventListener('pointerleave', () => { inn.style.transform = ''; });
  });
}

// 360 ihrisko: snímky sa menia ťahaním (myš aj dotyk), po pustení dobieha zotrvačnosťou
const v360 = $('#v360');
if (v360) {
  const cv = $('canvas', v360), g = cv.getContext('2d');
  const N = +v360.dataset.count, base = v360.dataset.frames;
  const imgs = new Array(N);
  let pos = +v360.dataset.start - 1, vel = 0, drag = false, lastX = 0, lastT = 0, touched = false, vis = false, shown = -1, loaded = false;
  const draw = () => {
    const i = ((Math.round(pos) % N) + N) % N, im = imgs[i];
    if (i === shown || !im || !im.complete || !im.naturalWidth) return;
    const dpr = Math.min(devicePixelRatio, 2), W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    const k = Math.max(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * k, h = im.naturalHeight * k;
    g.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); shown = i;
  };
  const load = () => {
    if (loaded) return; loaded = true;
    for (let d = 0; d < N; d++) {
      const i = (Math.round(pos) + d) % N, im = new Image();
      im.decoding = 'async'; im.onload = draw; im.src = `${base}${String(i + 1).padStart(3, '0')}.webp`; imgs[i] = im;
    }
  };
  new IntersectionObserver((e) => { vis = e[0].isIntersecting; if (vis) load(); }, { rootMargin: '300px' }).observe(v360);
  const per = () => v360.clientWidth * 1.2 / N;
  v360.addEventListener('pointerdown', (e) => { drag = true; touched = true; vel = 0; lastX = e.clientX; lastT = performance.now(); v360.classList.add('drag'); v360.setPointerCapture(e.pointerId); });
  v360.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const now = performance.now(), dx = e.clientX - lastX, dt = Math.max(1, now - lastT);
    pos -= dx / per(); vel = 0.8 * vel + 0.2 * (-dx / per() / dt * 16); lastX = e.clientX; lastT = now;
  });
  const up = () => { drag = false; v360.classList.remove('drag'); };
  v360.addEventListener('pointerup', up); v360.addEventListener('pointercancel', up);
  v360.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') { pos -= 4; touched = true; } if (e.key === 'ArrowRight') { pos += 4; touched = true; } });
  const tick360 = () => {
    if (vis) {
      if (!drag) { if (Math.abs(vel) > 0.01) { pos += vel; vel *= 0.94; } else if (!touched && !reduce) pos += 43.2 / N; }
      draw();
    }
    requestAnimationFrame(tick360);
  };
  requestAnimationFrame(tick360);
  addEventListener('resize', () => { shown = -1; });
}

// detail realizácie
const modal = $('#modal');
if (modal) {
  const data = JSON.parse($('#projects-data').textContent), img = $('#m-img');
  let cur = 0, md = null, last = null;
  const show = (i) => {
    cur = (i + data.length) % data.length; const p = data[cur];
    if (md?.gl) md.gl.getExtension('WEBGL_lose_context')?.loseContext();
    const im = new Image(); im.src = `assets/obsah/img/projekt-${p.n}.jpg`; im.alt = `${p.title}, ${p.place}`;
    img.replaceChildren(im);
    md = reduce ? null : new DepthImage(img, im.src, `assets/depth/projekt-${p.n}-depth.jpg`);
    md?.set(0.55);
    $('#m-place').textContent = `${p.place}, ${p.type}`; $('#m-title').textContent = p.title; $('#m-desc').textContent = p.desc; $('#m-src').href = p.src;
    $('#m-count').textContent = `${String(cur + 1).padStart(2, '0')} / ${data.length}`;
    // krátky nábeh textu pri každej zmene projektu
    const t = $('.m-copy'); t.classList.remove('swap'); void t.offsetWidth; t.classList.add('swap');
  };
  const page = ['.site-header', 'main', '.site-footer'].map((s) => $(s)).filter(Boolean);
  modal.tabIndex = -1;
  const open = (i, from) => { last = from; show(i); modal.classList.add('open'); document.body.classList.add('lock'); page.forEach((el) => { el.inert = true; }); modal.focus(); requestAnimationFrame(tick); };
  const close = () => { modal.classList.remove('open'); document.body.classList.remove('lock'); page.forEach((el) => { el.inert = false; }); last?.focus(); };
  $$('.bt-in, .rc-in').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); open(data.findIndex((p) => p.slug === a.dataset.slug), a); }));
  $('#m-close').addEventListener('click', close); $('#m-prev').addEventListener('click', () => show(cur - 1)); $('#m-next').addEventListener('click', () => show(cur + 1));
  addEventListener('keydown', (e) => { if (!modal.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); });
  let raf = 0; img.addEventListener('pointermove', (e) => { if (!md || raf) return; raf = requestAnimationFrame(() => { raf = 0; const r = img.getBoundingClientRect(); md.set(0.55, (e.clientX - r.left) / r.width * 2 - 1, (e.clientY - r.top) / r.height * 2 - 1); }); });
  // depth v detaile beží len pri otvorenom detaile
  function tick() { if (!modal.classList.contains('open') || reduce) return; md?.step(0.016); requestAnimationFrame(tick); }
}

// bazén s loptičkami vo výzve a po odoslaní formulára
const pits = $$('.cta .pit');
if (pits.length) import('./balls.js').then(({ BallPit }) => pits.forEach((c) => new BallPit(c, { area: c.parentElement })));

// formulár: predvýber z odkazu (?co=...) a otvorenie e-mailu
const form = $('#dopyt');
if (form) {
  // ukazovateľ krokov: každý krok sa zafarbí, keď je hotový
  const segs = [...form.querySelectorAll('.prog i')], sets = [...form.querySelectorAll('fieldset')];
  const upd = () => {
    const ok = [!!form.querySelector('input[name=co]:checked'), !!form.querySelector('input[name=typ]:checked'), form.meno.value.trim() !== '' && form.email.validity.valid && form.email.value !== ''];
    ok.forEach((v, i) => { segs[i]?.classList.toggle('on', v); sets[i]?.classList.toggle('ok', v); });
  };
  form.addEventListener('input', upd); form.addEventListener('change', upd);
  const co = new URLSearchParams(location.search).get('co');
  if (co) { const r = form.querySelector(`input[name=co][value="${CSS.escape(co)}"]`); if (r) r.checked = true; }
  upd();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form), v = (n) => (fd.get(n) || '').toString().trim();
    const need = form.querySelector('input[name=co]:checked')?.dataset.label || '-';
    const body = [`Meno: ${v('meno')}`, `E-mail: ${v('email')}`, `Telefón: ${v('tel')}`, `Typ prevádzky: ${v('typ') || '-'}`, `Mám záujem o: ${need}`, `Mesto a krajina: ${v('mesto')}`, '', v('sprava')].join('\n');
    $('.f-wrap').classList.add('sent');
    const tp = $('.thanks .pit');
    if (tp) import('./balls.js').then(({ BallPit }) => new BallPit(tp, { area: $('.thanks'), density: 0.6 }));
    const subj = 'Dopyt z webu: ' + v('meno'), href = `mailto:info@play-ground.sk?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    $('#t-mail').href = href; form.dataset.text = `Komu: info@play-ground.sk\nPredmet: ${subj}\n\n${body}`;
    location.href = href;
  });
}
$('#t-copy')?.addEventListener('click', (e) => {
  const t = form.dataset.text || '';
  (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { e.target.textContent = 'Skopírované'; }, () => { e.target.textContent = 'Skopírujte ručne: info@play-ground.sk'; });
});
