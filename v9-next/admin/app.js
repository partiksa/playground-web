/* Admin PLAYGROUND: realizácie a banner. Bez knižníc; DOM sa skladá cez h(), texty od klienta idú cez textContent. */
(function () {
  "use strict";
  var LANGS = [["cz", "Čeština"], ["en", "Angličtina"], ["de", "Nemčina"]];
  var GROUPS = [["nove", "Nové ihriská"], ["prerabka", "Prerábky a sťahovanie"], ["obnova", "Obnovy a doplnky"]];
  var FIELDS = [["t", "Názov", 160], ["p", "Miesto", 160], ["y", "Druh práce", 160], ["d", "Popis", 2000]];
  var COLORS = [["#FF2712", "Červená"], ["#141310", "Tmavá"], ["#DEDDDB", "Papier"]];
  var FEATURED = 6; // toľko realizácií je na webe hore vo veľkom zozname

  /* ---------- prihlásenie ---------- */
  var login = document.getElementById("login");
  if (login) {
    login.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = login.querySelector(".err"), btn = login.querySelector("button");
      btn.disabled = true; err.textContent = "";
      post("login", { password: login.password.value }).then(function () { location.reload(); })
        .catch(function (x) { err.textContent = x.message; btn.disabled = false; login.password.select(); });
    });
    return;
  }

  var app = document.getElementById("app"), CSRF = app.dataset.csrf;
  var S = { items: [], banner: null, deepl: false, tab: "rz", edit: null, busy: 0 };

  /* ---------- pomocné ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    for (var k in attrs || {}) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "text") el.textContent = v;
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
      else if (k === "cls") el.className = v;
      else if (k === "bg") el.style.background = v; // CSP nepovoľuje atribút style
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      (Array.isArray(c) ? c : [c]).forEach(function (x) { if (x != null && x !== false) el.appendChild(typeof x === "string" ? document.createTextNode(x) : x); });
    }
    return el;
  }
  function post(a, body, form) {
    return fetch("api.php?a=" + a, {
      method: "POST", credentials: "same-origin",
      headers: form ? { "X-CSRF": CSRF || "" } : { "Content-Type": "application/json", "X-CSRF": CSRF || "" },
      body: form ? body : JSON.stringify(body || {}),
    }).then(function (r) {
      return r.json().catch(function () { return { error: "Chyba servera (" + r.status + ")." }; }).then(function (d) {
        if (r.status === 401 && a !== "login") { location.reload(); }
        if (!r.ok || d.error) throw new Error(d.error || "Chyba " + r.status);
        return d;
      });
    });
  }
  var toastT;
  function toast(msg, bad) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.className = "toast on" + (bad ? " bad" : "");
    clearTimeout(toastT); toastT = setTimeout(function () { t.className = "toast"; }, bad ? 7000 : 3500);
  }
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function src(p) { return "/" + String(p).replace(/^\//, ""); }
  function groupName(g) { var x = GROUPS.find(function (y) { return y[0] === g; }); return x ? x[1] : g; }
  function warnMissing(list) {
    if (list && list.length) toast("Preklad sa nepodaril (" + list.join(", ").toUpperCase() + "). Ostal slovenský text, skúste „Preložiť znova“.", true);
  }
  function move(arr, i, d) { var j = i + d; if (j < 0 || j >= arr.length) return; var x = arr[i]; arr[i] = arr[j]; arr[j] = x; }

  /* fotku zmenší v prehliadači (max 2000 px, JPEG), aby sa nahrávala rýchlo aj z mobilu */
  function shrink(file) {
    return createImageBitmap(file, { imageOrientation: "from-image" }).then(function (bmp) {
      var k = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
      var c = document.createElement("canvas");
      c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
      return new Promise(function (ok, bad) { c.toBlob(function (b) { b ? ok(b) : bad(new Error("x")); }, "image/jpeg", 0.86); });
    }).catch(function () { throw new Error("Fotku „" + file.name + "“ sa nepodarilo načítať. Uložte ju ako JPG a skúste znova."); });
  }
  function upload(files, kind, onDone) {
    var list = Array.prototype.slice.call(files);
    S.busy += list.length; render();
    return list.reduce(function (p, f) {
      return p.then(function () {
        return shrink(f).then(function (blob) {
          var fd = new FormData();
          fd.append("kind", kind); fd.append("file", blob, "foto.jpg");
          return post("upload", fd, true);
        }).then(function (d) { onDone(d.path); }).catch(function (e) { toast(e.message, true); })
          .then(function () { S.busy--; render(); });
      });
    }, Promise.resolve());
  }
  function photoInput(label, kind, onDone) {
    var inp = h("input", { type: "file", accept: "image/*", multiple: true, hidden: true, onchange: function () { upload(inp.files, kind, onDone); inp.value = ""; } });
    return h("label", { cls: "btn" }, label, inp);
  }

  /* ---------- prepínanie kariet ---------- */
  document.querySelectorAll("[data-tab]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (S.edit && S.edit._dirty && !confirm("Zahodiť neuložené zmeny?")) return;
      S.tab = b.dataset.tab; S.edit = null; render();
    });
  });
  document.getElementById("logout").addEventListener("click", function () { post("logout").then(function () { location.reload(); }); });
  window.addEventListener("beforeunload", function (e) { if (S.edit && S.edit._dirty) { e.preventDefault(); e.returnValue = ""; } });

  function render() {
    document.querySelectorAll("[data-tab]").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.tab === S.tab)); });
    app.replaceChildren(S.tab === "bn" ? viewBanner() : S.edit ? viewEdit() : viewList());
  }

  /* ---------- zoznam realizácií ---------- */
  function viewList() {
    var notes = [h("p", { cls: "note", text: "Zmeny v realizáciách sa na webe ukážu samy do 2 až 3 minút po uložení." })];
    if (!S.deepl) notes.push(h("p", { cls: "note warn", text: "Automatický preklad nie je nastavený. CZ, EN a DE dostanú slovenský text." }));
    return h("section", { cls: "wrap" },
      h("div", { cls: "bar" }, h("h1", { text: "Realizácie" }), h("span", { cls: "count", text: S.items.length + "" }),
        h("button", { cls: "btn btn--red", onclick: function () { S.edit = newItem(); render(); } }, "Pridať realizáciu")),
      notes,
      h("ol", { cls: "list" }, S.items.map(function (r, i) {
        return h("li", { cls: "row" + (i < FEATURED ? " feat" : "") },
          h("img", { src: src(r.cover), alt: "", loading: "lazy" }),
          h("div", { cls: "meta" },
            h("b", { text: r.sk.t }),
            h("span", { text: [r.sk.p, groupName(r.group)].filter(Boolean).join(" · ") }),
            i < FEATURED ? h("em", { text: "Na webe hore" }) : null),
          h("div", { cls: "acts" },
            h("button", { cls: "ic", title: "Vyššie", "aria-label": "Posunúť vyššie", disabled: i === 0, onclick: function () { reorder(i, -1); } }, "↑"),
            h("button", { cls: "ic", title: "Nižšie", "aria-label": "Posunúť nižšie", disabled: i === S.items.length - 1, onclick: function () { reorder(i, 1); } }, "↓"),
            h("button", { cls: "btn", onclick: function () { S.edit = clone(r); S.edit.manual = S.edit.manual || {}; render(); } }, "Upraviť"),
            h("button", { cls: "link danger", onclick: function () { del(r); } }, "Zmazať")));
      })));
  }
  function reorder(i, d) {
    move(S.items, i, d); render();
    post("reorder", { slugs: S.items.map(function (r) { return r.slug; }) }).catch(function (e) { toast(e.message, true); load(); });
  }
  function del(r) {
    if (!confirm("Zmazať realizáciu „" + r.sk.t + "“? Z webu zmizne do 2 až 3 minút.")) return;
    post("deleteItem", { slug: r.slug }).then(function () {
      S.items = S.items.filter(function (x) { return x.slug !== r.slug; }); render(); toast("Zmazané.");
    }).catch(function (e) { toast(e.message, true); });
  }
  function newItem() {
    var it = { slug: "", group: "nove", cover: "", photos: [], manual: {}, sk: { t: "", p: "", y: "", d: "" } };
    LANGS.forEach(function (l) { it[l[0]] = { t: "", p: "", y: "", d: "" }; });
    return it;
  }

  /* ---------- úprava realizácie ---------- */
  function field(obj, key, label, max, onIn, opt) {
    opt = opt || {};
    var tag = key === "d" ? "textarea" : "input";
    var el = h(tag, { maxlength: max, rows: key === "d" ? 5 : null, required: opt.req, placeholder: opt.ph,
      oninput: function () { obj[key] = el.value; onIn && onIn(); } });
    el.value = obj[key] || "";
    return h("label", { cls: "fld" }, h("span", { text: label + (opt.req ? " *" : "") }), el);
  }
  function dirty() { S.edit._dirty = true; }

  function photosBox(e) {
    return h("div", { cls: "photos" },
      h("div", { cls: "ph-hd" }, h("h2", { text: "Fotky" }),
        photoInput("Pridať fotky", "rz", function (p) { e.photos.push(p); if (!e.cover) e.cover = p; dirty(); }),
        S.busy ? h("span", { cls: "busy", text: "Nahrávam " + S.busy + "…" }) : null),
      e.photos.length ? null : h("p", { cls: "note", text: "Pridajte aspoň jednu fotku. Fotky sa zmenšia automaticky." }),
      h("ul", { cls: "grid" }, e.photos.map(function (p, i) {
        var isCover = e.cover === p;
        return h("li", { cls: isCover ? "cover" : "" },
          h("img", { src: src(p), alt: "Fotka " + (i + 1) }),
          isCover ? h("span", { cls: "tag", text: "Titulná" }) : null,
          h("div", { cls: "tools" },
            h("button", { cls: "ic", title: "Doľava", "aria-label": "Posunúť doľava", disabled: i === 0, onclick: function () { move(e.photos, i, -1); dirty(); render(); } }, "←"),
            h("button", { cls: "ic", title: "Doprava", "aria-label": "Posunúť doprava", disabled: i === e.photos.length - 1, onclick: function () { move(e.photos, i, 1); dirty(); render(); } }, "→"),
            isCover ? null : h("button", { cls: "ic wide", onclick: function () { e.cover = p; dirty(); render(); } }, "Titulná"),
            h("button", { cls: "ic danger", title: "Odstrániť", "aria-label": "Odstrániť fotku", onclick: function () {
              e.photos.splice(i, 1); if (e.cover === p) e.cover = e.photos[0] || ""; dirty(); render();
            } }, "×")));
      })));
  }

  function transBox(obj, fields, manual, onRetranslate) {
    return h("div", { cls: "trans" },
      h("div", { cls: "ph-hd" }, h("h2", { text: "Preklady" }),
        h("button", { cls: "btn", type: "button", onclick: onRetranslate }, "Preložiť znova zo slovenčiny")),
      h("p", { cls: "note", text: "Preklad sa urobí automaticky pri uložení. Ak preklad upravíte ručne, pri ďalšej zmene slovenčiny sa už neprepíše." }),
      LANGS.map(function (l) {
        var tag = h("span", { cls: "tag" + (manual[l[0]] ? " man" : ""), text: manual[l[0]] ? "upravené ručne" : "automaticky" });
        return h("details", {}, h("summary", {}, l[1] + " ", tag),
          fields.map(function (f) {
            return field(obj[l[0]], f[0], f[1], f[2], function () { manual[l[0]] = true; tag.textContent = "upravené ručne"; tag.className = "tag man"; dirty(); });
          }));
      }));
  }

  function viewEdit() {
    var e = S.edit, isNew = !e.slug;
    function save(retranslate) {
      if (!e.sk.t.trim()) { toast("Vyplňte názov.", true); return; }
      if (!e.photos.length) { toast("Pridajte aspoň jednu fotku.", true); return; }
      if (S.busy) { toast("Počkajte, kým sa nahrajú fotky.", true); return; }
      var btns = app.querySelectorAll(".save button"); btns.forEach(function (b) { b.disabled = true; });
      post("saveItem", { item: e, retranslate: !!retranslate }).then(function (d) {
        var i = S.items.findIndex(function (x) { return x.slug === d.item.slug; });
        if (i < 0) S.items.unshift(d.item); else S.items[i] = d.item;
        S.edit = clone(d.item); S.edit.manual = S.edit.manual || {};
        render(); toast(isNew ? "Realizácia pridaná. Na webe bude do 2 až 3 minút." : "Uložené. Na webe bude do 2 až 3 minút."); warnMissing(d.untranslated);
      }).catch(function (x) { toast(x.message, true); btns.forEach(function (b) { b.disabled = false; }); });
    }
    return h("section", { cls: "wrap edit" },
      h("button", { cls: "link back", onclick: function () { if (!e._dirty || confirm("Zahodiť neuložené zmeny?")) { S.edit = null; render(); } } }, "← Späť na zoznam"),
      h("h1", { text: isNew ? "Nová realizácia" : e.sk.t }),
      h("fieldset", { cls: "seg" }, h("legend", { text: "Kategória" }), GROUPS.map(function (g) {
        var r = h("input", { type: "radio", name: "g", value: g[0], checked: e.group === g[0], onchange: function () { e.group = g[0]; dirty(); } });
        return h("label", {}, r, h("span", { text: g[1] }));
      })),
      h("div", { cls: "fields" },
        field(e.sk, "t", "Názov", 160, dirty, { req: true, ph: "Nové ihrisko Kinder Club" }),
        field(e.sk, "p", "Miesto", 160, dirty, { ph: "Trnava" }),
        field(e.sk, "y", "Druh práce", 160, dirty, { ph: "Demontáž a montáž" }),
        field(e.sk, "d", "Popis", 2000, dirty, { ph: "Krátky popis projektu, 1 až 3 vety." })),
      photosBox(e),
      isNew ? null : transBox(e, FIELDS, e.manual, function () { if (confirm("Prepísať všetky preklady novým prekladom zo slovenčiny?")) save(true); }),
      h("div", { cls: "save" },
        h("button", { cls: "btn btn--red", onclick: function () { save(false); } }, isNew ? "Pridať realizáciu" : "Uložiť"),
        isNew ? h("span", { cls: "note", text: "Preklady do CZ, EN a DE sa urobia pri uložení." }) : null));
  }

  /* ---------- banner ---------- */
  function viewBanner() {
    if (!S.bnEdit) {
      var b = S.banner || {};
      S.bnEdit = { on: !!b.on, color: b.color || COLORS[0][0], text: Object.assign({ sk: "", cz: "", en: "", de: "" }, b.text || {}), images: (b.images || []).slice(), manual: Object.assign({}, b.manual || {}) };
    }
    var e = S.bnEdit, t = { sk: { text: e.text.sk } };
    LANGS.forEach(function (l) { t[l[0]] = { text: e.text[l[0]] }; });
    function sync() { e.text.sk = t.sk.text; LANGS.forEach(function (l) { e.text[l[0]] = t[l[0]].text; }); prev(); }
    function save(retranslate) {
      if (S.busy) { toast("Počkajte, kým sa nahrajú obrázky.", true); return; }
      sync();
      post("saveBanner", { banner: e, retranslate: !!retranslate }).then(function (d) {
        S.banner = d.banner; S.bnEdit = null; render();
        toast(d.banner.on ? "Uložené. Banner je na webe." : "Uložené. Banner je vypnutý."); warnMissing(d.untranslated);
      }).catch(function (x) { toast(x.message, true); });
    }
    var preview = h("div", { cls: "bn-prev" });
    function prev() {
      var light = (function (hex) { // rovnaký výpočet ako public/js/banner.js
        var n = parseInt(hex.slice(1), 16);
        var L = [n >> 16, (n >> 8) & 255, n & 255].map(function (c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
        var lum = 0.2126 * L[0] + 0.7152 * L[1] + 0.0722 * L[2];
        return (lum + 0.05) / 0.0565 >= 1.05 / (lum + 0.05);
      })(e.color);
      preview.style.background = e.color; preview.style.color = light ? "#141310" : "#fff";
      preview.replaceChildren.apply(preview, [h("p", { text: t.sk.text || "Text banneru" }), e.images[0] ? h("img", { src: src(e.images[0]), alt: "" }) : null].filter(Boolean));
    }
    var custom = h("input", { type: "color", value: e.color, "aria-label": "Vlastná farba", oninput: function () { e.color = custom.value.toUpperCase(); prev(); }, onchange: function () { render(); } });
    var text = field(t.sk, "text", "Text (slovensky)", 160, sync, { ph: "Nové ihrisko v Trnave je otvorené" });
    prev();
    return h("section", { cls: "wrap edit" },
      h("div", { cls: "bar" }, h("h1", { text: "Banner na úvode" })),
      h("p", { cls: "note", text: "Pás pod hlavičkou na úvodnej stránke. Pri prvom scrolle zmizne, po návrate hore sa ukáže. Zmena je na webe hneď po uložení." }),
      h("label", { cls: "switch" }, h("input", { type: "checkbox", checked: e.on, onchange: function (ev) { e.on = ev.target.checked; } }), h("span", { text: "Zobraziť banner na webe" })),
      h("div", { cls: "fields" }, text),
      h("fieldset", { cls: "seg colors" }, h("legend", { text: "Farba" }),
        COLORS.map(function (c) {
          return h("label", {}, h("input", { type: "radio", name: "c", checked: e.color === c[0], onchange: function () { e.color = c[0]; render(); } }),
            h("span", {}, h("i", { bg: c[0] }), c[1]));
        }),
        h("label", { cls: "own" + (COLORS.some(function (c) { return c[0] === e.color; }) ? "" : " on") }, custom, h("span", { text: "Vlastná" }))),
      h("div", { cls: "photos" },
        h("div", { cls: "ph-hd" }, h("h2", { text: "Obrázky vpravo" }),
          photoInput("Pridať obrázky", "banner", function (p) { e.images.push("/" + p); render(); }),
          S.busy ? h("span", { cls: "busy", text: "Nahrávam " + S.busy + "…" }) : null),
        h("p", { cls: "note", text: "Nepovinné. 1 obrázok stojí, viac obrázkov sa strieda každé 4 sekundy (max 8)." }),
        h("ul", { cls: "grid small" }, e.images.map(function (p, i) {
          return h("li", {}, h("img", { src: src(p), alt: "Obrázok " + (i + 1) }),
            h("div", { cls: "tools" },
              h("button", { cls: "ic", "aria-label": "Posunúť doľava", disabled: i === 0, onclick: function () { move(e.images, i, -1); render(); } }, "←"),
              h("button", { cls: "ic", "aria-label": "Posunúť doprava", disabled: i === e.images.length - 1, onclick: function () { move(e.images, i, 1); render(); } }, "→"),
              h("button", { cls: "ic danger", "aria-label": "Odstrániť obrázok", onclick: function () { e.images.splice(i, 1); render(); } }, "×")));
        }))),
      h("div", { cls: "prev-wrap" }, h("h2", { text: "Náhľad" }), preview),
      S.banner ? transBox(t, [["text", "Text", 160]], e.manual, function () { save(true); }) : null,
      h("div", { cls: "save" }, h("button", { cls: "btn btn--red", onclick: function () { save(false); } }, "Uložiť banner")));
  }

  function load() {
    return post("state").then(function (d) { S.items = d.items || []; S.banner = d.banner; S.deepl = d.deepl; render(); })
      .catch(function (e) { app.replaceChildren(h("p", { cls: "wrap err", text: e.message })); });
  }
  load();
})();
