/* Kontakt: dopytový formulár. Pošle dopyt na /api/kontakt.php; ak server nie je dostupný, zloží e-mail a otvorí ho v pošte (mailto). Texty sú v KT podľa jazyka. */
(function () {
  var box = document.getElementById("f"), form = box.querySelector("form"), err = box.querySelector(".err");
  var other = document.getElementById("other"), otherTyp = document.getElementById("otherTyp"), planBox = document.getElementById("planFile"), file = form.elements.plan_file, fileMsg = box.querySelector(".file-msg");
  var body = "", fileBad = false;
  var reduce = false; /* Obmedziť pohyb sa ignoruje: animácie bežia vždy (rozhodnutie Patrika 2026-11-11) */

  // predvyplnenie z odkazu (kontakt.html?co=prerabka)
  var co = new URLSearchParams(location.search).get("co");
  // len známe hodnoty (písmená), iné by rozbili CSS selektor
  if (co && /^[a-z]{1,20}$/.test(co)) { var r = form.querySelector('input[name="co"][value="' + co + '"]'); if (r) r.checked = true; }

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
    reveal(otherTyp, (form.elements.typ.value || "") === "ine");
    reveal(planBox, (form.elements.plan.value || "") === "ano");
  }
  form.addEventListener("change", function (e) {
    if (e.target.name === "co" || e.target.name === "typ" || e.target.name === "plan") sync();
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
    // všetky chyby naraz: každé chybné pole sa zvýrazní, správy idú pod seba, fokus na prvé
    var bad = [], msgs = [];
    function mark(el, ok) { if (ok) el.removeAttribute("aria-invalid"); else { el.setAttribute("aria-invalid", "true"); bad.push(el); } return ok; }
    var otherIn = form.elements.co_ine, consent = form.elements.suhlas;
    if (!mark(otherIn, v("co") !== "ine" || !!v("co_ine"))) msgs.push(KT.errOther);
    var okName = mark(form.elements.meno, !!v("meno"));
    var okMail = mark(form.elements.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")));
    if (!okName || !okMail) msgs.push(KT.errContact);
    if (!mark(file, !(v("plan") === "ano" && fileBad))) msgs.push(fileMsg.textContent);
    if (!mark(consent, consent.checked)) msgs.push(KT.errConsent);
    if (bad.length) { err.textContent = msgs.join(" "); bad[0].focus(); return; }
    err.textContent = "";
    var none = KT.none, plan = v("plan") === "ano";
    var lines = [
      KT.mService + ": " + (lab("co") || none) + (v("co") === "ine" ? " (" + v("co_ine") + ")" : ""),
      KT.mType + ": " + (lab("typ") || none) + (v("typ") === "ine" && v("typ_ine") ? " (" + v("typ_ine") + ")" : ""),
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
    if (sb.disabled) return;
    sb.disabled = true;
    sb.classList.remove("fly"); void sb.offsetWidth; sb.classList.add("fly");

    // dopyt ide na server (/api/kontakt.php → e-mail firme); ak server zlyhá, otvorí sa e-mail ako doteraz
    var fd = new FormData();
    fd.append("lang", KT.lang); fd.append("meno", v("meno")); fd.append("email", v("email"));
    fd.append("predmet", KT.subject.replace("{name}", v("meno"))); fd.append("text", body);
    fd.append("web", v("web")); fd.append("t0", String(T0));
    if (plan && file.files && file.files[0]) fd.append("subor", file.files[0]);
    var wait = new Promise(function (r) { setTimeout(r, 750); });
    var send = fetch("/api/kontakt.php", { method: "POST", body: fd })
      .then(function (r) { return r.ok ? r.json() : { ok: false }; })
      .catch(function () { return { ok: false }; });
    Promise.all([send, wait]).then(function (res) {
      var ok = res[0] && res[0].ok;
      if (ok) {
        box.querySelector(".done .p").textContent = KT.sentText;
        box.querySelector(".done .acts").hidden = true;
      } else {
        location.href = href;
      }
      box.classList.add("sent");
      sb.classList.remove("fly");
      sb.disabled = false;
      var done = box.querySelector(".done");
      gsap.from(done.children, { autoAlpha: 0, y: 18, duration: .8, ease: "power3.out", stagger: .06 });
      done.focus({ preventScroll: true });
      ScrollTrigger.refresh();
    });
  });
  // ochrana proti robotom: skryté pole (vyplní ho len robot) a čas od načítania
  var T0 = Date.now();
  var hp = document.createElement("input");
  hp.type = "text"; hp.name = "web"; hp.tabIndex = -1; hp.autocomplete = "off"; hp.setAttribute("aria-hidden", "true");
  hp.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;opacity:0";
  form.appendChild(hp);
  function clearInvalid(e) { if (e.target.getAttribute("aria-invalid") === "true") e.target.removeAttribute("aria-invalid"); }
  form.addEventListener("input", clearInvalid);
  form.addEventListener("change", clearInvalid);
  document.getElementById("copy").addEventListener("click", function () {
    var b = this;
    navigator.clipboard.writeText(KT.to + ": info@play-ground.sk\n\n" + body).then(function () { b.textContent = KT.copied; });
  });
})();
