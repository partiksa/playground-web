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
  // koliesko myši posúva galériu do strany
  gal.addEventListener("wheel", function (e) {
    if (matchMedia("(max-width: 980px)").matches || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault(); gal.scrollLeft += e.deltaY;
  }, { passive: false });

  // odkaz z inej stránky otvorí konkrétnu realizáciu
  var hashIdx = RZ.findIndex(function (p) { return "#" + p.s === location.hash; });
  if (hashIdx >= 0) PG.revealed.then(function () {
    var card = document.querySelector('.rz-card[data-i="' + hashIdx + '"]');
    setTimeout(function () { show(hashIdx, card); }, 350);
  });

  /* ---------- filter: karty odídu a vrátia sa v novom poradí veľká a malá ---------- */
  var items = [].slice.call(document.querySelectorAll(".rz-list > .rz"));
  var btns = [].slice.call(document.querySelectorAll(".flt button"));
  function layoutPattern(list) {
    list.forEach(function (li, k) {
      var big = (Math.floor(k / 2) % 2 === 0) === (k % 2 === 0);
      li.classList.toggle("big", big); li.classList.toggle("small", !big);
    });
  }
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.getAttribute("aria-pressed") === "true") return;
      btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      var f = b.dataset.f, show = items.filter(function (li) { return f === "all" || li.dataset.g === f; });
      var visible = items.filter(function (li) { return li.style.display !== "none"; });
      gsap.to(visible, { autoAlpha: 0, y: 16, duration: .25, ease: "power2.in", stagger: .02, overwrite: true, onComplete: done });
      var finished = false;
      function done() {
        if (finished) return; finished = true;
        items.forEach(function (li) { li.style.display = show.indexOf(li) >= 0 ? "" : "none"; });
        layoutPattern(show);
        ScrollTrigger.refresh();
        // kratší zoznam: vrátiť sa k filtru, aby karty neboli mimo obrazovky
        var top = document.querySelector(".flt").getBoundingClientRect().top + scrollY - 120;
        if (scrollY > top) scrollTo({ top: top, behavior: "smooth" });
        gsap.fromTo(show, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: .8, ease: "power3.out", stagger: .06, overwrite: true });
        var cnt = document.querySelector(".flt-n");
        if (cnt) cnt.textContent = show.length;
      }
      if (!visible.length) done();
    });
  });
})();
