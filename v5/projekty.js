import { DepthImage } from './depth.js';
import { scramble } from './scramble.js';
import { sequence } from './seq.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HERO = 0.84; // výška fotky v detaile, dole ostane kúsok textu
const I = 'assets/obsah/img/', D = 'assets/depth/', SRC = 'https://play-ground.sk/portfolio/';
const samorin = ['5667', '5671', '5677', '5679', '5681', '5684', '5689', '5690'].map((n) => `assets/photos/samorin-${n}.jpg`);
const GAL = { 'dunajska-luzna': 6, 'hlohovec': 9, 'karvina-stena': 2, 'karvina-tubing': 4, 'klatovy': 6, 'kraluv-dvur': 8, 'oravice': 9, 'pezinok': 10, 'praha': 4, 'trnava': 9, 'uhersky-brod': 7 };
// texty z pôvodných stránok projektov
const P = [
  ['kraluv-dvur', 'Presťahované a obnovené ihrisko', 'Králův Dvůr, CZ', 'Presťahovanie a obnova', 'Presťahované a obnovené interiérové ihrisko v Králově Dvore pri Beroune.', '01', 'prestahovane-a-obnovene-interierove-ihrisko-v-kraluv-dvur-cz'],
  ['samorin', 'Interiérové ihrisko na mieru', 'Šamorín', 'Nové ihrisko na mieru', 'Interiérové ihrisko na mieru prepojené s existujúcou stenou s otvormi.', '02', 'interierove-ihrisko-na-mieru-samorin', samorin],
  ['oravice', 'Detská zóna v aquaparku', 'Oravice, Meander', 'Nová detská zóna', 'Montáž kompletnej detskej zóny s panelovým interiérovým ihriskom v aquaparku Meander Oravice.', '03', 'detska-zona-v-aquaparku-meander-oravice'],
  ['trnava', 'Nové ihrisko Kinder Club', 'Trnava', 'Demontáž a montáž', 'Demontáž pôvodného a montáž nového interiérového ihriska v Kinder Clube Trnava.', '04', 'demontaz-a-montaz-noveho-interieroveho-ihriska-kinder-club-trnava'],
  ['pezinok', 'Nové ihrisko v Pezinku', 'Pezinok', 'Demontáž a montáž', 'Demontáž, montáž a zmena nového interiérového ihriska v Pezinku.', '05', 'demontaz-a-montaz-noveho-interieroveho-ihriska-v-pezinku'],
  ['klatovy', 'Obnova obalov konštrukcie', 'Klatovy, CZ', 'Obnova', 'Obnova penových obalov konštrukcie interiérového ihriska.', '06', 'obnova-obalov-konstrukcie-interieroveho-ihriska-klatovy'],
  ['dunajska-luzna', 'Prerábka ihriska', 'Dunajská Lužná', 'Prerábka', 'Vynovenie a prerábka interiérového ihriska v Dunajskej Lužnej.', '07', 'prerabka-interieroveho-ihriska-v-dunajskej-luznej'],
  ['praha', 'Ihrisko na kúpalisku', 'Praha, CZ', 'Montáž', 'Montáž používaného interiérového ihriska v areáli kúpaliska v Prahe.', '08', 'montaz-interieroveho-ihriska-na-kupalisku-v-prahe'],
  ['uhersky-brod', 'Dorábka ihriska a tubingovej dráhy', 'Uherský Brod, CZ', 'Dorábka', 'Dorábka interiérového ihriska a tubingovej dráhy k existujúcemu interiérovému ihrisku.', '09', 'dorabka-interieroveho-ihriska-a-tubingovej-drahy-uhersky-brod-cz'],
  ['hlohovec', 'Presťahovanie a prerobenie ihriska', 'Hlohovec', 'Presťahovanie a prerábka', 'Demontáž trojposchodového interiérového ihriska a úprava na nové ihrisko s dvomi poschodiami na chodbe základnej školy.', '10', 'prestahovanie-a-prerobenie-interieroveho-ihriska-hlohovec'],
  ['karvina-stena', 'Lezecká stena pre deti', 'Karviná, CZ', 'Lezecká stena', 'Lezecká stena je dobrý doplnok do herní.', '11', 'lezecka-stena-pre-deti-karvina'],
  ['karvina-tubing', 'Tubingová dráha', 'Karviná, CZ', 'Tubingová dráha', 'Tubingová dráha postavená ako samostatne stojaci herný prvok. Deti na nej trávia najviac času.', '12', 'tubingova-draha-karvina'],
].map(([slug, title, place, type, desc, n, src, photos]) => ({
  // fotky z galérií pôvodného webu (assets/obsah/projekty/<slug>/01.jpg ...)
  slug, title, place, type, desc, n,
  img: `${I}projekt-${n}.jpg`, depth: `${D}projekt-${n}-depth.jpg`, src: SRC + src + '/',
  photos: photos || [`${I}projekt-${n}.jpg`, ...Array.from({ length: GAL[slug] || 0 }, (_, k) => `assets/obsah/projekty/${slug}/${String(k + 1).padStart(2, '0')}.jpg`)],
}));

// ---------- karty ----------
const list = document.getElementById('cards');
list.innerHTML = P.map((p, i) => `<li class="card-p" style="--i:${i % 2}"><a href="#${p.slug}" data-slug="${p.slug}">
  <div class="ph"><img src="${p.img}" alt="${p.title}, ${p.place}" loading="lazy"></div>
  <p class="no">${p.n} <span>${p.type}</span></p><h2 class="pl">${p.place}</h2><p class="ty">${p.title}</p></a></li>`).join('');

// karty sa ukážu postupne pri scrolle
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  list.querySelectorAll('.card-p').forEach((c) => { c.classList.add('rv-c'); io.observe(c); });
}

