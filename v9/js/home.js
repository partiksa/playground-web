/* úvod: render kaviarne na scroll, kapitoly v rámiku */
(function () {
  "use strict";

  // render kaviarne: 185 snímok (každá 3. z 555), 1600x900, počas príbehu sa kamera priblíži k ihrisku a vráti späť
  var N = 185, IW = 1600, IH = 900;

  var root = document.documentElement, body = document.body;
  var hd = document.getElementById("hd"), cv = document.getElementById("cv"), ctx = cv.getContext("2d");
  var stage = cv.parentElement;
  // priemerný jas hornej lišty snímky (0 až 255); pod hranicou je text hlavičky svetlý
  var TOP = [160,160,161,162,163,165,168,174,180,191,207,221,209,199,196,204,209,190,189,189,187,178,172,174,149,138,137,151,147,145,145,146,147,146,149,149,149,148,148,145,146,147,142,157,155,172,157,153,160,148,189,181,164,163,161,158,147,149,171,176,151,149,149,157,164,165,170,154,103,124,123,122,120,121,133,133,131,124,118,119,115,115,113,114,130,132,131,138,147,144,153,171,173,175,177,164,152,114,118,140,141,140,133,122,119,125,111,99,95,99,98,96,95,96,96,96,95,94,94,94,94,93,93,93,93,93,93,93,93,93,93,93,93,92,92,89,87,91,98,112,118,143,161,158,153,151,146,145,145,148,173,174,183,166,157,147,168,147,139,132,176,138,151,151,170,202,219,212,198,209,210,200,198,198,203,214,222,195,172,164,159,157,155,153,152];
  var dark = false;
  var frames = new Array(N), cur = -1, L = null, shown = false, first = function () {}, revealed = false;

  /* ---------- snímky: drží sa len okolie aktuálnej snímky ---------- */
  var pending = new Set(), missing = new Set(), playhead = -1;
  var radius = 24, parallel = 6;
  var ROOT = document.documentElement.dataset.root || "";
  function src(i) { return ROOT + "kav/k" + String(i).padStart(3, "0") + ".webp"; }
  function load(i) {
    pending.add(i);
    var im = new Image();
    im.decoding = "async";
    function done(ready) {
      pending.delete(i);
      if (!ready) missing.add(i);
      if (ready && Math.abs(i - playhead) <= radius * 2) {
        frames[i] = im;
        if (nearest(playhead) === i) draw(playhead, true);
      }
      if (i === 0) first();
      pump();
    }
    im.onload = function () { done(true); };
    im.onerror = function () { done(false); };
    im.src = src(i);
  }
  function pump() {
    for (var distance = 0; distance <= radius && pending.size < parallel; distance++) {
      var right = playhead + distance, left = playhead - distance;
      if (right < N && !frames[right] && !pending.has(right) && !missing.has(right)) load(right);
      if (distance && left >= 0 && pending.size < parallel && !frames[left] && !pending.has(left) && !missing.has(left)) load(left);
    }
  }
  function seek(i) {
    if (playhead === i) return;
    playhead = i;
    for (var n = 0; n < N; n++) if (frames[n] && Math.abs(n - i) > radius * 2) delete frames[n];
    draw(i);
    pump();
  }
  function nearest(i) {
    if (frames[i]) return i;
    for (var d = 1; d < N; d++) {
      if (i - d >= 0 && frames[i - d]) return i - d;
      if (i + d < N && frames[i + d]) return i + d;
    }
    return -1;
  }

  /* ---------- rozloženie: záber sa vždy vyplní rovnomerným mierkou (cover), nikdy sa nenaťahuje ---------- */
  function layout() {
    var vw = stage.clientWidth, vh = stage.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var portrait = vw / vh < .9;
    root.classList.toggle("portrait", portrait);
    // na výšku: video v hornej časti, rámik s textom pod ním (výška podľa najvyššieho rámika)
    var ch = vh;
    if (portrait) {
      var tall = 0;
      chs.forEach(function (c) { tall = Math.max(tall, c.el.offsetHeight); });
      ch = Math.round(Math.max(vh * .42, Math.min(vh * .72, vh - tall - 30)));
    }
    cv.style.height = portrait ? ch + "px" : "";
    cv.width = Math.round(vw * dpr); cv.height = Math.round(ch * dpr);
    L = { vw: vw, vh: ch, dpr: dpr, portrait: portrait };
    draw(cur < 0 ? 0 : cur, true);
  }
  // ťažisko záberu (podiel šírky obrazu): na širokých záberoch stojí ihrisko vpravo, inak v strede
  function focus(i) {
    var w = i < 16 ? 1 : i < 27 ? 1 - (i - 16) / 11 : i < 163 ? 0 : i < 174 ? (i - 163) / 11 : 1;
    return .5 + .2 * w;
  }

  /* ---------- kreslenie ---------- */
  var grainPat = null;
  function grain() {
    if (grainPat) return grainPat;
    var g = document.createElement("canvas"), n = 160;
    g.width = g.height = n;
    var gx = g.getContext("2d"), d = gx.createImageData(n, n), a = d.data;
    for (var k = 0; k < a.length; k += 4) {
      var v = 128 + Math.round((Math.random() + Math.random() - 1) * 34);
      a[k] = a[k + 1] = a[k + 2] = v; a[k + 3] = 255;
    }
    gx.putImageData(d, 0, 0);
    return (grainPat = ctx.createPattern(g, "repeat"));
  }
  function draw(i, force) {
    if (!L) return;
    i = Math.max(0, Math.min(N - 1, i));
    if (i === cur && !force) return;
    var index = nearest(i);
    if (index < 0) return;
    var im = frames[index];
    cur = i;
    var vw = L.vw, vh = L.vh, s = Math.max(vw / IW, vh / IH), w = IW * s, h = IH * s;
    var v = vw / w, f = v > .999 ? .5 : Math.max(0, Math.min(1, (focus(i) - v / 2) / (1 - v)));
    ctx.setTransform(L.dpr, 0, 0, L.dpr, 0, 0);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(im, (vw - w) * f, (vh - h) / 2, w, h);
    // zrno: WebP zahodí šum renderu a na hladkých prechodoch vzniknú bloky; jemné zrno ich rozbije
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillStyle = grain(); ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.globalCompositeOperation = "source-over";
    // hysteréza: farba hlavičky sa pri stredných jasoch neprepína sem a tam
    dark = !PG.sheetOpen && (dark ? TOP[index] < 138 : TOP[index] < 118);
    hd.classList.toggle("dark", dark);
    if (!shown) { shown = true; gsap.to(cv, { opacity: 1, duration: .8, ease: "power2.out" }); }
  }

  /* ---------- kapitoly: rámik sa vykreslí a odkryje spolu s textom ---------- */
  var chs = gsap.utils.toArray(".ch").map(function (el) {
    return { el: el, from: +el.dataset.from, to: +el.dataset.to, tl: null, on: false };
  });
  var OPEN = "inset(0% 0% 0% 0%)";

  function split(c) {
    var opts = { type: "lines", linesClass: "ln", mask: "lines", autoSplit: true, ignore: ".w",
      onSplit: function () { if (c.on) settle(c); } };
    c.eb = SplitText.create(c.el.querySelector(".eb"), opts);
    c.h = SplitText.create(c.el.querySelector(".h"), opts);
    c.p = SplitText.create(c.el.querySelector(".p"), { type: "lines", linesClass: "pl", autoSplit: true,
      onSplit: function () { if (c.on) settle(c); } });
    c.acts = c.el.querySelectorAll(".acts > *");
    c.bg = c.el.querySelector(".bg");
    // rámik: štyri čiary (hore, vpravo, dole, vľavo), v pokoji ostré, bez SVG
    var e = c.el.querySelectorAll(".bd i");
    c.hx = [e[0], e[2]]; c.vy = [e[1], e[3]]; c.edges = e;
  }
  // po novom rozdelení riadkov (zmena šírky) ukáže aktívnu kapitolu v konečnom stave
  function settle(c) {
    if (c.tl) c.tl.progress(1);
    gsap.set([].concat(c.eb.lines, c.h.lines), { yPercent: 0 });
    gsap.set(c.p.lines, { autoAlpha: 1, y: 0 });
    gsap.set(c.bg, { clipPath: OPEN });
    gsap.set(c.hx, { scaleX: 1 }); gsap.set(c.vy, { scaleY: 1 });
  }

  function show(c, dir) {
    if (c.tl) c.tl.kill();
    c.on = true;
    gsap.set(c.el, { autoAlpha: 1 });
    var tl = c.tl = gsap.timeline();
    tl.fromTo(c.bg, { clipPath: dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }, { clipPath: OPEN, duration: .95, ease: "expo.out" }, 0)
      // obrys sa nakreslí dookola: hore, vpravo, dole, vľavo
      .fromTo(c.edges[0], { scaleX: 0 }, { scaleX: 1, duration: .42, ease: "power2.in" }, .02)
      .fromTo(c.edges[1], { scaleY: 0 }, { scaleY: 1, duration: .3, ease: "none" }, .44)
      .fromTo(c.edges[2], { scaleX: 0 }, { scaleX: 1, duration: .42, ease: "none" }, .74)
      .fromTo(c.edges[3], { scaleY: 0 }, { scaleY: 1, duration: .34, ease: "power2.out" }, 1.16)
      .fromTo(c.eb.lines, { yPercent: 105 * dir }, { yPercent: 0, duration: .7, ease: "expo.out" }, .22)
      .fromTo(c.h.lines, { yPercent: 112 * dir }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: .085 }, .28)
      .fromTo(c.p.lines, { autoAlpha: 0, y: 14 * dir }, { autoAlpha: 1, y: 0, duration: .8, ease: "power3.out", stagger: .045 }, .5);
    if (c.acts.length) tl.fromTo(c.acts, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .7, ease: "power3.out", stagger: .07 }, .7);
  }
  function hide(c, dir) {
    if (c.tl) c.tl.kill();
    c.on = false;
    var tl = c.tl = gsap.timeline({ onComplete: function () { gsap.set(c.el, { autoAlpha: 0 }); } });
    tl.to(c.h.lines, { yPercent: -112 * dir, duration: .42, ease: "power3.in", stagger: .03 }, 0)
      .to(c.eb.lines, { yPercent: -105 * dir, duration: .36, ease: "power3.in" }, 0)
      .to(c.p.lines, { autoAlpha: 0, y: -10 * dir, duration: .3, ease: "power2.in", stagger: .015 }, 0)
      .to(c.hx, { scaleX: 0, duration: .4, ease: "power2.in" }, 0)
      .to(c.vy, { scaleY: 0, duration: .4, ease: "power2.in" }, 0)
      .to(c.bg, { clipPath: dir > 0 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)", duration: .5, ease: "power3.in" }, .1);
    if (c.acts.length) tl.to(c.acts, { autoAlpha: 0, y: -8 * dir, duration: .28, ease: "power2.in" }, 0);
  }

  var active = -1, lastF = 0;
  function chapter(f) {
    var i = Math.round(f), idx = -1;
    for (var k = 0; k < chs.length; k++) if (i >= chs[k].from && i <= chs[k].to) { idx = k; break; }
    if (idx !== active) {
      var dir = f >= lastF ? 1 : -1;
      if (active >= 0) hide(chs[active], dir);
      if (idx >= 0) show(chs[idx], dir);
      active = idx;
    }
    lastF = f;
  }

  /* ---------- scroll ---------- */
  var state = { f: 0 };
  function build() {
    gsap.timeline({
      scrollTrigger: {
        trigger: "#story", start: "top top", pin: true, scrub: .25, anticipatePin: 1,
        end: function () { return "+=" + Math.round(stage.clientHeight * 5); },
        invalidateOnRefresh: true
      }
    })
    .to(state, { f: N - 1, ease: "none", duration: 1 })
    .to({}, { duration: .1 });
    // kreslenie a kapitoly mimo onUpdate: počas ScrollTrigger.refresh by GSAP nové tweeny kapitol vrátil späť
    gsap.ticker.add(function () {
      if (ScrollTrigger.isRefreshing) return;
      seek(Math.round(state.f));
      if (revealed) chapter(state.f);
    });
  }

  /* ---------- štart ---------- */
  var lastW = 0, lastH = 0;
  window.addEventListener("resize", function () {
    var w = stage.clientWidth, h = stage.clientHeight;
    if (w === lastW && Math.abs(h - lastH) < 2) return;
    lastW = w; lastH = h; layout();
  });
  PG.onMenuClose = function () { draw(cur, true); };
  // načítanie s logom počká na prvú snímku
  PG.hold = new Promise(function (r) { first = r; });
  PG.revealed.then(function () { revealed = true; });

  layout(); lastW = stage.clientWidth; lastH = stage.clientHeight;
  seek(0);
  document.fonts.ready.then(function () {
    chs.forEach(split);
    layout();
    build();
  });
})();
