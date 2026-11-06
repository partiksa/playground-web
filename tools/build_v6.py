#!/usr/bin/env python3
"""Zloží v6/index.html, projekty.html, kontakt.html (štýl quality). Spustenie: python3 tools/build_v6.py"""
import re, html, json, pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "v6"
NB = " "


def nb(t):
    # pevná medzera za jednoznakmi
    return re.sub(r"(?<=\b)([ksvzouaiKSVZOUAI]) ", lambda m: m.group(1) + NB, t)


AR = '<svg class="ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M14 6l6 6-6 6"/></svg>'
CH = '<svg class="ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7"/></svg>'

# texty z pôvodného webu
P = [
    ("kraluv-dvur", "Presťahované a obnovené ihrisko", "Králův Dvůr, CZ", "Presťahovanie a obnova", "Presťahované a obnovené interiérové ihrisko v Králově Dvore pri Beroune.", "01", "prestahovane-a-obnovene-interierove-ihrisko-v-kraluv-dvur-cz"),
    ("samorin", "Interiérové ihrisko na mieru", "Šamorín", "Nové ihrisko na mieru", "Interiérové ihrisko na mieru prepojené s existujúcou stenou s otvormi.", "02", "interierove-ihrisko-na-mieru-samorin"),
    ("oravice", "Detská zóna v aquaparku", "Oravice, Meander", "Nová detská zóna", "Montáž kompletnej detskej zóny s panelovým interiérovým ihriskom v aquaparku Meander Oravice.", "03", "detska-zona-v-aquaparku-meander-oravice"),
    ("trnava", "Nové ihrisko Kinder Club", "Trnava", "Demontáž a montáž", "Demontáž pôvodného a montáž nového interiérového ihriska v Kinder Clube Trnava.", "04", "demontaz-a-montaz-noveho-interieroveho-ihriska-kinder-club-trnava"),
    ("pezinok", "Nové ihrisko v Pezinku", "Pezinok", "Demontáž a montáž", "Demontáž, montáž a zmena nového interiérového ihriska v Pezinku.", "05", "demontaz-a-montaz-noveho-interieroveho-ihriska-v-pezinku"),
    ("klatovy", "Obnova obalov konštrukcie", "Klatovy, CZ", "Obnova", "Obnova penových obalov konštrukcie interiérového ihriska.", "06", "obnova-obalov-konstrukcie-interieroveho-ihriska-klatovy"),
    ("dunajska-luzna", "Prerábka ihriska", "Dunajská Lužná", "Prerábka", "Vynovenie a prerábka interiérového ihriska v Dunajskej Lužnej.", "07", "prerabka-interieroveho-ihriska-v-dunajskej-luznej"),
    ("praha", "Ihrisko na kúpalisku", "Praha, CZ", "Montáž", "Montáž používaného interiérového ihriska v areáli kúpaliska v Prahe.", "08", "montaz-interieroveho-ihriska-na-kupalisku-v-prahe"),
    ("uhersky-brod", "Dorábka ihriska a tubingovej dráhy", "Uherský Brod, CZ", "Dorábka", "Dorábka interiérového ihriska a tubingovej dráhy k existujúcemu interiérovému ihrisku.", "09", "dorabka-interieroveho-ihriska-a-tubingovej-drahy-uhersky-brod-cz"),
    ("hlohovec", "Presťahovanie a prerobenie ihriska", "Hlohovec", "Presťahovanie a prerábka", "Demontáž trojposchodového interiérového ihriska a úprava na nové ihrisko s dvomi poschodiami na chodbe základnej školy.", "10", "prestahovanie-a-prerobenie-interieroveho-ihriska-hlohovec"),
    ("karvina-stena", "Lezecká stena pre deti", "Karviná, CZ", "Lezecká stena", "Lezecká stena je dobrý doplnok do herní.", "11", "lezecka-stena-pre-deti-karvina"),
    ("karvina-tubing", "Tubingová dráha", "Karviná, CZ", "Tubingová dráha", "Tubingová dráha postavená ako samostatne stojaci herný prvok. Deti na nej trávia najviac času.", "12", "tubingova-draha-karvina"),
]

# čo klient chce predávať najviac: nové ihriská, prerábka, sťahovanie (KLIENT.md)
SERVICES = [
    ("Nové ihrisko na mieru", "nove"),
    ("Prerábka starého ihriska", "prerabka"),
    ("Presťahovanie ihriska", "stahovanie"),
    ("Revízia ihriska", "reviza"),
]
_dd = [0]


