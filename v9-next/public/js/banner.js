/* Banner pod hlavičkou (len úvod). Obsah nastavuje klient v admine, súbor /data/banner.json na serveri.
   Načíta sa za behu, bez buildu. Pri prvom scrolle zmizne, po návrate hore sa ukáže znova. */
(function () {
  var LANG = { cs: "cz" }[document.documentElement.lang] || document.documentElement.lang || "sk";

  fetch("/data/banner.json?t=" + Date.now(), { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (b) { if (b && b.on) show(b); })
    .catch(function () { /* bez banneru */ });

  /* tmavý alebo biely text podľa vyššieho kontrastu (WCAG): na červenej je tmavý ako tlačidlá webu */
  function light(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return false;
    var n = parseInt(m[1], 16);
    var L = [n >> 16, (n >> 8) & 255, n & 255].map(function (c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    var lum = 0.2126 * L[0] + 0.7152 * L[1] + 0.0722 * L[2];
    return (lum + 0.05) / 0.0565 >= 1.05 / (lum + 0.05); // 0.0565 = jas ink #141310 + 0.05
  }

  function show(b) {
    var text = (b.text && (b.text[LANG] || b.text.sk)) || "";
    var imgs = (b.images || []).filter(function (s) { return typeof s === "string" && s.indexOf("/data/") === 0; });
    if (!text && !imgs.length) return;
    var color = /^#[0-9a-f]{6}$/i.test(b.color || "") ? b.color : "#FF2712";

    var el = document.createElement("aside");
    el.className = "bn" + (imgs.length ? " bn--img" : "") + (light(color) ? "" : " bn--dark");
    el.style.setProperty("--bn", color);
    el.setAttribute("aria-label", text || "Banner");
    var p = document.createElement("p");
    p.className = "bn-t";
    p.textContent = text;
    el.appendChild(p);
    if (imgs.length) {
      var box = document.createElement("div");
      box.className = "bn-img";
      imgs.forEach(function (src, i) {
        var im = document.createElement("img");
        im.src = src; im.alt = ""; im.decoding = "async";
        if (i === 0) im.className = "on";
        box.appendChild(im);
      });
      el.appendChild(box);
      if (imgs.length > 1) {
        var k = 0, list = box.children;
        setInterval(function () {
          if (el.classList.contains("bn--off") || document.hidden) return;
          list[k].classList.remove("on");
          k = (k + 1) % list.length;
          list[k].classList.add("on");
        }, 4000);
      }
    }
    var hd = document.getElementById("hd");
    hd.parentNode.insertBefore(el, hd.nextSibling);
    requestAnimationFrame(function () { el.classList.add("bn--in"); });

    function onScroll() { el.classList.toggle("bn--off", window.scrollY > 4); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
