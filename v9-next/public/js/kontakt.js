/* Kontakt: dopytový formulár bez servera. Zloží e-mail a otvorí ho v pošte (mailto). Texty sú v KT podľa jazyka. */
(function () {
  var box = document.getElementById("f"), form = box.querySelector("form"), err = box.querySelector(".err");
  var other = document.getElementById("other"), planBox = document.getElementById("planFile"), file = form.elements.plan_file, fileMsg = box.querySelector(".file-msg");
  var body = "", fileBad = false;
  var reduce = false; /* Obmedziť pohyb sa ignoruje: animácie bežia vždy (rozhodnutie Patrika 2026-11-11) */

  // predvyplnenie z odkazu (kontakt.html?co=prerabka)
  var co = new URLSearchParams(location.search).get("co");
  if (co) { var r = form.querySelector('input[name="co"][value="' + co + '"]'); if (r) r.checked = true; }

  function reveal(el, on) {
    if (on === !el.hidden) return;
    if (on) {
      el.hidden = false;
      if (!reduce) gsap.fromTo(el, { height: 0, autoAlpha: 0 }, { height: "auto", autoAlpha: 1, duration: .45, ease: "power3.out", clearProps: "height" });
    } else if (reduce) el.hidden = true;
    else gsap.to(el, { height: 0, autoAlpha: 0, duration: .3, ease: "power2.in", onComplete: function () { el.hidden = true; gsap.set(el, { clearProps: "all" }); } });
  }
  function sync() {
    reveal(other, (form.elements.co.value || "") === "ine");
    reveal(planBox, (form.elements.plan.value || "") === "ano");
  }
  form.addEventListener("change", function (e) {
    if (e.target.name === "co" || e.target.name === "plan") sync();
    if (e.target === file) checkFile();
  });
  sync();

  var OK = /\.(pdf|png|jpe?g|dwg|dxf)$/i;
  function checkFile() {
    fileBad = false; fileMsg.textContent = ""; fileMsg.classList.remove("bad");
    var f = file.files && file.files[0];
    if (!f) return;
    if (!OK.test(f.name)) { fileBad = true; fileMsg.textContent = KT.errType; }
    else if (f.size > 10 * 1024 * 1024) { fileBad = true; fileMsg.textContent = KT.errSize; }
    else fileMsg.textContent = KT.chosen.replace("{name}", f.name);
    fileMsg.classList.toggle("bad", fileBad);
  }

  function v(n) { var el = form.elements[n]; return el ? (el.value || "").trim() : ""; }
  function lab(name) {
    var c = form.querySelector('input[name="' + name + '"]:checked');
    return c ? c.parentNode.querySelector("span").textContent.trim() : "";
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = [];
    ["meno", "email"].forEach(function (n) {
      var el = form.elements[n], ok = n === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()) : !!el.value.trim();
      el.setAttribute("aria-invalid", !ok);
      if (!ok) bad.push(el);
    });
    var otherIn = form.elements.co_ine;
    if (v("co") === "ine" && !v("co_ine")) { otherIn.setAttribute("aria-invalid", "true"); bad.push(otherIn); }
    if (bad.length) { err.textContent = bad[0] === otherIn ? KT.errOther : KT.errContact; bad[0].focus(); return; }
    if (v("plan") === "ano" && fileBad) { err.textContent = fileMsg.textContent; file.focus(); return; }
    if (!form.elements.suhlas.checked) { err.textContent = KT.errConsent; form.elements.suhlas.focus(); return; }
    err.textContent = "";
    var none = KT.none, plan = v("plan") === "ano";
    var lines = [
      KT.mService + ": " + (lab("co") || none) + (v("co") === "ine" ? " (" + v("co_ine") + ")" : ""),
      KT.mType + ": " + (lab("typ") || none),
      KT.mWhen + ": " + (lab("kedy") || none),
      KT.mPlan + ": " + (plan ? KT.planYes : v("plan") === "nie" ? KT.planNo : none),
      "", KT.mName + ": " + v("meno"), KT.mEmail + ": " + v("email"), KT.mPhone + ": " + (v("tel") || none), KT.mCity + ": " + (v("mesto") || none),
      "", v("sprava")
    ];
    body = lines.join("\n").trim();
    var href = "mailto:info@play-ground.sk?subject=" + encodeURIComponent(KT.subject.replace("{name}", v("meno"))) + "&body=" + encodeURIComponent(body);
    document.getElementById("mailGo").href = href;
    box.querySelector(".done .p").textContent = plan ? KT.doneTextPlan : KT.doneText;
    // odoslanie: šípka vyletí, tlačidlo sa stlačí a rozvlní, potom sa ukáže poďakovanie
    var sb = form.querySelector('button[type="submit"]');
    sb.classList.remove("fly"); void sb.offsetWidth; sb.classList.add("fly");
    setTimeout(function () {
      location.href = href;
      box.classList.add("sent");
      sb.classList.remove("fly");
      var done = box.querySelector(".done");
      gsap.from(done.children, { autoAlpha: 0, y: 18, duration: .8, ease: "power3.out", stagger: .06 });
      done.focus({ preventScroll: true });
      ScrollTrigger.refresh();
    }, 750);
  });
  form.addEventListener("input", function (e) { if (e.target.getAttribute("aria-invalid") === "true") e.target.removeAttribute("aria-invalid"); });
  document.getElementById("copy").addEventListener("click", function () {
    var b = this;
    navigator.clipboard.writeText(KT.to + ": info@play-ground.sk\n\n" + body).then(function () { b.textContent = KT.copied; });
  });
})();