def dropdown(label, btn_cls="", wrap_cls=""):
    _dd[0] += 1
    i = f"dd{_dd[0]}"
    items = "".join(f'<li><a href="kontakt.html?co={k}">{t}{AR}</a></li>' for t, k in SERVICES)
    return f'<div class="dd {wrap_cls}"><button class="btn {btn_cls}" type="button" aria-expanded="false" aria-controls="{i}">{label}{CH}</button><ul class="dd-menu" id="{i}">{items}</ul></div>'


def page(title, desc, body, cur, extra="", head="", intro=False):
    splash = '<div class="splash" id="splash" aria-hidden="true"><span class="logo-mark"></span></div>\n' if intro else ""
    if intro:
        head += '<script>document.documentElement.classList.add("splashing");setTimeout(function(){document.documentElement.classList.remove("splashing")},5000)</script>\n'
    nav = [("ihriska.html", "Ihriská na mieru", ""), ("prerabka.html", "Prerábka", ""), ("revizie.html", "Revízie", ""),
           ("projekty.html", "Realizácie", ""), ("o-nas.html", f"O{NB}nás", ""), ("kontakt.html", "Kontakt", "")]
    li = "".join(f'<li><a href="{pre}{h}"{" aria-current=page" if h == cur else ""}>{t}</a></li>' for h, t, pre in nav)
    return f'''<!doctype html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="preload" href="fonts/Switzer-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/CabinetGrotesk-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="home.css">
<link rel="stylesheet" href="rows.css">
<link rel="stylesheet" href="rz.css">
<script>setTimeout(function(){{if(!window.__ok){{document.documentElement.classList.add("fs");document.body.classList.add("go")}}}},3500)</script>
<noscript><style>.rv,.tl,.tli{{opacity:1!important;transform:none!important;clip-path:none!important}}body:not(.go) main :is(h1,h2),body:not(.go) .cta h2{{visibility:visible!important}}</style></noscript>
{head}</head>
<body>
{splash}<header class="site-header">
  <a class="logo" href="index.html" aria-label="Playground, domov"><span class="logo-mark" role="img" aria-label="Playground"></span></a>
  <div class="nav" id="nav">
    <ul>{li}</ul>
    <div class="lang" aria-label="Jazyk"><a href="#" aria-current="true" lang="sk">SK</a><a href="#" lang="en">EN</a><a href="#" lang="de">DE</a></div>
  </div>
  {dropdown("Dopyt", "sm", "right")}
  <button class="menu-btn" aria-expanded="false" aria-controls="nav" type="button">Menu</button>
</header>
<main>
{body}
</main>
<footer class="site-footer">
  <div class="brand"><a class="logo" href="index.html" aria-label="Playground, domov"><span class="logo-mark" role="img" aria-label="Playground"></span></a></div>
  <div class="col"><p class="lab">Kontakt</p><address>PLAYGROUND, s.r.o.<br>Poštová 6562/20<br>917{NB}01 Trnava<br><a href="tel:+421905724437">+421{NB}905{NB}724{NB}437</a><br><a href="mailto:info@play-ground.sk">info@play-ground.sk</a></address></div>
  <div class="col"><p class="lab">Web</p><address><a href="projekty.html">Realizácie</a><br><a href="kontakt.html">Kontakt</a><br><a href="prerabka.html">Prerábka</a><br><a href="revizie.html">Revízie</a></address></div>
  <p class="small">IČO 47051990</p>
</footer>
{extra}
<script src="intro.js"></script>
<script type="module" src="main.js"></script>
</body>
</html>
'''


def ill(src, alt, w, h, cls=""):
    # ilustrácia nakreslená kódom (skill claude-drawing, tools/ill_*.py)
    return f'<figure class="ill rv {cls}"><img src="ill/{src}.webp" alt="{alt}" width="{w}" height="{h}" loading="lazy"></figure>'


def cta_ill(name):
    # voskovková ilustrácia v pravom dolnom rohu CTA (namiesto loptičiek)
    return f'<img class="cta-ill rv" src="ill/crayon/{name}.webp" width="900" height="900" alt="" loading="lazy" decoding="async" style="--d:.12s">'


def home_cta():
    return f'''<section class="cta cta-home">
  {cta_ill("hero-2")}
  <p class="lab rv">Dopyt na ihrisko</p>
  <h2 class="rv">Postavíme vám ihrisko, ktoré sa{NB}deťom bude páčiť</h2>
  <p class="cta-sub rv" style="--d:.04s">{nb("Napíšte nám rozmery priestoru a čo od ihriska čakáte. Ozveme sa vám s návrhom.")}</p>
  <div class="act rv" style="--d:.08s">{dropdown("Napísať dopyt")}<a class="btn ghost-w" href="tel:+421905724437">+421 905 724 437</a></div>
</section>'''


