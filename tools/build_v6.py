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


def page(title, desc, body, cur, extra=""):
    nav = [("ihriska.html", "Ihriská na mieru", "../v5/"), ("prerabka.html", "Prerábka", "../v5/"), ("revizie.html", "Revízie", "../v5/"),
           ("projekty.html", "Realizácie", ""), ("o-nas.html", f"O{NB}nás", "../v5/"), ("kontakt.html", "Kontakt", "")]
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
</head>
<body>
<header class="site-header">
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
  <div class="col"><p class="lab">Web</p><address><a href="projekty.html">Realizácie</a><br><a href="kontakt.html">Kontakt</a><br><a href="../v5/prerabka.html">Prerábka</a><br><a href="../v5/revizie.html">Revízie</a></address></div>
  <p class="small">IČO 47051990</p>
</footer>
{extra}
<script type="module" src="main.js"></script>
</body>
</html>
'''


def cta():
    return f'''<section class="cta">
  <canvas class="pit" aria-hidden="true"></canvas>
  <h2 class="rv">Povedzte nám, aké ihrisko potrebujete</h2>
  <div class="act rv" style="--d:.08s">{dropdown("Napísať dopyt")}</div>
</section>'''


# ---------- úvod ----------
# kroky stavby podľa snímok videa (začiatok kroku ako podiel scrollu, overené na snímkach f025 až f240)
BUILD = [(0, "Podlaha"), (.12, "Stĺpy"), (.32, "Plošiny"), (.5, "Šmykľavka a bazén"), (.66, "Siete"), (.88, "Hotové ihrisko")]
STEPS = "".join(f'<li data-at="{a}"><span>{i + 1:02d}</span>{t}</li>' for i, (a, t) in enumerate(BUILD))
hero = f'''<section class="vhero">
  <video id="hv" autoplay muted loop playsinline preload="auto" poster="video/hero-deti.jpg" aria-hidden="true"><source src="video/hero-deti.mp4" type="video/mp4"></video>
  <div class="vh-copy">
    <p class="lab">Playground, Trnava</p>
    <h1>Interiérové ihriská na{NB}mieru</h1>
    <p class="lead">Navrhujeme, vyrábame a montujeme interiérové ihriská pre rodinné centrá, kaviarne, hotely a škôlky.</p>
    <div class="btns">{dropdown("Napísať dopyt")}<a class="btn ghost" href="projekty.html">Realizácie</a></div>
  </div>
  <button class="vh-pause lab" id="hv-btn" type="button" aria-pressed="false">Pauza</button>
</section>'''
build = f'''<section class="track" id="track">
  <div class="stage">
    <div class="copy">
      <p class="lab rv">Ako vzniká ihrisko</p>
      <h2 class="rv">Od podlahy po{NB}siete</h2>
      <p class="lead rv">Nosnú konštrukciu tvoria oceľové trubky a{NB}spojky. Obaľujeme ju penou a{NB}vinylom, priestor uzatvárajú siete.</p>
      <div class="btns rv"><a class="btn ghost" href="../v5/ihriska.html">Ihriská na mieru{AR}</a></div>
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

PANELS = [
    ("Nové ihriská", "Ihriská na mieru", "../v5/ihriska.html", "02"),
    ("Prerábka", "Zo starého ihriska nové", "../v5/prerabka.html", "07"),
    ("Sťahovanie", f"Presťahujeme vaše ihrisko", "../v5/prerabka.html", "10"),
]
panels = "".join(f'''<a class="panel" href="{h}"><div class="pimg" data-img="assets/obsah/img/projekt-{n}.jpg" data-depth="assets/depth/projekt-{n}-depth.jpg"><img src="assets/obsah/img/projekt-{n}.jpg" alt="" loading="lazy" width="1536" height="1152"></div>
  <div class="pcopy"><p class="lab">{l}</p><h2><span class="mask"><span>{nb(t)}</span></span></h2><span class="go-arrow">{AR}</span></div></a>''' for l, t, h, n in PANELS)
strip = f'<div class="strip"><p class="lab">Realizované ihriská na Slovensku a v{NB}Česku</p><a class="more" href="projekty.html">Všetkých 12 realizácií{AR}</a></div>'

(OUT / "index.html").write_text(page("Interiérové ihriská na mieru | Playground, Trnava", "Interiérové ihriská na mieru pre rodinné centrá, kaviarne, hotely a škôlky. Navrhujeme, vyrábame a montujeme. Trnava.", hero + f'<section class="panels">{panels}</section>' + strip + cta(), ""), encoding="utf-8")


# ---------- realizácie ----------
def bt(p, i):
    slug, title, place, typ, desc, n, src = p
    return f'''<article class="bt rv" style="--d:{(i % 3) * .06:.2f}s"><a class="bt-in" href="https://play-ground.sk/portfolio/{src}/" data-slug="{slug}">
  <div class="ph" data-img="assets/obsah/img/projekt-{n}.jpg" data-depth="assets/depth/projekt-{n}-depth.jpg"><img src="assets/obsah/img/projekt-{n}.jpg" alt="{html.escape(title)}, {html.escape(place)}" loading="lazy" width="1536" height="1152"></div>
  <div class="cap"><div><span class="lab">{html.escape(place)}</span><h3>{nb(html.escape(title))}</h3></div><span class="ico">{AR}</span></div>
</a></article>'''


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
head = '<div class="page-head"><h1 class="rv">Realizácie</h1><p class="lab">12 projektov, SK a CZ</p></div>'
(OUT / "projekty.html").write_text(page("Realizácie interiérových ihrísk | Playground", "Realizované interiérové ihriská na Slovensku a v Česku: nové ihriská, prerábky, presťahovania a obnovy.", head + build + f'<section class="sec"><div class="bento">{"".join(bt(p, i) for i, p in enumerate(P))}</div></section>' + cta(), "projekty.html", modal), encoding="utf-8")


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
      <div class="prog" aria-hidden="true"><i></i><i></i><i></i></div>
      <fieldset><legend class="lab"><b>1</b>Čo potrebujete</legend><div class="tiles">{tiles()}</div></fieldset>
      <fieldset><legend class="lab"><b>2</b>Typ prevádzky</legend><div class="chips">{chips()}</div></fieldset>
      <fieldset><legend class="lab"><b>3</b>Vaše údaje</legend>
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
    <div class="thanks" role="status"><svg viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="M8 25l11 11L40 11"/></svg><h2>Ďakujeme</h2><p>Otvorili sme e-mail s vaším dopytom. Stačí ho odoslať.</p><canvas class="pit" aria-hidden="true"></canvas></div>
  </div>
</section>'''
(OUT / "kontakt.html").write_text(page("Kontakt a dopyt | Playground, Trnava", "Kontakt na PLAYGROUND, s.r.o., Trnava. Dopyt na interiérové ihrisko.", kontakt, "kontakt.html"), encoding="utf-8")
print("ok")
