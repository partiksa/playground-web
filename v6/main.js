import { DepthImage } from './depth.js';
window.__ok = 1;
const reduce = false; // prefers-reduced-motion sa zámerne ignoruje
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

// nábeh textu po načítaní písma (nadpisy sú dovtedy skryté, aby sa riadky nezalomili dvakrát)
// fonts.ready sa môže vyriešiť skôr, než sa písmo začne sťahovať, preto sa načíta výslovne
const fontsReady = Promise.race([document.fonts ? Promise.all([document.fonts.load('600 1em Switzer'), document.fonts.load('400 1em Switzer'), document.fonts.load('500 1em "Cabinet Grotesk"')]).then(() => document.fonts.ready) : Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]);
fontsReady.then(() => requestAnimationFrame(() => document.body.classList.add('go')));

// jemné objavenie prvkov
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
$$('.rv').forEach((el) => io.observe(el));

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
  // slová sa rozdelia až s finálnym písmom, potom sa riadky už nemenia
  fontsReady.then(() => $$('main h1, main h2, .cta h2').filter((h) => !h.closest('.vh-copy, .modal, .thanks')).forEach((h) => { words(h); io.observe(h); }));
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

// prekrytie mriežky na kontrolu: ?grid v adrese alebo kláves G
{
  const ov = document.createElement('div'); ov.className = 'grid-ov'; ov.setAttribute('aria-hidden', 'true'); document.body.append(ov);
  const draw = () => { const n = +getComputedStyle(document.documentElement).getPropertyValue('--cols') || 12; if (ov.children.length !== n) ov.replaceChildren(...Array.from({ length: n }, () => document.createElement('i'))); ov.dataset.info = `${n} stĺpcov, ${innerWidth}px`; };
  const set = (on) => { document.documentElement.classList.toggle('show-grid', on); if (on) draw(); };
  set(new URLSearchParams(location.search).has('grid'));
  addEventListener('resize', () => document.documentElement.classList.contains('show-grid') && draw());
  addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'g' && !e.target.closest('input, textarea') && !e.metaKey && !e.ctrlKey) set(!document.documentElement.classList.contains('show-grid')); });
}

// režim poznámok ku prvkom (?review, server tools/review_server.py)
if (new URLSearchParams(location.search).has('review')) import('./review.js');

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

// 3D ihrisko z Blendera (Ihriská na mieru, Prerábka)
if ($('.p3d')) import('./play3d.js');

// úvod (home.js), postup a kde sa hodia (rows.js), realizácie (rz-page.js): moduly sa načítajú len na stránke, ktorá ich má
if ($('[data-home]')) import('./home.js');
if ($('[data-rows]')) import('./rows.js');
if ($('[data-rz]')) import('./rz-page.js');

// hero so stavbou ihriska
if ($('#c')) import('./hero.js');

// video s deťmi: pri obmedzenom pohybe stojí
const hv = $('#hv');
if (hv && reduce) hv.pause();


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
  $$('.rc-in').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); open(data.findIndex((p) => p.slug === a.dataset.slug), a); }));
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
    const ok = [!!form.querySelector('input[name=co]:checked'), !!form.querySelector('input[name=typ]:checked'), !!form.querySelector('input[name=kedy]:checked'), form.meno.value.trim() !== '' && form.email.validity.valid && form.email.value !== ''];
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
    const body = [`Meno: ${v('meno')}`, `E-mail: ${v('email')}`, `Telefón: ${v('tel')}`, `Typ prevádzky: ${v('typ') || '-'}`, `Mám záujem o: ${need}`, `Termín: ${v('kedy') || '-'}`, `Mesto a krajina: ${v('mesto')}`, '', v('sprava')].join('\n');
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