def cta(c="blue"):
    return f'''<section class="cta cta-end cta-{c}">
  {cta_ill("hero-1")}
  <h2 class="rv">Napíšte nám</h2>
  <p class="cta-sub rv" style="--d:.04s">Opíšte nám svoj priestor alebo ihrisko a ozveme sa vám.</p>
  <div class="act rv" style="--d:.08s"><a class="btn" href="kontakt.html" data-cta>Napíšte nám</a></div>
</section>'''


# ---------- úvod ----------
# kroky stavby podľa snímok videa (začiatok kroku ako podiel scrollu, overené na snímkach f025 až f240)
BUILD = [(0, "Podlaha"), (.08, "Konštrukcia"), (.24, "Plošiny a siete"), (.42, "Guľôčkový bazén"), (.62, "Panely a dekor"), (.86, "Hotové ihrisko")]
STEPS = "".join(f'<li data-at="{a}"><span>{i + 1:02d}</span>{t}</li>' for i, (a, t) in enumerate(BUILD))
# hero: text vľavo, video s deťmi vpravo v ráme, okolo neho detské kresby voskovkami (v6/ill/crayon/hero-*.webp)
HERO_ILL = [("hero-1", "cr-1"), ("hero-2", "cr-2"), ("hero-3", "cr-3")]
hero = f'''<section class="hh" data-home>
  <div class="hh-copy">
    <p class="lab">Playground, Trnava</p>
    <h1>Interiérové ihriská <span class="mk">na{NB}mieru</span></h1>
    <p class="lead">{nb("Navrhujeme, vyrábame a montujeme interiérové ihriská pre rodinné centrá, kaviarne, hotely a škôlky.")}</p>
    <div class="btns">{dropdown("Napísať dopyt")}<a class="btn ghost" href="projekty.html">Realizácie</a></div>
    <dl class="hh-stats"><div><dt>13</dt><dd>rokov na{NB}trhu</dd></div><div><dt>180+</dt><dd>projektov</dd></div><div><dt>4</dt><dd>krajiny</dd></div></dl>
  </div>
  <div class="hh-media">
    <div class="hh-vid"><video id="hv" autoplay muted loop playsinline preload="auto" poster="video/hero-deti.jpg" aria-hidden="true"><source src="video/hero-deti.mp4" type="video/mp4"></video></div>
    {"".join(f'<figure class="cr {c}" aria-hidden="true"><img src="ill/crayon/{f}.webp" alt="" width="900" height="900"></figure>' for f, c in HERO_ILL)}
  </div>
</section>'''
build = f'''<section class="track" id="track">
  <div class="stage">
    <div class="copy">
      <p class="lab rv">Ako vzniká ihrisko</p>
      <h2 class="rv">Od podlahy po{NB}<span class="mk mk-o">siete</span></h2>
      <p class="lead rv">Nosnú konštrukciu tvoria oceľové trubky a{NB}spojky. Obaľujeme ju penou a{NB}vinylom, priestor uzatvárajú siete.</p>
      <div class="btns rv"><a class="btn ghost" href="ihriska.html">Ihriská na mieru{AR}</a></div>
    </div>
    <div class="vid">
      <canvas id="c" role="img" aria-label="Stavba interiérového ihriska krok za krokom"></canvas>
      <div class="steps" aria-hidden="true">
        <ol id="steps">{STEPS}</ol>
        <div class="bar"><i id="bar"></i></div>
        <p class="tc" id="tc">0:00 / 0:10</p>
      </div>
    </div>
  </div>
</section>'''

# tri služby: menšie karty, pri hover sa cez fotku zotrie druhá fotka
SVC = [
    ("Nové ihriská", "Návrh, výroba a montáž ihriska presne pre váš priestor.", "ihriska.html", "02", "04"),
    ("Prerábka", "Staré ihrisko prerobíme na nové a normované. Použijeme pôvodnú konštrukciu.", "prerabka.html", "07", "06"),
    ("Sťahovanie", "Ihrisko rozoberieme, prevezieme a postavíme v novom priestore.", "prerabka.html", "10", "01"),
]
svc = f'''<section class="svc">
  <div class="svc-head"><p class="lab rv">Čo robíme</p><h2 class="rv">Nové, prerobené aj <span class="mk mk-t">presťahované</span> ihriská</h2></div>
  <ul class="svc-list">{"".join(f'''<li class="rv" style="--d:{i * .08:.2f}s"><a class="sv" href="{h}">
    <span class="sv-ph"><img src="assets/obsah/img/projekt-{a}.jpg" alt="" loading="lazy" width="1536" height="1152"><img class="sv-b" src="assets/obsah/img/projekt-{b}.jpg" alt="" loading="lazy" width="1536" height="1152"></span>
    <div class="sv-t"><span class="sv-no">{i + 1:02d}</span><h3>{t}</h3><span class="sv-d">{nb(d)}</span><span class="sv-go">{AR}</span></div>
  </a></li>''' for i, (t, d, h, a, b) in enumerate(SVC))}</ul>
</section>'''


