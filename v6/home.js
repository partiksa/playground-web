// úvod: kresby voskovkami sa mierne posúvajú za myšou; chýbajúca kresba sa skryje
const hh = document.querySelector('.hh');
const reduce = false; // prefers-reduced-motion sa zámerne ignoruje
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

hh.querySelectorAll('.cr img').forEach((im) => {
  const hide = () => { im.parentElement.hidden = true; };
  if (im.complete && !im.naturalWidth) hide(); else im.addEventListener('error', hide);
});

if (fine && !reduce) {
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
  const step = () => {
    x += (tx - x) * 0.08; y += (ty - y) * 0.08;
    hh.style.setProperty('--px', x.toFixed(3)); hh.style.setProperty('--py', y.toFixed(3));
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.002 ? requestAnimationFrame(step) : 0;
  };
  const go = () => { if (!raf) raf = requestAnimationFrame(step); };
  hh.addEventListener('pointermove', (e) => { const r = hh.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width * 2 - 1; ty = (e.clientY - r.top) / r.height * 2 - 1; go(); });
  hh.addEventListener('pointerleave', () => { tx = ty = 0; go(); });
}

// video beží len, keď je vidieť
const hv = document.getElementById('hv');
if (hv && !reduce) new IntersectionObserver(([e]) => { if (e.isIntersecting) hv.play().catch(() => {}); else hv.pause(); }).observe(hv);