// ---------- stavba ihriska sa prehráva podľa scrollu cez zoznam ----------
const rz = document.getElementById('rz');
sequence(document.getElementById('rc'), {
  n: 240, zoom: 1.3, ax: 0,
  src: (i) => `frames/stavba/f_${String(i + 1).padStart(3, '0')}.webp`,
  progress: () => { const r = rz.getBoundingClientRect(); return Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight))); },
});

// ---------- detail ----------
const $ = (id) => document.getElementById(id);
const det = $('detail'), dHero = $('d-hero'), dImg = $('d-img'), slides = $('slides');
let cur = null, depth = null, slide = 0, pushed = false, lastFocus = null;

function fill(p) {
  dImg.src = p.img; dImg.alt = `${p.title}, ${p.place}`;
  $('d-type').textContent = p.type; $('d-title').textContent = p.title;
  $('d-place').textContent = p.place; $('d-desc').textContent = p.desc; $('d-src').href = p.src;
  slides.classList.toggle('one', p.photos.length < 2);
  slide = 0; showSlide(0, true);
  dHero.querySelector('canvas')?.remove();
  depth = reduce ? null : new DepthImage(dHero, p.img, p.depth);
}
function showSlide(i, now) {
  const ph = cur.photos; slide = (i + ph.length) % ph.length;
  $('s-count').textContent = `${slide + 1} / ${ph.length}`;
  const view = slides.querySelector('.s-view'), src = ph[slide], alt = `${cur.title}, fotka ${slide + 1}`;
  if (now || reduce) {
    view.querySelectorAll('img:not(:last-child)').forEach((x) => x.remove());
    const img = view.lastElementChild; img.src = src; img.alt = alt; img.classList.remove('in');
    ph.forEach((u) => { new Image().src = u; }); // ostatné fotky projektu vopred
    return;
  }
  // nová fotka sa najprv načíta, potom sa prelinie cez starú
  const img = new Image(); img.src = src; img.alt = alt; img.className = 'in';
  img.decode().catch(() => {}).then(() => {
    if (ph[slide] !== src) return;
    view.append(img);
    requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add('on')));
    setTimeout(() => { while (view.firstElementChild !== img) view.firstElementChild.remove(); }, 450);
  });
}
$('s-prev').onclick = () => showSlide(slide - 1);
$('s-next').onclick = () => showSlide(slide + 1);
// potiahnutie prstom na fotke: ďalšia alebo predchádzajúca
let sx = null, swiped = false;
slides.querySelector('.s-view').addEventListener('pointerdown', (e) => { sx = e.clientX; });
addEventListener('pointerup', (e) => { if (sx === null) return; const d = e.clientX - sx; sx = null; swiped = Math.abs(d) > 40; if (swiped) showSlide(slide + (d < 0 ? 1 : -1)); });
slides.querySelector('.s-view').addEventListener('click', () => { if (!swiped) showSlide(slide + 1); swiped = false; });

function open(slug, from) {
  const p = P.find((x) => x.slug === slug);
  if (!p) return;
  cur = p; lastFocus = document.activeElement; fill(p);
  document.documentElement.style.overflow = 'hidden';
  const show = () => { det.hidden = false; det.scrollTop = 0; requestAnimationFrame(() => det.classList.add('open')); $('d-close').focus({ preventScroll: true }); scramble($('d-title'), p.title, 700); scramble($('d-place'), p.place, 700); };
  if (!from || reduce) return show();
  // náhľad z panela sa plynulo zväčší na celú obrazovku
  const r = from.getBoundingClientRect(), fly = new Image();
  fly.src = from.currentSrc || from.src; fly.className = 'fly'; fly.alt = '';
  Object.assign(fly.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  document.body.append(fly);
  fly.animate([
    { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' },
    { left: '0px', top: '0px', width: innerWidth + 'px', height: Math.round(innerHeight * HERO) + 'px' },
  ], { duration: 750, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
  setTimeout(() => { show(); setTimeout(() => fly.remove(), 60); }, 760);
}
function close() {
  det.classList.remove('open');
  const end = () => { det.hidden = true; document.documentElement.style.overflow = ''; cur = null; lastFocus?.focus?.({ preventScroll: true }); };
  if (reduce) return end();
  det.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease-out', fill: 'forwards' });
  setTimeout(() => { end(); det.getAnimations().forEach((a) => a.cancel()); }, 310);
}

list.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-slug]');
  if (!a) return;
  e.preventDefault();
  history.pushState({ p: a.dataset.slug }, '', '#' + a.dataset.slug); pushed = true;
  open(a.dataset.slug, a.querySelector('img'));
});
$('d-close').onclick = () => { if (pushed) history.back(); else { history.replaceState(null, '', location.pathname); close(); } };
addEventListener('popstate', () => { const s = location.hash.slice(1); if (s) open(s); else if (cur) { pushed = false; close(); } });
addEventListener('keydown', (e) => {
  if (!cur) return;
  if (e.key === 'Escape') $('d-close').click();
  if (e.key === 'ArrowRight') showSlide(slide + 1);
  if (e.key === 'ArrowLeft') showSlide(slide - 1);
});

// depth fotka v detaile: pri scrolle dole ide dovnútra
let prev = performance.now(), mx = 0, my = 0;
addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; }, { passive: true });
addEventListener('resize', () => depth?.resize());
(function loop(now) {
  const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
  if (cur && depth) { depth.set(Math.min(1, det.scrollTop / innerHeight), mx, my); depth.step(dt); }
  requestAnimationFrame(loop);
})(prev);

if (location.hash.length > 1) open(location.hash.slice(1));