# realizácie ako pás fotiek, ktorý sa pomaly posúva (pri obmedzenom pohybe stojí)
def mq_items(hidden=False):
    attr = ' aria-hidden="true" tabindex="-1"' if hidden else ""
    return "".join(f'<a class="mq-it" href="projekty.html"{attr}><span class="mq-ph"><img src="assets/obsah/img/projekt-{n}.jpg" alt="" loading="lazy" width="1536" height="1152"></span><span class="mq-t"><b>{html.escape(place)}</b><span>{html.escape(typ)}</span></span></a>' for slug, title, place, typ, desc, n, src in P)


rzs = f'''<section class="rzs">
  <div class="rzs-head"><p class="lab rv">Realizácie</p><h2 class="rv">Ihriská na <span class="mk mk-b">Slovensku</span> a v{NB}Česku</h2><a class="more rv" href="projekty.html">Všetkých 12 realizácií{AR}</a></div>
  <div class="mq"><div class="mq-track">{mq_items()}{mq_items(True)}</div></div>
</section>'''

(OUT / "index.html").write_text(page("Interiérové ihriská na mieru | Playground, Trnava", "Interiérové ihriská na mieru pre rodinné centrá, kaviarne, hotely a škôlky. Navrhujeme, vyrábame a montujeme. Trnava.", hero + svc + rzs + home_cta(), "", intro=True), encoding="utf-8")


# ---------- realizácie ----------
data = json.dumps([{"slug": p[0], "title": p[1], "place": p[2], "type": p[3], "desc": p[4], "n": p[5], "src": f"https://play-ground.sk/portfolio/{p[6]}/"} for p in P], ensure_ascii=False)
modal = f'''<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">
  <div class="m-img" id="m-img"></div>
  <div class="m-txt">
    <div class="m-bar"><span class="lab" id="m-count"></span><button type="button" id="m-close">Zavrieť</button></div>
    <div class="m-copy"><p class="lab" id="m-place"></p><h2 id="m-title"></h2><p id="m-desc"></p>
    <div><a class="more" id="m-src" href="#" target="_blank" rel="noopener">Pôvodná stránka{AR}</a></div></div>
    <div class="m-nav"><button type="button" id="m-prev" aria-label="Predchádzajúca realizácia">{AR.replace('<svg class="ar"', '<svg class="ar" style="transform:scaleX(-1)"')}</button><button type="button" id="m-next" aria-label="Ďalšia realizácia">{AR}</button></div>
  </div>
</div>
<script type="application/json" id="projects-data">{data}</script>'''
# poradie podľa kvality fotiek: prvých 5 ide veľko, ostatné menšie (slabšie fotky)
TOP = ["trnava", "dunajska-luzna", "klatovy", "samorin", "hlohovec"]
REST = ["pezinok", "kraluv-dvur", "karvina-stena", "karvina-tubing", "praha", "uhersky-brod", "oravice"]
PBY = {p[0]: p for p in P}


def rz_row(p, i, big):
    # editoriálny riadok: číslo, názov a miesto, typ a popis, fotka (klik otvorí detail)
    slug, title, place, typ, desc, n, src = p
    return f'''<li class="rz-it{"" if big else " sm"}"><a class="rz-row rc-in" href="https://play-ground.sk/portfolio/{src}/" data-slug="{slug}">
  <span class="rz-no">{i + 1:02d}</span>
  <div class="rz-tt"><h3>{nb(html.escape(title))}</h3><span class="rz-pl">{html.escape(place)}</span></div>
  <span class="rz-ty"><span class="rz-l">{html.escape(typ)}</span><span class="rz-d">{nb(html.escape(desc))}</span></span>
  <span class="rz-ph"><img src="assets/obsah/img/projekt-{n}.jpg" alt="{html.escape(title)}, {html.escape(place)}" loading="lazy" width="1536" height="1152"></span>
  <span class="rz-go">{AR}</span>
</a></li>'''


rz = f'''<section class="rz">
<ol class="rz-list">{"".join(rz_row(PBY[k], i, True) for i, k in enumerate(TOP))}</ol>
<h2 class="rz-more">Ďalšie realizácie</h2>
<ol class="rz-list rz-grid">{"".join(rz_row(PBY[k], len(TOP) + i, False) for i, k in enumerate(REST))}</ol></section>'''
# 3D vizualizácie: (názov, popis, priečinok snímok, počet snímok); ďalšie doplniť sem
VIZ = [("Vesmírne ihrisko", "Ihrisko s vesmírnou témou pre rodinné centrum. Otočíte ho ťahaním.", "frames/render/f_", 360)]


