/* Ihriská na mieru: výsek 3D vizualizácie */
(function () {
  // výsek 3D vizualizácie: 24 snímok, pri pohybe myši sa ihrisko jemne otočí; na dotyku podľa scrollu
  var N = 24, MID = (N - 1) / 2, box = document.querySelector(".v3d-in"), cv = box.querySelector("canvas"), ctx = cv.getContext("2d");
  var fr = [], cur = MID, goal = MID, drawn = -1;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  for (var i = 0; i < N; i++) (function (i) {
    var im = new Image(); im.decoding = "async";
    im.onload = function () { fr[i] = im; if (Math.round(cur) === i) drawn = -1; };
    im.src = (document.documentElement.dataset.root || "") + "360/r" + String(i).padStart(2, "0") + ".webp";
  })(i);
  function size() { var r = box.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); drawn = -1; }
  function draw() {
    var k = Math.round(cur), im = fr[k];
    if (!im || k === drawn) return;
    var s = Math.max(cv.width / im.naturalWidth, cv.height / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.drawImage(im, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
    drawn = k;
  }
  if (fine) {
    box.addEventListener("pointermove", function (e) {
      var r = box.getBoundingClientRect();
      goal = MID + ((e.clientX - r.left) / r.width - .5) * (N - 1);
    });
    box.addEventListener("pointerleave", function () { goal = MID; });
  } else {
    ScrollTrigger.create({ trigger: box, start: "top bottom", end: "bottom top", onUpdate: function (st) { goal = st.progress * (N - 1); } });
  }
  gsap.ticker.add(function () {
    cur += (goal - cur) * .09;
    cur = Math.max(0, Math.min(N - 1, cur));
    draw();
  });
  window.addEventListener("resize", size);
  size();
  var wipe = gsap.fromTo(box, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", paused: true });
  PG.revealed.then(function () { wipe.delay(.2).play(); });
})();
