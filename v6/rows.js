// rows.js: Postup (ihriská na mieru). Zvýraznený je vždy jeden krok; obraz vľavo sa so scrollom plynule
// presúva, natáča a prelína na ilustráciu aktívneho kroku. Pri obmedzenom pohybe sa obraz len prepne.
const reduce = false; // prefers-reduced-motion sa zámerne ignoruje
const mob = matchMedia('(max-width: 860px)');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

document.querySelectorAll('[data-rows="steps"]').forEach((sec) => {
  const lis = [...sec.querySelectorAll('.st-list li')];
  const imgs = [...sec.querySelectorAll('.st-imgs img')];
  const ticks = [...sec.querySelectorAll('.st-ticks i')];
  const num = sec.querySelector('.st-n');
  const side = sec.querySelector('.st-side');
  const vis = sec.querySelector('.st-vis');
  const scr = sec.querySelector('.st-scr');
  if (!lis.length) return;
  if (!reduce) sec.classList.add('js');

  let act = -1, raf = 0, live = false;

  // výška, na ktorej sa krok stáva aktívnym: stred okna, na mobile stred plochy pod lepkavým obrazom
  const anchor = () => {
    if (!mob.matches) return innerHeight * 0.5;
    const b = side.getBoundingClientRect().bottom;
    return b + (innerHeight - b) * 0.42;
  };

  function frame() {
    raf = 0;
    const y = anchor();
    const c = lis.map((l) => { const r = l.getBoundingClientRect(); return r.top + r.height / 2; });
    const last = c.length - 1;
    // spojitá poloha medzi krokmi (0 až počet - 1)
    let f;
    if (y <= c[0]) f = 0;
    else if (y >= c[last]) f = last;
    else { let i = 0; while (c[i + 1] < y) i++; f = i + (y - c[i]) / (c[i + 1] - c[i]); }

    const a = Math.round(f);
    if (a !== act) {
      act = a;
      lis.forEach((l, i) => l.classList.toggle('on', i === a));
      imgs.forEach((im, i) => im.classList.toggle('on', i === a));
      ticks.forEach((t, i) => { t.classList.toggle('on', i === a); t.classList.toggle('done', i < a); });
      num.textContent = String(a + 1).padStart(2, '0');
    }
    if (reduce) return;

    // ilustrácie: prichádzajúca ide sprava zdola, odchádzajúca doľava hore; v strede kroku sa ešte jemne hýbe
    imgs.forEach((im, i) => {
      const t = f - i, d = Math.abs(t);
      const o = clamp((0.62 - d) / 0.3, 0, 1);
      im.style.opacity = o;
      im.style.visibility = o > 0 ? 'visible' : 'hidden';
      if (o > 0) im.style.transform = `translate(${(-t * 22).toFixed(2)}%, ${(-t * 9).toFixed(2)}%) rotate(${(-t * 14).toFixed(2)}deg) scale(${(1 - Math.min(d, 1) * 0.2).toFixed(3)})`;
    });
    // podklad sa pomaly otáča, voskovková čiara sa pri každom kroku nakreslí nanovo
    const k = f - Math.floor(f);
    vis.style.setProperty('--br', `${(f * 38).toFixed(2)}deg`);
    vis.style.setProperty('--bs', (1 + Math.sin(f * Math.PI) * 0.035).toFixed(4));
    const local = Math.abs(f - a);
    scr.style.setProperty('--sd', clamp(local * 2.4, 0, 1).toFixed(3));
    scr.style.transform = `scaleX(${a % 2 ? -1 : 1}) rotate(${((k - 0.5) * 3).toFixed(2)}deg)`;
  }

  const req = () => { if (live && !raf) raf = requestAnimationFrame(frame); };
  new IntersectionObserver((es) => { live = es[0].isIntersecting; if (live) req(); }, { rootMargin: '20% 0px' }).observe(sec);
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  frame();
});