def viz_item(i, t, d, frames, n):
    vid = "v360" if i == 0 else f"v360-{i}"
    return f'''<li class="rz3-it rv"><div class="rz3-view"><div class="v360" id="{vid}" role="img" aria-label="{html.escape(t)}, 3D vizualizácia, otáčanie ťahaním myšou, prstom alebo šípkami" data-frames="{frames}" data-count="{n}" data-start="1" tabindex="0"><canvas width="1280" height="720"></canvas></div></div>
  <div class="rz3-cap"><span class="rz3-no">{i + 1:02d}</span><h3>{nb(html.escape(t))}</h3><p>{nb(d)}</p></div></li>'''


V360 = f'''<section class="rz3">
  <div class="rz3-head"><p class="lab rv">3D</p><h2 class="rv">3D <span class="mk mk-v">vizualizácie</span></h2><p class="rv">{nb("Pred výrobou pripravíme návrh a 3D vizualizáciu. Ihrisko uvidíte zo všetkých strán ešte predtým, než ho postavíme.")}</p></div>
  <ol class="rz3-list">{"".join(viz_item(i, *v) for i, v in enumerate(VIZ))}</ol>
</section>'''

head = '<div class="page-head"><h1 class="rv"><span class="mk mk-b">Realizácie</span></h1><p class="lab">12 projektov, SK a CZ</p></div>'
(OUT / "projekty.html").write_text(page("Realizácie interiérových ihrísk | Playground", "Realizované interiérové ihriská na Slovensku a v Česku: nové ihriská, prerábky, presťahovania a obnovy.", head + build + rz + V360 + cta("yellow"), "projekty.html", modal), encoding="utf-8")


# ---------- kontakt ----------
ICONS = {
    "nove": '<path d="M12 4v16M4 12h16"/>',
    "prerabka": '<path d="M19 9a7.5 7.5 0 0 0-13-2.5M5 3.5v4h4M5 15a7.5 7.5 0 0 0 13 2.5M19 20.5v-4h-4"/>',
    "stahovanie": '<path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5"/>',
    "reviza": '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    "ine": '<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>',
}


def tiles():
    items = [("Nové ihrisko", "nove"), ("Prerábka", "prerabka"), ("Presťahovanie", "stahovanie"), ("Revízia", "reviza"), ("Iné", "ine")]
    return "".join(f'<label class="tile"><input type="radio" name="co" value="{k}" data-label="{t}" required><span><svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[k]}</svg>{t}</span></label>' for t, k in items)


def chips():
    return "".join(f'<label class="chip"><input type="radio" name="typ" value="{t}"><span>{t}</span></label>' for t in ["Rodinné centrum", "Kaviareň", "Hotel", "Škôlka", "Iné"])


def when():
    # rovnaké možnosti ako vo v5 (playground-v1)
    return "".join(f'<label class="chip"><input type="radio" name="kedy" value="{t}"><span>{nb(t)}</span></label>' for t in ["Čo najskôr", "Do troch mesiacov", "Do pol roka", "Zatiaľ sa len pýtam"])


kontakt = f'''<section class="contact">
  <aside class="c-side">
    <h1>Napíšte nám</h1>
    <dl>
      <div><dt class="lab">Telefón</dt><dd><a href="tel:+421905724437">+421{NB}905{NB}724{NB}437</a></dd></div>
      <div><dt class="lab">E-mail</dt><dd><a href="mailto:info@play-ground.sk">info@play-ground.sk</a></dd></div>
      <div><dt class="lab">Adresa</dt><dd>PLAYGROUND, s.r.o., Poštová 6562/20, 917{NB}01 Trnava</dd></div>
    </dl>
  </aside>
  <div class="f-wrap rv">
    <form class="f" id="dopyt" autocomplete="on">
      <div class="prog" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <fieldset><legend class="lab"><b>1</b>Čo potrebujete</legend><div class="tiles">{tiles()}</div></fieldset>
      <fieldset><legend class="lab"><b>2</b>Typ prevádzky</legend><div class="chips">{chips()}</div></fieldset>
      <fieldset><legend class="lab"><b>3</b>Dokedy má byť ihrisko hotové</legend><div class="chips">{when()}</div></fieldset>
      <fieldset><legend class="lab"><b>4</b>Vaše údaje</legend>
      <div class="fields">
        <label class="field"><span class="lab">Meno</span><input name="meno" required autocomplete="name"></label>
        <label class="field"><span class="lab">E-mail</span><input name="email" type="email" required autocomplete="email"></label>
        <label class="field"><span class="lab">Telefón</span><input name="tel" type="tel" autocomplete="tel"></label>
        <label class="field"><span class="lab">Mesto a krajina</span><input name="mesto" autocomplete="address-level2"></label>
        <label class="field wide"><span class="lab">Správa</span><textarea name="sprava" rows="2"></textarea></label>
      </div></fieldset>
      <div class="foot">
        <label class="consent"><input type="checkbox" name="suhlas" required><span>Súhlasím so spracovaním osobných údajov na vybavenie dopytu.</span></label>
        <button class="btn" type="submit">Odoslať{AR}</button>
      </div>
    </form>
    <div class="thanks" role="status"><svg viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="M8 25l11 11L40 11"/></svg><h2>Ďakujeme</h2><p>Otvorili sme e-mail s vaším dopytom. Stačí ho odoslať.</p><div class="t-btns"><a class="btn" id="t-mail" href="#">Otvoriť e-mail</a><button class="btn ghost" type="button" id="t-copy">Skopírovať text</button></div><canvas class="pit" aria-hidden="true"></canvas></div>
  </div>
</section>'''
(OUT / "kontakt.html").write_text(page("Kontakt a dopyt | Playground, Trnava", "Kontakt na PLAYGROUND, s.r.o., Trnava. Dopyt na interiérové ihrisko.", kontakt, "kontakt.html"), encoding="utf-8")


