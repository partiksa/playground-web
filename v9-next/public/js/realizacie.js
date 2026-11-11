/* Realizácie: filter podľa typu, detail s galériou, otvorenie z odkazu (realizacie.html#slug) */
(function () {
  var ROOT = document.documentElement.dataset.root || "";
  var md = document.getElementById("md"), gal = md.querySelector(".md-gal"), root = document.documentElement;
  var el = { n: md.querySelector(".md-bar .n"), pl: md.querySelector(".md-txt .eb"), t: md.querySelector(".md-txt .h"), d: md.querySelector(".md-txt .p") };
  var PHOTO = md.dataset.photo || "fotka";
  var cur = -1, opener = null, open = false, tl;

  function fill(i) {
    var p = RZ[i]; cur = i;
    el.n.textContent = String(i + 1).padStart(2, "0") + " / " + RZ.length;
    el.pl.textContent = p.p + ", " + p.y;
    el.t.textContent = p.t;
    el.d.textContent = p.d;
    gal.innerHTML = p.f.map(function (f, k) {
      return '<figure style="aspect-ratio:' + f[1] + "/" + f[2] + '"><img src="' + ROOT + "rz/" + p.s + "/" + f[0] + '" alt="' + p.t + ", " + p.p + ", " + PHOTO + " " + (k + 1) +
        '" width="' + f[1] + '" height="' + f[2] + '"' + (k > 1 ? ' loading="lazy"' : "") + ' decoding="async"></figure>';
    }).join("");
    gal.scrollLeft = 0; md.scrollTop = 0;
    if (gal._upd) setTimeout(gal._upd, 60);
  }
  function enter() {
    var items = [el.pl, el.t, el.d], figs = gal.querySelectorAll("figure");
    gsap.fromTo(items, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .8, ease: "power3.out", stagger: .06, delay: .15 });
    gsap.fromTo(figs, { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: .46, ease: "power3.out", stagger: .035 });
  }
  function show(i, btn) {
    opener = btn || opener; fill(i);
    history.replaceState(null, "", "#" + RZ[i].s);
    if (open) { enter(); return; }
    open = true; root.style.overflow = "hidden";
    md.setAttribute("aria-hidden", "false");
    if (tl) tl.kill();
    gsap.set(md, { visibility: "visible" });
    tl = gsap.timeline()
      .fromTo(md, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .52, ease: "power3.out" });
    enter();
    md.querySelector(".md-x").focus({ preventScroll: true });
  }
  function hide() {
    if (!open) return;
    open = false;
    md.setAttribute("aria-hidden", "true");
    history.replaceState(null, "", location.pathname + location.search);
    if (tl) tl.kill();
    tl = gsap.timeline({ onComplete: function () { root.style.overflow = ""; } })
      .to(md, { clipPath: "inset(0% 0% 100% 0%)", duration: .6, ease: "power3.inOut" })
      .set(md, { visibility: "hidden" });
    if (opener) opener.focus({ preventScroll: true });
  }
  function step(d) { var i = (cur + d + RZ.length) % RZ.length; gsap.to([el.pl, el.t, el.d, gal], { autoAlpha: 0, duration: .2, onComplete: function () { gsap.set(gal, { autoAlpha: 1 }); show(i); } }); }

  document.querySelectorAll(".rz-card").forEach(function (b) { b.addEventListener("click", function () { show(+b.dataset.i, b); }); });
  md.querySelector(".md-x").addEventListener("click", hide);
  md.querySelector(".md-prev").addEventListener("click", function () { step(-1); });
  md.querySelector(".md-next").addEventListener("click", function () { step(1); });
  document.addEventListener("keydown", function (e) {
    if (!open) return;
    if (e.key === "Escape") { hide(); return; }
    var inGal = e.target.closest && e.target.closest(".md-gal");
    if (e.key === "ArrowRight" && !inGal) step(1);
    else if (e.key === "ArrowLeft" && !inGal) step(-1);
    else if (e.key === "Tab") {
      // fokus ostáva v detaile
      var f = md.querySelectorAll("button, [href]"), a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });
  hscroll(gal, md.querySelector(".md-gw .hs-ar"), true);
  document.querySelectorAll(".hs").forEach(function (h) { hscroll(h.querySelector(".hs-track"), h.querySelector(".hs-ar"), false); });

  // odkaz z inej stránky otvorí konkrétnu realizáciu
  var hashIdx = RZ.findIndex(function (p) { return "#" + p.s === location.hash; });
  if (hashIdx >= 0) PG.revealed.then(function () {
    var card = document.querySelector('.rz-card[data-i="' + hashIdx + '"]');
    setTimeout(function () { show(hashIdx, card); }, 350);
  });

  /* ---------- posúvanie do strany: šípka, ťahanie myšou, koliesko (len galéria), jemné prichytenie ---------- */
  function hscroll(tr, ar, wheel) {
    if (!tr) return;
    var narrow = function () { return wheel && matchMedia("(max-width: 980px)").matches; };
    function items() { return [].slice.call(tr.children); }
    function snapTo() {
      // jemné prichytenie: k najbližšej položke, len ak je blízko (do 18 % jej šírky)
      var best = null, bd = Infinity, L = tr.getBoundingClientRect().left;
      items().forEach(function (it) { var d = it.getBoundingClientRect().left - L; if (Math.abs(d) < Math.abs(bd)) { bd = d; best = it; } });
      if (best && Math.abs(bd) > 2 && Math.abs(bd) < best.offsetWidth * .18) tr.scrollTo({ left: tr.scrollLeft + bd, behavior: "smooth" });
    }
    var st;
    function settle() { clearTimeout(st); st = setTimeout(function () { if (!down) snapTo(); upd(); }, 140); }
    function upd() {
      if (!ar) return;
      var end = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4;
      ar.classList.toggle("back", end);
      ar.hidden = tr.scrollWidth <= tr.clientWidth + 4 || narrow();
    }
    if (ar) ar.addEventListener("click", function () {
      if (ar.classList.contains("back")) { tr.scrollTo({ left: 0, behavior: "smooth" }); return; }
      var L = tr.getBoundingClientRect().left, nx = items().find(function (it) { return it.getBoundingClientRect().left - L > 8; });
      tr.scrollTo({ left: nx ? tr.scrollLeft + nx.getBoundingClientRect().left - L : tr.scrollWidth, behavior: "smooth" });
    });
    // ťahanie myšou (dotyk posúva natívne)
    var down = false, moved = 0, sx = 0, sl = 0, vx = 0, lx = 0, lt = 0;
    tr.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0 || narrow()) return;
      down = true; moved = 0; sx = lx = e.clientX; sl = tr.scrollLeft; vx = 0; lt = performance.now();
      tr.classList.add("drag");
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var now = performance.now(); vx = (e.clientX - lx) / Math.max(8, now - lt); lx = e.clientX; lt = now;
      moved = Math.max(moved, Math.abs(e.clientX - sx));
      tr.scrollLeft = sl - (e.clientX - sx);
    });
    window.addEventListener("pointerup", function () {
      if (!down) return; down = false; tr.classList.remove("drag");
      // dobeh po pustení, potom jemné prichytenie
      var v = -vx * 16;
      (function glide() { if (Math.abs(v) < .5) { settle(); return; } tr.scrollLeft += v; v *= .92; requestAnimationFrame(glide); })();
    });
    // po ťahaní neotvárať kartu
    tr.addEventListener("click", function (e) { if (moved > 6) { e.stopPropagation(); e.preventDefault(); moved = 0; } }, true);
    tr.addEventListener("dragstart", function (e) { e.preventDefault(); });
    if (wheel) tr.addEventListener("wheel", function (e) {
      if (narrow() || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault(); tr.scrollLeft += e.deltaY;
    }, { passive: false });
    tr.addEventListener("scroll", settle, { passive: true });
    window.addEventListener("resize", upd);
    upd();
    tr._upd = upd;
  }
})();
