/* PLAYGROUND v9: spoločné správanie (načítanie, hlavička, menu, animácie, depth fotky, pätička) */
(function () {
  "use strict";
  gsap.registerPlugin(ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });

  var root = document.documentElement, body = document.body, hd = document.getElementById("hd");
  var reduce = false; /* Obmedziť pohyb sa ignoruje: animácie bežia vždy (rozhodnutie Patrika 2026-11-11) */
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var home = !!document.getElementById("story");
  var revealDone;
  // PG: rozhranie pre skript stránky. hold: Promise, na ktorú načítanie počká (napr. prvá snímka).
  var PG = window.PG = {
    sheetOpen: false, hold: null, onMenuClose: null,
    revealed: new Promise(function (r) { revealDone = r; })
  };

  /* ---------- načítanie (z v9-next): červená plocha, logo sa napíše, chvíľu ostane, potom ide do hlavičky ---------- */
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function loader() {
    var ld = document.getElementById("ld");
    // po 5 s by poistka v CSS načítanie už skryla, preto sa vtedy nespúšťa
    if (!ld || !root.classList.contains("ld-on") || !window.PGwriteLogo || performance.now() > 5000) {
      if (ld) ld.remove(); root.classList.remove("ld-on"); revealDone(); return;
    }
    root.classList.add("ld-run");
    try { sessionStorage.setItem("pg-ld", "1"); } catch (e) {}
    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      root.classList.remove("ld-on", "ld-run");
      root.style.overflow = "";
      ld.remove();
      revealDone();
    }
    // poistka: nech sa stane čokoľvek, stránka sa odkryje
    var safety = setTimeout(finish, 9000);
    var box = ld.querySelector(".ld-logo"), bg = ld.querySelector(".ld-bg"), target = hd.querySelector(".logo");
    root.style.overflow = "hidden";
    var write = window.PGwriteLogo(box);
    write(1300).then(function () { return wait(1000); }).then(function () {
      // PG.hold nastaví skript stránky až po site.js, preto sa číta až po napísaní loga
      return Promise.race([Promise.all([document.fonts.ready, PG.hold]), wait(2500)]);
    }).then(function () {
      var a = box.getBoundingClientRect(), b = target.getBoundingClientRect();
      var color = getComputedStyle(hd).color;
      root.style.overflow = "";
      gsap.timeline({ delay: .1, onComplete: function () { clearTimeout(safety); finish(); } })
        .to(box, { x: b.left - a.left, y: b.top - a.top, scale: b.width / a.width, transformOrigin: "0 0",
                   color: color, duration: 1.15, ease: "expo.inOut" }, 0)
        .fromTo(bg, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "power4.inOut" }, .2)
        .add(revealDone, .55);
    }).catch(function () { clearTimeout(safety); finish(); });
  }

  /* ---------- hlavička ---------- */
  function header() {
    PG.revealed.then(function () {
      var items = gsap.utils.toArray(hd.children).filter(function (el) { return !el.classList.contains("logo"); });
      gsap.from(items, { autoAlpha: 0, y: -10, duration: .8, ease: "power3.out", stagger: .05 });
    });
    // podstránky: pri posune dole sa skryje, pri posune hore vráti s podkladom.
    // úvod: počas príbehu (video) je priehľadná a stále viditeľná, za ním sa správa ako na podstránkach.
    var away = false, story = document.getElementById("story"), limit = 0;
    function set(hide) {
      if (hide === away) return;
      away = hide;
      gsap.to(hd, { yPercent: hide ? -110 : 0, duration: .5, ease: hide ? "power3.inOut" : "power3.out", overwrite: true });
    }
    function measure() {
      if (!home || !story) { limit = 8; return; }
      var sp = story.parentElement.classList.contains("pin-spacer") ? story.parentElement : story;
      limit = sp.offsetTop + sp.offsetHeight - hd.offsetHeight;
    }
    measure();
    ScrollTrigger.addEventListener("refresh", measure);
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: function (st) {
      var y = st.scroll(), past = y > limit;
      hd.classList.toggle("solid", past);
      if (past && home) hd.classList.remove("dark");
      if (PG.sheetOpen || y < limit + 160) set(false);
      else if (st.direction === 1) set(true);
      else if (st.direction === -1) set(false);
    } });
  }

  /* ---------- menu ---------- */
  function menu() {
    var sheet = document.getElementById("sheet"), btn = document.getElementById("menuBtn"), tl;
    if (!sheet || !btn) return;
    function setSheet(open) {
      PG.sheetOpen = open;
      btn.setAttribute("aria-expanded", open);
      btn.textContent = open ? (btn.dataset.close || "Zavrieť") : (btn.dataset.open || "Menu");
      sheet.setAttribute("aria-hidden", !open);
      if (tl) tl.kill();
      var links = sheet.querySelectorAll(".m-ln a"), meta = sheet.querySelectorAll(".meta a");
      if (open) {
        hd.classList.remove("dark");
        gsap.to(hd, { yPercent: 0, duration: .3, overwrite: true });
        tl = gsap.timeline()
          .set(sheet, { visibility: "visible" })
          .fromTo(sheet, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .6, ease: "expo.out" })
          .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: .7, ease: "expo.out", stagger: .045 }, .12)
          .fromTo(meta, { autoAlpha: 0 }, { autoAlpha: 1, duration: .5 }, .35);
      } else {
        tl = gsap.timeline()
          .fromTo(sheet, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 100% 0%)", duration: .45, ease: "power3.in" })
          .set(sheet, { visibility: "hidden" });
        if (PG.onMenuClose) PG.onMenuClose();
      }
    }
    btn.addEventListener("click", function () { setSheet(!PG.sheetOpen); });
    sheet.addEventListener("click", function (e) { if (e.target.closest("a")) setSheet(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && PG.sheetOpen) setSheet(false); });
  }

  /* ---------- animácie pri zobrazení ---------- */
  function reveals() {
    // nadpisy po riadkoch; Slinkee slová (.w) idú s riadkom
    gsap.utils.toArray("[data-split]").forEach(function (el) {
      var now = el.dataset.split === "now";
      SplitText.create(el, {
        type: "lines", linesClass: "ln", mask: "lines", autoSplit: true, ignore: ".w",
        onSplit: function (self) {
          var vars = { yPercent: 112, duration: 1.1, ease: "expo.out", stagger: .09 };
          if (now) { vars.paused = true; var tw = gsap.from(self.lines, vars); PG.revealed.then(function () { tw.play(); }); return tw; }
          vars.scrollTrigger = { trigger: el, start: "top 88%", once: true };
          return gsap.from(self.lines, vars);
        }
      });
    });
    // odseky a bloky
    gsap.utils.toArray(".rv").forEach(function (el) {
      var now = el.hasAttribute("data-now");
      var vars = { autoAlpha: 0, y: 22, duration: 1, ease: "power3.out", delay: +(el.dataset.d || 0) };
      if (now) { vars.paused = true; var tw = gsap.from(el, vars); PG.revealed.then(function () { tw.delay(.25 + vars.delay).play(); }); }
      else { vars.scrollTrigger = { trigger: el, start: "top 90%", once: true }; gsap.from(el, vars); }
    });
    // riadky: čiara sa nakreslí zľava, potom text
    gsap.utils.toArray(".rows, .faq").forEach(function (list) {
      var rows = list.querySelectorAll(".row, .qa");
      gsap.set(rows, { "--s": 0 });
      ScrollTrigger.batch(rows, { start: "top 92%", once: true, onEnter: function (els) {
        gsap.to(els, { "--s": 1, duration: 1.3, ease: "expo.out", stagger: .08 });
        gsap.from(els.map(function (r) { return r.children; }).reduce(function (a, c) { return a.concat([].slice.call(c)); }, []),
          { autoAlpha: 0, y: 16, duration: .9, ease: "power3.out", stagger: .03, delay: .1 });
      } });
    });
    // skupiny (karty, zoznamy, čísla): prvky prichádzajú postupne
    gsap.utils.toArray(".stg").forEach(function (list) {
      gsap.from(list.children, { autoAlpha: 0, y: 26, duration: .9, ease: "power3.out", stagger: .08,
        scrollTrigger: { trigger: list, start: "top 88%", once: true } });
    });
    // veľké slová (krajiny): vychádzajú z masky po jednom
    gsap.utils.toArray(".words").forEach(function (list) {
      gsap.from(list.querySelectorAll("span"), { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: .07,
        scrollTrigger: { trigger: list, start: "top 85%", once: true } });
    });
    // fotky: odkrytie zdola
    gsap.utils.toArray(".dp.wipe").forEach(function (el) {
      gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .58, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 96%", once: true } });
    });
    // čísla
    gsap.utils.toArray("[data-count]").forEach(function (el) {
      var end = +el.dataset.count, o = { v: 0 }, suf = el.dataset.suf || "";
      el.textContent = "0" + suf;
      gsap.to(o, { v: end, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: function () { el.textContent = Math.round(o.v) + suf; } });
    });
  }

  /* ---------- časté otázky: plynulé rozbalenie ---------- */
  function faq() {
    gsap.utils.toArray(".qa").forEach(function (d) {
      var sum = d.querySelector("summary"), a = d.querySelector(".a");
      sum.addEventListener("click", function (e) {
        if (reduce) return;
        e.preventDefault();
        gsap.killTweensOf(a);
        if (!d.open) {
          d.open = true;
          gsap.fromTo(a, { height: 0, autoAlpha: 0 }, { height: "auto", autoAlpha: 1, duration: .55, ease: "power3.out", clearProps: "height" });
        } else {
          gsap.to(a, { height: 0, autoAlpha: 0, duration: .4, ease: "power3.inOut", onComplete: function () { d.open = false; gsap.set(a, { clearProps: "all" }); ScrollTrigger.refresh(); } });
        }
      });
      d.addEventListener("toggle", function () { if (d.open) ScrollTrigger.refresh(); });
    });
  }

  /* ---------- fotky s depth mapou (WebGL) ---------- */
  var VS = "attribute vec2 p; varying vec2 uv; void main(){ uv = p * .5 + .5; uv.y = 1. - uv.y; gl_Position = vec4(p, 0., 1.); }";
  var FS = [
    "precision highp float;",
    "varying vec2 uv; uniform sampler2D img, dep; uniform vec2 res, size, mouse; uniform float t;",
    "void main(){",
    // cover: obrázok vyplní plochu
    "  float ra = res.x / res.y, ia = size.x / size.y;",
    "  vec2 s = ra > ia ? vec2(1., ia / ra) : vec2(ra / ia, 1.);",
    "  vec2 c = vec2(.5), q = (uv - c) * s;",
    // t: 0 keď fotka vchádza zdola, 1 keď odchádza hore. Kamera ide dovnútra, bližšie veci rastú rýchlejšie.
    "  float base = 1.09 + .03 * t;",
    "  vec2 st = c + q / base;",
    "  for (int i = 0; i < 3; i++) {",
    "    float d = texture2D(dep, st).r;",
    "    st = c + q / (base + t * .09 * d) + vec2(0., (t - .5) * (d - .5) * .05) + mouse * (d - .5) * .022;",
    "  }",
    "  gl_FragColor = texture2D(img, clamp(st, .001, .999));",
    "}"].join("\n");

  var mouse = [0, 0], depths = [], live = 0, MAXGL = 10;
  function Depth(el) { this.el = el; this.m = [0, 0]; this.t = -1; this.gl = null; this.on = false; }
  Depth.prototype.start = function () {
    if (this.on || live >= MAXGL) return;
    this.on = true; live++;
    var self = this, el = this.el, im = el.querySelector("img");
    var cv = this.cv = document.createElement("canvas");
    cv.setAttribute("aria-hidden", "true");
    var gl = this.gl = cv.getContext("webgl", { alpha: false, antialias: false, preserveDrawingBuffer: false });
    if (!gl) { this.stop(); return; }
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { this.stop(); return; }
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {};
    ["res", "size", "mouse", "t", "img", "dep"].forEach(function (n) { self.u[n] = gl.getUniformLocation(pr, n); });
    gl.uniform1i(this.u.img, 0); gl.uniform1i(this.u.dep, 1);
    function load(src) {
      return new Promise(function (ok, bad) { var i = new Image(); i.decoding = "async"; i.onload = function () { ok(i); }; i.onerror = bad; i.src = src; });
    }
    var token = this.token = {};
    Promise.all([load(im.currentSrc || im.src), load(el.dataset.depth)]).then(function (r) {
      if (self.token !== token || !self.gl) return;
      [r[0], r[1]].forEach(function (img, k) {
        var tx = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + k); gl.bindTexture(gl.TEXTURE_2D, tx);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      });
      gl.uniform2f(self.u.size, r[0].naturalWidth, r[0].naturalHeight);
      el.appendChild(cv);
      self.ready = true; self.t = -1;
      self.frame(true);
      requestAnimationFrame(function () { el.classList.add("gl"); });
    }).catch(function () { self.stop(); });
  };
  Depth.prototype.stop = function () {
    if (!this.on) return;
    this.on = false; this.ready = false; live--; this.token = null;
    this.el.classList.remove("gl");
    if (this.gl) { var ext = this.gl.getExtension("WEBGL_lose_context"); if (ext) ext.loseContext(); }
    if (this.cv) this.cv.remove();
    this.gl = this.cv = null;
  };
  Depth.prototype.frame = function (force) {
    if (!this.ready) return;
    var r = this.el.getBoundingClientRect(), vh = innerHeight;
    var t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    this.m[0] += (mouse[0] - this.m[0]) * .08; this.m[1] += (mouse[1] - this.m[1]) * .08;
    var dpr = Math.min(devicePixelRatio || 1, 1.75), w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
    var moved = Math.abs(t - this.t) > .0005 || Math.abs(this.m[0] - this.pm0) > .0004 || Math.abs(this.m[1] - this.pm1) > .0004;
    if (!force && !moved && w === this.cv.width && h === this.cv.height) return;
    if (w !== this.cv.width || h !== this.cv.height) { this.cv.width = w; this.cv.height = h; }
    var gl = this.gl;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(this.u.res, w, h);
    gl.uniform1f(this.u.t, t);
    gl.uniform2f(this.u.mouse, this.m[0], this.m[1]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.t = t; this.pm0 = this.m[0]; this.pm1 = this.m[1];
  };

  function depth() {
    var els = document.querySelectorAll(".dp[data-depth]");
    if (!els.length || reduce || !window.WebGLRenderingContext) return;
    depths = [].map.call(els, function (el) { return new Depth(el); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var d = depths[[].indexOf.call(els, e.target)];
        if (e.isIntersecting) d.start(); else d.stop();
      });
    }, { rootMargin: "25% 0px 25% 0px" });
    [].forEach.call(els, function (el) { io.observe(el); });
    if (fine) window.addEventListener("pointermove", function (e) {
      mouse[0] = e.clientX / innerWidth - .5; mouse[1] = e.clientY / innerHeight - .5;
    }, { passive: true });
    gsap.ticker.add(function () { for (var i = 0; i < depths.length; i++) if (depths[i].ready) depths[i].frame(false); });
    PG.depth = depths;
  }

  /* ---------- pätička ---------- */
  function footer() {
    var cols = gsap.utils.toArray(".ft-top > div");
    gsap.from(cols, { autoAlpha: 0, y: 24, duration: .9, ease: "power3.out", stagger: .08,
      scrollTrigger: { trigger: ".ft", start: "top 85%", once: true } });
    gsap.from(".ft-word", { yPercent: 105, duration: 1.1, ease: "expo.out",
      scrollTrigger: { trigger: ".ft-big", start: "top 95%", once: true } });
  }

  /* ---------- prechod medzi stránkami ---------- */
  function transitions() {
    if (reduce) return;
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target || a.hasAttribute("download") || a.origin !== location.origin) return;
      if (a.pathname === location.pathname && a.hash) return;
      if (!/\.html$|\/$/.test(a.pathname)) return;
      e.preventDefault();
      body.classList.add("leaving");
      setTimeout(function () { location.href = a.href; }, 280);
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) body.classList.remove("leaving"); });
  }

  /* ---------- štart ---------- */
  loader();
  menu();
  transitions();
  document.fonts.ready.then(function () {
    body.classList.add("ready");
    header();
    reveals();
    faq();
    depth();
    footer();
  });
})();