# ---------- podstránky: ihriská na mieru, prerábka, revízie, o nás ----------
def row(no, h, body):
    return f'<section class="sp-row rv"><p class="lab">{no}</p><h2>{nb(h)}</h2><div class="sp-body">{body}</div></section>'


def ul(items):
    return "<ul>" + "".join(f"<li>{nb(i)}</li>" for i in items) + "</ul>"


def ol(items):
    return "<ol>" + "".join(f"<li><b>{nb(a)}</b><span>{nb(b)}</span></li>" for a, b in items) + "</ol>"


def pp(*t):
    return "".join(f"<p>{nb(x)}</p>" for x in t)


def mark(h, cls="mk"):
    # posledné slovo nadpisu dostane voskovkový ťah
    a, _, b = h.rpartition(" ")
    return f'{nb(html.escape(a))}{" " if a else ""}<span class="{cls}">{html.escape(b)}</span>'


def sub_head(h, lead, cls="mk"):
    return f'<div class="page-head"><h1 class="rv">{mark(h, cls)}</h1></div><section class="sp-lead"><p class="rv">{nb(lead)}</p></section>'


IMAP = '<script type="importmap">{"imports":{"three":"./vendor/build/three.module.js","three/addons/":"./vendor/addons/"}}</script>\n<link rel="modulepreload" href="vendor/build/three.module.js">\n'


def p3d(mode, lab, h, lead, steps):
    li = "".join(f'<li data-at="{a}"><span>{i + 1:02d}</span>{nb(t)}</li>' for i, (a, t) in enumerate(steps))
    return f'''<section class="p3d" data-mode="{mode}">
  <div class="p3d-stage">
    <div class="p3d-copy">
      <p class="lab">{lab}</p>
      <h2>{nb(h)}</h2>
      <p class="lead">{nb(lead)}</p>
      <ol class="p3d-steps">{li}</ol>
    </div>
    <div class="p3d-view" role="img" aria-label="{html.escape(h)}, 3D model ihriska, otáčanie ťahaním"><p class="p3d-hint lab">Ťahaním otočíte</p></div>
  </div>
</section>'''


# ---------- riadky s voskovkovými ilustráciami (rows.css, rows.js) ----------
CRAYON = "ill/crayon/"


def steps_row(no, h, items):
    # postup: kroky ako editoriálny zoznam; vľavo lepkavý obraz, ktorý sa mení so scrollom podľa aktívneho kroku
    li = "".join(f'<li data-i="{i}"><b>{nb(a)}</b><span>{nb(t)}</span></li>' for i, (a, t) in enumerate(items))
    figs = "".join(f'<img src="{CRAYON}step-{i + 1}.webp" width="900" height="900" alt="" decoding="async" data-i="{i}"{" class=on" if i == 0 else ""}>' for i in range(len(items)))
    ticks = "".join(f'<i data-i="{i}"></i>' for i in range(len(items)))
    return f'''<section class="sp-row st-row rv" data-rows="steps"><p class="lab">{no}</p><h2>{nb(h)}</h2>
  <div class="st-side" aria-hidden="true"><div class="st-vis">
    <svg class="st-blob" viewBox="0 0 200 200"><path d="M100 14c38 2 74 24 82 62 8 40-14 82-52 98-40 16-90 4-110-32C2 106 10 60 40 34 58 19 78 13 100 14z"/></svg>
    <div class="st-imgs">{figs}</div>
    <img class="st-scr" src="{CRAYON}ul-red.webp" width="900" height="70" alt="">
    <p class="st-cap lab"><span class="st-n">01</span><span class="st-ticks">{ticks}</span></p>
  </div></div>
  <div class="sp-body"><ol class="st-list">{li}</ol></div></section>'''


