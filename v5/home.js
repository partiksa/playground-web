// úvodná stránka: logo sa napíše, presunie do hlavičky, potom začne stavba
import { logo } from './brand/write.js';
import { start } from './hero.js';

const root = document.documentElement, splash = document.getElementById('splash');

async function intro() {
  if (!root.classList.contains('splashing') || !splash.animate) { root.classList.remove('splashing'); splash.remove(); return; }
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0); root.style.overflow = 'hidden';
  const write = logo(splash);
  await write(1500);
  await new Promise((r) => setTimeout(r, 250));
  const big = splash.querySelector('.logo-svg'), small = document.querySelector('.site-header .logo-mark');
  const a = big.getBoundingClientRect(), b = small.getBoundingClientRect(), bar = document.querySelector('.site-header').offsetHeight;
  const opt = { duration: 900, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' };
  big.animate([{ transform: 'none' }, { transform: `translate(${b.left - a.left}px,${b.top - a.top}px) scale(${b.width / a.width})` }], opt);
  await splash.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: `inset(0 0 calc(100% - ${bar}px) 0)` }], opt).finished;
  root.classList.remove('splashing'); splash.remove(); root.style.overflow = '';
}

intro().then(start);
