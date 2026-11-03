// identita v5: Slinkee písmená v nadpisoch, načítavanie s logom, jemné animácie pri zobrazení
(function () {
  var root = document.documentElement;
  var motion = !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window;
  if (motion) root.classList.add('mo');
  // podstránky: ak sa stránka načítava dlhšie, ukáže sa logo, ktoré sa píše
  if (!root.classList.contains('splashing')) {
    root.classList.add('booting');
    addEventListener('load', function () { root.classList.remove('booting'); });
  }

  // Slinkee len za písmená bez diakritiky, 1 až 2 v nadpise, vždy tie isté pre rovnaký text
  var SET = 'AEGMN';
  function hash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function slink(el) {
    if (!el || el.querySelector('.sl')) return;
    var text = el.textContent, nodes = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) nodes.push(n);
    var cand = [];
    nodes.forEach(function (node, ni) {
      for (var i = 0; i < node.data.length; i++) if (SET.indexOf(node.data[i].toUpperCase()) > -1) cand.push([ni, i]);
    });
    if (!cand.length) return;
    var count = text.replace(/\s/g, '').length > 12 && cand.length > 3 ? 2 : 1, h = hash(text), pick = [];
    for (var k = 0; k < count; k++) {
      var c = cand[(h + k * Math.floor(cand.length / 2 + 1)) % cand.length];
      if (!pick.some(function (p) { return p[0] === c[0] && Math.abs(p[1] - c[1]) < 2; })) pick.push(c);
    }
    pick.sort(function (a, b) { return b[0] - a[0] || b[1] - a[1]; }).forEach(function (p) {
      var node = nodes[p[0]], rest = node.splitText(p[1]);
      rest.splitText(1);
      var s = document.createElement('span'); s.className = 'sl'; s.textContent = rest.data;
      rest.replaceWith(s);
    });
  }
  window.slink = slink;

  // obrázky: kým sa načítavajú, za nimi sa píše logo
  function watch(img) {
    if (img._w) return; img._w = 1;
    if (img.complete && img.naturalWidth) return;
    var p = img.parentElement; if (!p) return;
    p.classList.add('ld');
    var done = function () { p.classList.remove('ld'); };
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  }

  // nadpis: slová vyjdú zospodu jedno po druhom (Slinkee písmená ostanú v slove)
  function words(el) {
    var items = [], cur = null;
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        n.data.split(/([ \t\n]+)/).forEach(function (part) {
          if (!part) return;
          if (/^[ \t\n]+$/.test(part)) { cur = null; items.push(' '); return; }
          if (!cur) { cur = []; items.push(cur); }
          cur.push(document.createTextNode(part));
        });
      } else if (n.nodeName === 'BR') { cur = null; items.push(n); }
      else { if (!cur) { cur = []; items.push(cur); } cur.push(n); }
    });
    el.textContent = '';
    var i = 0;
    items.forEach(function (it) {
      if (typeof it === 'string') el.appendChild(document.createTextNode(it));
      else if (!Array.isArray(it)) el.appendChild(it);
      else {
        var w = document.createElement('span'), wi = document.createElement('span');
        w.className = 'w'; wi.className = 'wi'; wi.style.setProperty('--i', i++);
        it.forEach(function (x) { wi.appendChild(x); });
        w.appendChild(wi); el.appendChild(w);
      }
    });
    el.classList.add('sw');
  }

  // čísla: krátke napočítanie do cieľovej hodnoty
  function count(b) {
    var m = b.textContent.match(/^(\d+)(.*)$/); if (!m) return;
    var to = +m[1], rest = m[2], t0 = null;
    b.textContent = '0' + rest;
    function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 4);
      b.textContent = Math.round(to * e) + rest;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function reveal() {
    var heads = document.querySelectorAll('main h1, main h2, main .hx, main .mega');
    var skip = '.sr, .card, .slides, .notes, .note, .panels, .hscroll, .cards';
    var list = Array.prototype.filter.call(document.querySelectorAll(
      'main p:not(.mega), main .cta-row, main .cta, main .more, main .lead, .hero-sub, .depth .say, .ab-stats li, .ab-row, .ab-intro, .site-footer .footer-inner > div'
    ), function (el) { return !el.closest(skip); });
    var set = list.filter(function (el) { return !list.some(function (o) { return o !== el && o.contains(el); }); });
    heads.forEach(function (h) { if (!h.closest(skip)) { words(h); set.push(h); } });
    set.forEach(function (el) { if (!el.classList.contains('sw')) el.classList.add('rv'); });
    var io = new IntersectionObserver(function (es) {
      var k = 0;
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.classList.contains('rv')) el.style.transitionDelay = Math.min(k++, 4) * 90 + 'ms';
        el.classList.add('in'); io.unobserve(el);
        // po dobehnutí zrušiť orezanie slov (Slinkee písmená siahajú pod základnú čiaru)
        if (el.classList.contains('sw')) setTimeout(function () { el.classList.add('done'); }, 1200 + el.querySelectorAll('.w').length * 70);
        if (el.matches('.ab-stats li')) { var b = el.querySelector('b'); if (b) count(b); }
      });
    }, { rootMargin: '0px 0px -3% 0px', threshold: 0 });
    function go() { set.forEach(function (el) { io.observe(el); }); }
    function start() {
      root.classList.add('ready');
      // na úvode počkať, kým sa logo napíše a odíde
      if (!root.classList.contains('splashing')) go();
      else new MutationObserver(function (l, mo) {
        if (!root.classList.contains('splashing')) { mo.disconnect(); go(); }
      }).observe(root, { attributes: true, attributeFilter: ['class'] });
    }
    // začať až keď sú načítané písma: inak sa slová zalomia podľa náhradného písma a potom preskočia
    var started = false, once = function () { if (!started) { started = true; requestAnimationFrame(start); } };
    if (document.fonts && document.fonts.ready) {
      Promise.all([document.fonts.ready, document.fonts.load('700 1em "Plus Jakarta Sans"'), document.fonts.load('1em "Slinkee"')]).then(once, once);
    } else once();
    setTimeout(once, 3000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('h1, .hx, .mega, .card h2, .depth h2, .cta h2, .info h2, .bigword').forEach(function (el) {
      if (!el.closest('.sr')) slink(el);
    });
    if (motion) reveal();
    document.querySelectorAll('img').forEach(watch);
    new MutationObserver(function (list) {
      list.forEach(function (m) { m.addedNodes.forEach(function (x) {
        if (x.nodeType !== 1) return;
        if (x.tagName === 'IMG') watch(x); else x.querySelectorAll && x.querySelectorAll('img').forEach(watch);
      }); });
    }).observe(document.body, { childList: true, subtree: true });
  });
})();