def fit_row(no, h, items):
    # kde sa hodia: číslovaný zoznam, pri každej položke malá voskovková ikonka
    li = "".join(f'<li><b>{nb(a)}</b><span>{nb(t)}</span><img class="fit-ic" src="{CRAYON}fit-{i + 1}.webp" width="600" height="600" alt="" loading="lazy" decoding="async"></li>' for i, (a, t) in enumerate(items))
    return row(no, h, f'<ol class="fit-list">{li}</ol>')


# sťahovanie: voskovková scéna (starý priestor vľavo, nový vpravo), nákladiak prechádza po ceste
MOVE = f'''<figure class="mv" role="img" aria-label="Nákladiak prevezie rozobraté ihrisko zo starého priestoru do nového, kde ho postavíme"><div class="mv-in">
  <img class="mv-bg" src="{CRAYON}move-bg.webp" width="1600" height="420" alt="" loading="lazy" decoding="async">
  <div class="mv-road"><img class="mv-truck" src="{CRAYON}move-truck.webp" width="520" height="300" alt="" loading="lazy" decoding="async"></div>
</div></figure>'''


def move_row(no, h, body):
    # riadok so širokou scénou pod textom
    return f'<section class="sp-row mv-row rv"><p class="lab">{no}</p><h2>{nb(h)}</h2><div class="sp-body">{body}</div>{MOVE}</section>'


def sub_cta(c="blue"):
    return cta(c)


ihriska = sub_head("Ihriská na mieru", "Panelové interiérové ihriská pre prevádzky. Od prvej konzultácie po montáž na kľúč.") + p3d("explode", "Z čoho je ihrisko", "Každý diel na mieru", "Ihrisko skladáme z oceľovej konštrukcie, plošín, sietí a herných prvkov. Skladbu prispôsobíme vášmu priestoru.", [(0, "Návrh pre váš priestor"), (.3, "Konštrukcia, plošiny a siete"), (.56, "Šmykľavka, bazén a prvky"), (.84, "Montáž na kľúč")]) + "".join([
    row("01", "Čo sú panelové ihriská", pp("Nosnú konštrukciu tvoria oceľové trubky a spojky. Konštrukciu obaľujeme penou a vinylom, priestor uzatvárajú siete. Na konštrukciu sa pripájajú herné prvky: šmykľavky, tunely, siete a závesné moduly.", "Ihriská spĺňajú normy EN 1176 (vybavenie ihrísk) a EN 1177 (povrchy tlmiace náraz).")),
    steps_row("02", "Postup", [("Konzultácia", "Zistíme, pre koho je ihrisko a čo od neho čakáte."), ("Zameranie priestoru", "Presne zameriame plochu, výšku stropu, vstupy a okná."), ("Návrh a 3D vizualizácia", "Dizajn, ktorý využije dostupný priestor a sedí na cieľovú skupinu."), ("Výroba", "Konštrukcia, obaly a herné prvky."), ("Dodanie a montáž", "Ihrisko odovzdáme pripravené na okamžité používanie.")]),
    row("03", "Herné prvky", ul(["šmykľavky a tobogány", "preliezačky a moduly", "sieťové chodníky a balančné prvky", "trampolíny, tunely a prekážkové dráhy", "tubingové dráhy a lezecké steny", "zóny pre rôzne vekové kategórie"]) + pp("Prvky rozvíjajú motoriku, koordináciu, kreativitu a sociálne zručnosti detí.")),
    fit_row("04", "Kde sa hodia", [("Rodinné centrá a herne", "Zábava pre deti počas nákupov a voľného času."), ("Kaviarne a cukrárne", "Deti sa hrajú, rodičia oddychujú."), ("Hotely a penzióny", "Rodinná atrakcia navyše k ponuke."), ("Škôlky a vzdelávacie centrá", "Bezpečné prostredie na hru a rozvoj."), ("Aquaparky a kúpaliská", "Kompletné detské zóny.")]),
    row("05", "Materiál a servis", pp("Ihriská vyrábame z kvalitných materiálov s dôrazom na bezpečnosť a dlhú životnosť. Na sklade máme konštrukčné trubky, spojky, siete, peny na obaľovanie konštrukcie a závesné moduly.", "Robíme aj servis a ročné kontroly (revízie) ihrísk.") + f'<p><a class="more" href="projekty.html">Pozrieť realizácie{AR}</a></p>'),
]) + sub_cta("blue")
(OUT / "ihriska.html").write_text(page("Ihriská na mieru | Playground, Trnava", "Panelové interiérové ihriská na mieru: návrh, výroba a montáž na kľúč. Rodinné centrá, kaviarne, hotely, škôlky.", ihriska, "ihriska.html", head=IMAP), encoding="utf-8")

