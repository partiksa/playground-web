// úvod: červená plocha s veľkým logom, logo sa presunie do hlavičky
(function () {
  var root = document.documentElement, splash = document.getElementById('splash');
  if (!splash || !root.classList.contains('splashing') || !splash.animate) { root.classList.remove('splashing'); return; }
  var big = splash.querySelector('.logo-svg'), small = document.querySelector('.site-header .logo-mark');
  var header = document.querySelector('.site-header');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);
  root.style.overflow = 'hidden';
  var done = function () { root.classList.remove('splashing'); splash.remove(); root.style.overflow = ''; };
  setTimeout(function () {
    var a = big.getBoundingClientRect(), b = small.getBoundingClientRect();
    var k = b.width / a.width, bar = header.offsetHeight;
    var opt = { duration: 1000, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' };
    big.animate([{ transform: 'none' }, { transform: 'translate(' + (b.left - a.left) + 'px,' + (b.top - a.top) + 'px) scale(' + k + ')' }], opt);
    splash.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 calc(100% - ' + bar + 'px) 0)' }], opt);
    setTimeout(done, 1020);
  }, 1750);
})();