prerabka = sub_head("Prerábka a sťahovanie", "Staré ihrisko prerobíme na nové, normované, alebo ho presťahujeme do nového priestoru.", "mk mk-t") + p3d("rebuild", "Zo starého nové", "Prerábka krok za krokom", "Použijeme pôvodnú konštrukciu a nepoškodené diely. Vymeníme obaly, farby a doplníme nové prvky.", [(0, "Staré ihrisko"), (.18, "Demontáž"), (.4, "Nové obaly a farby"), (.62, "Nové prvky"), (.86, "Normované ihrisko")]) + "".join([
    row("01", "Prerábka", pp("Staré ihrisko (najčastejšie čínske) prerobíme na nové, normované. Použijeme materiál z pôvodného: železo z konštrukcie, spojky a nepoškodené moduly.") + ul(["výmena opotrebovaných herných prvkov", "úprava dispozície a lepšie využitie priestoru", "nový dizajn a farby", "doplnenie nových atrakcií", "úprava podľa aktuálnych noriem"])),
    move_row("02", "Sťahovanie", pp("Ihrisko rozoberieme, prevezieme a postavíme v novom priestore. Pri tom ho môžeme upraviť na nový rozmer.")),
    row("03", "Prečo prerábka", pp("Prerábka je často rýchlejšia a lacnejšia než nové ihrisko.") + f'<p><a class="more" href="projekty.html">Prerobené ihriská{AR}</a></p>'),
]) + sub_cta("teal")
(OUT / "prerabka.html").write_text(page("Prerábka a sťahovanie interiérových ihrísk | Playground", "Prerábka starých interiérových ihrísk na nové, normované. Sťahovanie ihrísk do nového priestoru. Trnava, SK a CZ.", prerabka, "prerabka.html", head=IMAP), encoding="utf-8")

revizie = sub_head("Revízie", "Skontrolujeme ihrisko, opravíme, čo treba, a vymeníme opotrebované diely.", "mk mk-o") + "".join([
    row("01", "Ročná kontrola", pp("Robíme servis a ročné kontroly (revízie) ihrísk.", "Ihriská posudzujeme podľa noriem EN 1176 (vybavenie ihrísk) a EN 1177 (povrchy tlmiace náraz).")),
    row("02", "Servis a diely", pp("Na sklade máme konštrukčné trubky, spojky, siete, peny na obaľovanie konštrukcie a závesné moduly.")),
]) + sub_cta("violet")
(OUT / "revizie.html").write_text(page("Revízie a servis interiérových ihrísk | Playground", "Ročné kontroly a servis interiérových ihrísk podľa EN 1176 a EN 1177. Výmena opotrebovaných dielov.", revizie, "revizie.html"), encoding="utf-8")

stats = '<ul class="sp-stats">' + "".join(f'<li class="rv" style="--d:{i * .08:.2f}s"><b>{n}</b><span>{nb(t)}</span></li>' for i, (n, t) in enumerate([("13", "rokov na trhu"), ("180+", "projektov"), ("4", "krajiny: Slovensko, Česko, Francúzsko, Taliansko")])) + "</ul>"
onas = sub_head("O nás", "Dodávame normované interiérové ihriská a trampolínové centrá. Prevádzkam pomáhajú prilákať rodičov s deťmi.", "mk mk-v") + stats + "".join([
    row("01", "Na kľúč", pp("Od konzultácie, zamerania, návrhu a vizualizácie po dodanie a montáž. Vykonali sme aj stovky servisov a ročných kontrol ihrísk.")),
    row("02", "Prerábka starého ihriska", pp("Naša hlavná odlišnosť. Staré ihrisko prerobíme na nové a normované. Použijeme pôvodnú konštrukciu, spojky a nepoškodené moduly, takže ušetríte.")),
    row("03", "Vlastný sklad", pp("Konštrukčné trubky, spojky, siete, peny na obaľovanie a závesné moduly máme na sklade.")),
    row("04", "Poradíme aj s priestorom", pp("Pomôžeme s rozložením ihriska, posedením aj kaviarenskou časťou.")),
]) + sub_cta("orange")
(OUT / "o-nas.html").write_text(page("O nás | Playground, Trnava", "PLAYGROUND, s.r.o.: normované interiérové ihriská a trampolínové centrá, prerábka starých ihrísk, vlastný sklad. Trnava.", onas, "o-nas.html"), encoding="utf-8")

print("ok")
