#!/usr/bin/env python3
"""PLAYGROUND v9: statické HTML v 4 jazykoch.

SK je v koreni v9/, CZ, EN a DE v podpriečinkoch cz/, en/, de/ (adresy podstránok sú vo všetkých jazykoch rovnaké).
Texty: _build/i18n/*.json (prevzaté z v9-next po stretnutí s klientom), nové texty priamo tu cez T(sk, cz, en, de).
Spustenie: python3 _build/build.py   (HTML súbory sa prepíšu, ručne ich neupravovať)
"""
import html
import json
import os
import re

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
V = os.path.dirname(HERE)
LANGS = ["sk", "cz", "en", "de"]
HL = {"sk": "sk", "cz": "cs", "en": "en", "de": "de"}
LOC = {"sk": "sk_SK", "cz": "cs_CZ", "en": "en_GB", "de": "de_DE"}
DIRS = {"sk": "", "cz": "cz/", "en": "en/", "de": "de/"}
BASE = "https://play-ground.sk/"
PAGES = ["index", "ihriska", "prerabka", "revizie", "realizacie", "o-nas", "kontakt"]
NAV = ["ihriska", "prerabka", "revizie", "realizacie", "o-nas", "kontakt"]

MSG = {L: json.load(open(f"{HERE}/i18n/{L}.json", encoding="utf-8")) for L in LANGS}
FAQ = {L: json.load(open(f"{HERE}/i18n/faq-{L}.json", encoding="utf-8")) for L in LANGS}
SEO = {L: json.load(open(f"{HERE}/i18n/seo-{L}.json", encoding="utf-8")) for L in LANGS}

# Slinkee nemá písmená s diakritikou a jeho „I“ vyzerá ako J: tieto nadpisy majú iné Slinkee písmeno
OVR = {
    "cz": {"ihriska.places.h": "Pro provozy, kde jsou {D}ěti",
           "prerabka.why.h": "Často rychlejší a levnější než nové {H}řiště"},
    "de": {"home.chapters[2].h": "Ein Gerüst nach Ihren {W}änden",
           "ihriska.places.h": "Für Betriebe, in denen Kinder {S}ind",
           "prerabka.process.h": "Umbau Schritt für {S}chritt",
           "prerabka.why.h": "Oft schneller und günstiger als ein neuer Spielpl{<A}tz"},
}


class C:
    lang = "sk"
    R = ""      # cesta ku koreňu webu (assets)
    page = "index"
    faq = []    # otázky na aktuálnej stránke (pre JSON-LD)


def m(key):
    if key in OVR.get(C.lang, {}):
        return OVR[C.lang][key]
    o = MSG[C.lang]
    for part in re.findall(r"[^.\[\]]+|\[\d+\]", key):
        o = o[int(part[1:-1])] if part.startswith("[") else o[part]
    return o


def T(sk, cz, en, de):
    return {"sk": sk, "cz": cz, "en": en, "de": de}[C.lang]


def esc(t):
    return html.escape(t, quote=True)


def fmt(t):
    """text -> HTML: Slinkee písmená {X}, {<X}, {X>}; slovo so Slinkee sa nezalomí; jednopísmenové predložky v SK a CZ držia so slovom"""
    if C.lang in ("sk", "cz"):
        t = re.sub(r"(?<![^\s(])([aAiIoOuUvVsSzZkK]) ", "\\1\u00a0", t)
    t = re.sub(r"\bEN (\d)", "EN\u00a0\\1", t)
    marks = []

    def mk(mo):
        cls = "sl" + (" sl--loose-left" if mo.group(1) else "") + (" sl--loose-right" if mo.group(3) else "")
        marks.append(f'<span class="{cls}">{html.escape(mo.group(2))}</span>')
        return f"\x00{len(marks) - 1}\x00"

    t = re.sub(r"\{(<?)([^{}<>])(>?)\}", mk, t)
    out = []
    for tok in t.split(" "):
        e = html.escape(tok, quote=False)
        if "\x00" in e:
            e = f'<span class="w">{re.sub(chr(0) + r"(\d+)" + chr(0), lambda mo: marks[int(mo.group(1))], e)}</span>'
        out.append(e)
    return " ".join(out).replace("\u00a0", "&nbsp;").replace("\n", "<br>")


def plain(t):
    """text bez Slinkee značiek (titulky, alt, JSON-LD)"""
    return re.sub(r"\{<?([^{}<>])>?\}", r"\1", t)


AR = '<span class="ar" aria-hidden="true">→</span>'


def P(page):
    return "./" if page == "index" else f"{page}.html"


def url(L, page):
    return BASE + DIRS[L] + ("" if page == "index" else f"{page}.html")


_size = {}


def isize(path):
    if path not in _size:
        _size[path] = Image.open(f"{V}/{path}").size
    return _size[path]


def fig(path, alt, cls="r43", wipe=True, eager=False):
    w, h = isize(path)
    d = path.replace(".webp", "-d.webp")
    dd = f' data-depth="{C.R}{d}"' if os.path.exists(f"{V}/{d}") else ""
    load = "" if eager else ' loading="lazy"'
    return (f'<figure class="dp{" wipe" if wipe else ""} {cls}"{dd}><img src="{C.R}{path}" alt="{esc(plain(alt))}" '
            f'width="{w}" height="{h}"{load} decoding="async"></figure>')


def tel():
    return f'<a class="tel" href="tel:{m("common.phoneHref")}">{m("common.phone")}</a>'


def btn_dopyt(co=""):
    q = f"?co={co}" if co else ""
    return f'<a class="btn btn--red" href="kontakt.html{q}">{esc(m("common.cta"))} {AR}</a>'


def sec_hd(eb, h, hid=None, n=None):
    num = f'<span class="n">{n}</span> ' if n else ""
    i = f' id="{hid}"' if hid else ""
    return (f'    <div class="sec-hd">\n      <p class="eb rv">{num}{fmt(eb)}</p>\n'
            f'      <h2 class="h h2"{i} data-split>{fmt(h)}</h2>\n    </div>\n')


def rows(items, short=False):
    lis = []
    for k, it in enumerate(items):
        t, p = (it, None) if isinstance(it, str) else it
        pp = f'<p class="p">{fmt(p)}</p>' if p else ""
        lis.append(f'      <li class="row"><span class="n">{k + 1:02d}</span><h3 class="h h3">{fmt(t)}</h3>{pp}</li>')
    return f'    <ol class="rows{" rows--short" if short else ""}">\n' + "\n".join(lis) + "\n    </ol>\n"


def faq_block(items):
    C.faq += items
    qs = "\n".join(
        f'        <details class="qa"><summary><h3 class="h h3">{fmt(q)}</h3><i class="pm" aria-hidden="true"></i></summary>'
        f'<div class="a"><p class="p">{fmt(a)}</p></div></details>' for q, a in items)
    return f'    <div class="faq-grid">\n      <div class="faq">\n{qs}\n      </div>\n    </div>\n'


def faq_sec(items, n=None):
    return ('  <section class="sec" aria-labelledby="faq-h">\n' + sec_hd(m("o-nas.faq.eb"), m("o-nas.faq.h"), "faq-h", n)
            + faq_block(items) + "  </section>\n")


def F(*idx):
    return [(FAQ[C.lang][i]["q"], FAQ[C.lang][i]["a"]) for i in idx]


def cta(co=""):
    return f'''  <section class="cta" aria-labelledby="cta-h">
    <h2 class="h" id="cta-h" data-split>{fmt(m("cta.title"))}</h2>
    <p class="lead rv">{fmt(m("cta.lead"))}</p>
    <div class="acts rv" data-d=".1">
      {btn_dopyt(co)}
      {tel()}
    </div>
  </section>
'''


# ---------------- realizácie (spoločné dáta) ----------------
RZ = [  # slug, obálka, skupina
    ("trnava", "img/projekt-04.webp", "nove"),
    ("dunajska-luzna", "img/projekt-07.webp", "prerabka"),
    ("klatovy", "rz/klatovy/02.webp", "obnova"),
    ("samorin", "img/projekt-02.webp", "nove"),
    ("hlohovec", "img/projekt-10.webp", "prerabka"),
    ("pezinok", "img/projekt-05.webp", "nove"),
    ("kraluv-dvur", "img/projekt-01.webp", "prerabka"),
    ("karvina-stena", "img/projekt-11.webp", "obnova"),
    ("karvina-tubing", "img/projekt-12.webp", "obnova"),
    ("praha", "img/projekt-08.webp", "prerabka"),
    ("uhersky-brod", "img/projekt-09.webp", "obnova"),
    ("oravice", "rz/oravice/07.webp", "nove"),
]
RZI = {s: i for i, (s, _, _) in enumerate(RZ)}


def rz_item(i):
    return m(f"realizacie.items[{i}]")


def pcard(slug, cls="r43"):
    i = RZI[slug]
    it = rz_item(i)
    return (f'      <a class="pc" href="realizacie.html#{slug}">{fig(RZ[i][1], it["alt"], cls)}'
            f'<span class="pc-m rv"><span class="pc-pl">{fmt(it["p"])} · {fmt(it["y"])}</span><span class="pc-t">{fmt(it["t"])}</span></span></a>')


def pcards(slugs, c3=False):
    return f'    <div class="pcards{" c3" if c3 else ""}">\n' + "\n".join(pcard(s) for s in slugs) + "\n    </div>\n"


def more(href, label):
    return f'    <div class="sec-more rv"><a class="more" href="{href}">{fmt(label)} {AR}</a></div>\n'


# ======================= stránky =======================

def page_index():
    ch = [(0, 20), (22, 46), (48, 66), (68, 98), (100, 148), (156, 184)]
    arts = []
    for k, (a, b) in enumerate(ch):
        c = m(f"home.chapters[{k}]")
        n = f'<span class="n">{k:02d}</span> ' if k else ""
        tag = "h1" if k == 0 else "h2"
        acts = f'\n            <div class="acts">\n              {btn_dopyt("nove")}\n              {tel()}\n            </div>' if k in (0, 5) else ""
        arts.append(f'''        <article class="ch" data-from="{a}" data-to="{b}">
          <span class="bg"></span>
          <span class="bd" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <div class="in">
            <p class="eb">{n}{fmt(c["eb"])}</p>
            <{tag} class="h">{fmt(c["h"])}</{tag}>
            <p class="p">{fmt(c["p"])}</p>{acts}
          </div>
        </article>''')
    svc = [
        ("ihriska", m("common.nav.ihriska"), T("Návrh, 3D vizualizácia, výroba a montáž na kľúč. Podľa noriem EN 1176 a EN 1177.",
                                               "Návrh, 3D vizualizace, výroba a montáž na klíč. Podle norem EN 1176 a EN 1177.",
                                               "Design, 3D visualisation, manufacture and turnkey installation. To EN 1176 and EN 1177.",
                                               "Planung, 3D-Visualisierung, Fertigung und schlüsselfertige Montage. Nach EN 1176 und EN 1177."),
         "img/projekt-04.webp", rz_item(0)["alt"]),
        ("prerabka", T("Prerábka a sťahovanie", "Přestavba a stěhování", "Rebuild and relocation", "Umbau und Umzug"), m("prerabka.lead"),
         "img/projekt-07.webp", rz_item(1)["alt"]),
        ("revizie", T("Revízie a servis", "Revize a servis", "Inspections and service", "Prüfung und Service"),
         T("Ročné kontroly podľa EN 1176 a EN 1177, opravy a náhradné diely z vlastného skladu.",
           "Roční kontroly podle EN 1176 a EN 1177, opravy a náhradní díly z vlastního skladu.",
           "Annual inspections to EN 1176 and EN 1177, repairs and spare parts from our own stock.",
           "Jährliche Prüfungen nach EN 1176 und EN 1177, Reparaturen und Ersatzteile aus eigenem Lager."),
         "rz/klatovy/02.webp", rz_item(2)["alt"]),
    ]
    cards = "\n".join(
        f'      <a href="{P(p)}">{fig(img, alt, "")}<span class="svc-m rv"><span class="n">{k + 1:02d}</span>'
        f'<span class="h h3">{fmt(t)}</span><span class="ar" aria-hidden="true">→</span><span class="p">{fmt(d)}</span></span></a>'
        for k, (p, t, d, img, alt) in enumerate(svc))
    st = [m(f"o-nas.stats[{i}]") for i in range(3)]
    stats = "\n".join(
        f'      <li class="stat"><b data-count="{s["value"]}" data-suf="{s["suffix"]}">{s["value"]}{s["suffix"]}</b><span>{fmt(lab)}</span></li>'
        for s, lab in zip(st, [st[0]["label"], st[1]["label"], T("krajín", "zemí", "countries", "Länder")]))
    return f'''  <section class="story" id="story" aria-label="{esc(m("home.storyLabel"))}">
    <div class="stage">
      <canvas id="cv" aria-hidden="true"></canvas>
      <div class="chapters">
{chr(10).join(arts)}
      </div>
    </div>
  </section>

  <section class="sec" aria-labelledby="svc-h">
{sec_hd(T("Čo robíme", "Co děláme", "What we do", "Was wir machen"),
        T("Nové, prerobené aj {S}kontrolované", "Nová, přestavěná i {Z}kontrolovaná", "New, rebuilt and {C}hecked", "Neu, umgebaut und {G}eprüft"), "svc-h")}    <div class="intro"><p class="lead rv">{fmt(T(
        "PLAYGROUND z Trnavy navrhuje, vyrába a montuje interiérové detské ihriská na mieru pre rodinné centrá, kaviarne, hotely, škôlky a aquaparky. Staré ihriská prerábame a sťahujeme, hotové kontrolujeme a servisujeme.",
        "PLAYGROUND z Trnavy navrhuje, vyrábí a montuje interiérová dětská hřiště na míru pro rodinná centra, kavárny, hotely, školky a aquaparky. Stará hřiště přestavujeme a stěhujeme, hotová kontrolujeme a servisujeme.",
        "PLAYGROUND from Trnava, Slovakia, designs, manufactures and installs custom indoor playgrounds for family centres, cafés, hotels, nurseries and water parks. We rebuild and relocate old playgrounds and inspect and service existing ones.",
        "PLAYGROUND aus Trnava (Slowakei) plant, fertigt und montiert Indoor-Spielplätze nach Maß für Familienzentren, Cafés, Hotels, Kindergärten und Aquaparks. Alte Spielplätze bauen wir um oder ziehen sie um, bestehende prüfen und warten wir."))}</p></div>
    <div class="svc">
{cards}
    </div>
  </section>

  <section class="sec" aria-label="{esc(m("o-nas.statsLabel"))}">
    <ul class="stats stg">
{stats}
    </ul>
  </section>

  <section class="sec" aria-labelledby="rz-h">
{sec_hd(m("common.nav.realizacie"), T("Postavené, nie {N}akreslené", "Postavená, ne {N}akreslená", "Built, not just {D}rawn", "Gebaut, nicht nur {G}ezeichnet"), "rz-h")}{pcards(["samorin", "hlohovec", "pezinok", "karvina-tubing"])}{more("realizacie.html", m("o-nas.samorin.more"))}  </section>

{faq_sec(F(0, 1, 3, 10))}
{cta("nove")}'''


def page_ihriska():
    steps = [m(f"home.chapters[{i}].eb") for i in range(1, 6)]
    sp = [T("Zistíme, pre koho je ihrisko a čo od neho čakáte.", "Zjistíme, pro koho je hřiště a co od něj očekáváte.",
            "We find out who the playground is for and what you expect from it.", "Wir klären, für wen der Spielplatz ist und was Sie von ihm erwarten."),
          T("Presne zameriame plochu, výšku stropu, vstupy a okná.", "Přesně zaměříme plochu, výšku stropu, vstupy a okna.",
            "We precisely measure the floor area, ceiling height, entrances and windows.", "Wir vermessen Fläche, Deckenhöhe, Eingänge und Fenster genau."),
          T("Návrh, ktorý využije dostupný priestor a sedí na cieľovú skupinu.", "Návrh, který využije dostupný prostor a sedí cílové skupině.",
            "A design that makes use of the available space and suits the target group.", "Ein Entwurf, der den verfügbaren Raum nutzt und zur Zielgruppe passt."),
          T("Konštrukcia, obaly a herné prvky.", "Konstrukce, obaly a herní prvky.", "Structure, padding and play elements.", "Konstruktion, Polsterung und Spielelemente."),
          T("Ihrisko odovzdáme pripravené na okamžité používanie.", "Hřiště předáme připravené k okamžitému používání.",
            "We hand over the playground ready for immediate use.", "Wir übergeben den Spielplatz sofort betriebsbereit.")]
    els = [m(f"ihriska.elements.items[{i}]") for i in range(6)]
    places = [(m(f"ihriska.places.items[{i}].t"), m(f"ihriska.places.items[{i}].p")) for i in range(5)]
    return f'''  <section class="ph">
    <p class="eb rv" data-now>{fmt(m("ihriska.eb"))}</p>
    <h1 class="h h1" data-split="now">{fmt(m("ihriska.h1"))}</h1>
    <div class="ih-top">
      <div class="txt">
        <p class="lead rv" data-now data-d=".15">{fmt(m("ihriska.lead"))}</p>
        <div class="acts rv" data-now data-d=".25">
          {btn_dopyt("nove")}
          <a class="more" href="./">{fmt(m("ihriska.more"))}</a>
        </div>
      </div>
      <figure class="v3d">
        <div class="v3d-in r169"><canvas role="img" aria-label="{esc(m("ihriska.vizLabel"))}"></canvas></div>
        <figcaption class="cap">{fmt(m("ihriska.vizCap"))}</figcaption>
      </figure>
    </div>
  </section>

  <section class="sec grid">
    <div class="c-txt">
      <p class="eb rv"><span class="n">01</span> {fmt(m("ihriska.construction.eb"))}</p>
      <h2 class="h h2" data-split>{fmt(m("ihriska.construction.h"))}</h2>
      <p class="p rv">{fmt(m("ihriska.construction.p[0]"))}</p>
      <p class="p rv">{fmt(m("ihriska.construction.p[1]"))}</p>
    </div>
    <div class="c-fig">{fig("img/projekt-05.webp", m("ihriska.construction.alt"), "r34")}</div>
  </section>

  <section class="sec">
{sec_hd(T("Postup", "Postup", "Process", "Ablauf"), T("Päť krokov po {O}dovzdanie", "Pět kroků k {P}ředání", "Five steps to {H}andover", "Fünf Schritte bis zur Über{G}abe"), n="02")}{rows(list(zip(steps, sp)))}{more("./", m("ihriska.more"))}  </section>

  <section class="sec">
{sec_hd(m("ihriska.elements.eb"), m("ihriska.elements.h"), n="03")}{rows(els, short=True)}    <p class="p rv" style="margin-top:24px">{fmt(m("ihriska.elements.note"))}</p>
    <div class="full" style="margin-top:clamp(56px,7vw,112px)">{fig("rz/trnava/02.webp", m("ihriska.elements.alt"), "r21")}</div>
  </section>

  <section class="sec">
{sec_hd(m("ihriska.places.eb"), m("ihriska.places.h"), n="04")}{rows(places)}  </section>

  <section class="sec grid flip">
    <div class="c-txt">
      <p class="eb rv"><span class="n">05</span> {fmt(m("ihriska.material.eb"))}</p>
      <h2 class="h h2" data-split>{fmt(m("ihriska.material.h"))}</h2>
      <p class="p rv">{fmt(m("ihriska.material.p[0]"))}</p>
      <p class="p rv">{fmt(m("ihriska.material.p[1]"))}</p>
      <div class="acts rv"><a class="more" href="revizie.html">{fmt(m("ihriska.material.linkRevizie"))} {AR}</a><a class="more" href="realizacie.html">{fmt(m("ihriska.material.linkRealizacie"))} {AR}</a></div>
    </div>
    <div class="c-fig">{fig("rz/trnava/07.webp", m("ihriska.material.alt"), "r34")}</div>
  </section>

  <section class="sec">
{sec_hd(m("common.nav.realizacie"), T("Nové ihriská z {P}raxe", "Nová hřiště z {P}raxe", "New playgrounds in {P}ractice", "Neue Spielplätze aus der {P}raxis"), n="06")}{pcards(["trnava", "samorin", "oravice"], c3=True)}{more("realizacie.html", m("o-nas.samorin.more"))}  </section>

{faq_sec(F(2, 4, 8, 9), "07")}
{cta("nove")}'''


def page_prerabka():
    st = [m(f"prerabka.process.steps[{i}]") for i in range(5)]
    at = ["0", ".16", ".40", ".60", ".84"]
    steps = "\n".join(f'          <li data-at="{a}"><span class="n">{k + 1:02d}</span> {fmt(s)}</li>' for k, (a, s) in enumerate(zip(at, st)))
    lst = "\n".join(f"        <li>{fmt(m(f'prerabka.rebuild.list[{i}]'))}</li>" for i in range(5))
    when = [
        (T("Konštrukcia je v poriadku", "Konstrukce je v pořádku", "The structure is sound", "Die Konstruktion ist in Ordnung"),
         T("Železo, spojky a moduly sú nepoškodené, opotrebované sú len obaly, siete alebo prvky.",
           "Železo, spojky a moduly jsou nepoškozené, opotřebované jsou jen obaly, sítě nebo prvky.",
           "The steel, connectors and modules are undamaged. Only the padding, nets or elements are worn.",
           "Stahl, Verbinder und Module sind unbeschädigt, abgenutzt sind nur Polster, Netze oder Elemente.")),
        (T("Ihrisko nespĺňa normy", "Hřiště nesplňuje normy", "The playground does not meet the standards", "Der Spielplatz erfüllt die Normen nicht"),
         T("Staré, najčastejšie čínske ihrisko upravíme podľa aktuálnych noriem EN 1176 a EN 1177.",
           "Staré, nejčastěji čínské hřiště upravíme podle aktuálních norem EN 1176 a EN 1177.",
           "We bring an old playground, most often a Chinese one, up to the current EN 1176 and EN 1177 standards.",
           "Einen alten, meist chinesischen Spielplatz passen wir an die aktuellen Normen EN 1176 und EN 1177 an.")),
        (T("Chcete nový vzhľad", "Chcete nový vzhled", "You want a new look", "Sie wünschen ein neues Aussehen"),
         T("Nové farby, dizajn, lepšie využitie priestoru a nové atrakcie bez kúpy celého ihriska.",
           "Nové barvy, design, lepší využití prostoru a nové atrakce bez koupě celého hřiště.",
           "New colours, design, better use of space and new attractions without buying a whole new playground.",
           "Neue Farben, neues Design, bessere Raumnutzung und neue Attraktionen, ohne einen ganzen Spielplatz zu kaufen.")),
        (T("Sťahujete prevádzku", "Stěhujete provoz", "You are moving your venue", "Sie ziehen mit Ihrem Betrieb um"),
         T("Ihrisko rozoberieme, prevezieme a postavíme v novom priestore, aj s úpravou na nový rozmer.",
           "Hřiště rozebereme, převezeme a postavíme v novém prostoru, i s úpravou na nový rozměr.",
           "We dismantle, transport and rebuild the playground in the new space, adapted to the new dimensions if needed.",
           "Wir bauen den Spielplatz ab, transportieren ihn und bauen ihn am neuen Ort auf, bei Bedarf an die neuen Maße angepasst.")),
    ]
    return f'''  <section class="ph">
    <p class="eb rv" data-now>{fmt(m("prerabka.eb"))}</p>
    <h1 class="h h1" data-split="now">{fmt(m("prerabka.h1"))}</h1>
    <p class="lead rv" data-now data-d=".15">{fmt(m("prerabka.lead"))}</p>
    <div class="acts rv" data-now data-d=".25">
      {btn_dopyt("prerabka")}
      {tel()}
    </div>
    <div class="full" style="margin-top:clamp(48px,6vw,96px)">{fig("img/projekt-07.webp", m("prerabka.alt"), "r21")}</div>
    <p class="cap rv">{fmt(m("prerabka.cap"))}</p>
  </section>

  <section class="sec">
    <div class="sec-hd">
      <p class="eb rv"><span class="n">01</span> {fmt(m("prerabka.process.eb"))}</p>
      <h2 class="h h2" data-split>{fmt(m("prerabka.process.h"))}</h2>
      <p class="p rv p3d-lead">{fmt(m("prerabka.process.p"))}</p>
    </div>
    <div class="p3d">
      <div class="p3d-stage">
        <ol class="p3d-steps">
{steps}
        </ol>
        <figure class="p3d-visual">
          <div class="p3d-view" role="img" aria-label="{esc(m("prerabka.process.vizLabel"))}"></div>
          <figcaption class="cap">{fmt(m("prerabka.process.vizCap"))}</figcaption>
        </figure>
      </div>
    </div>
  </section>

  <section class="sec two">
    <div>
      <p class="eb rv"><span class="n">02</span> {fmt(m("prerabka.rebuild.eb"))}</p>
      <h2 class="h h3 rv">{fmt(m("prerabka.rebuild.h"))}</h2>
      <p class="p rv">{fmt(m("prerabka.rebuild.p"))}</p>
      <ul class="ul stg">
{lst}
      </ul>
    </div>
    <div>
      <p class="eb rv"><span class="n">03</span> {fmt(m("prerabka.moving.eb"))}</p>
      <h2 class="h h3 rv">{fmt(m("prerabka.moving.h"))}</h2>
      <p class="p rv">{fmt(m("prerabka.moving.p"))}</p>
      {fig("img/projekt-10.webp", m("prerabka.moving.alt"), "r169")}
      <p class="cap rv">{fmt(m("prerabka.moving.cap"))}</p>
    </div>
  </section>

  <section class="sec">
{sec_hd(T("Kedy sa oplatí", "Kdy se vyplatí", "When it pays off", "Wann es sich lohnt"),
        T("Prerábka má {Z}mysel, keď", "Přestavba dává {S}mysl, když", "A rebuild makes {S}ense when", "Ein Umbau lohnt {S}ich, wenn"), n="04")}{rows(when)}  </section>

  <section class="sec">
    <div class="sec-hd say-hd">
      <p class="eb rv"><span class="n">05</span> {fmt(m("prerabka.why.eb"))}</p>
      <h2 class="h say" data-split>{fmt(m("prerabka.why.h"))}</h2>
    </div>
  </section>

  <section class="sec sec--tight">
{sec_hd(m("common.nav.realizacie"), T("Prerobené a {P}resťahované", "Přestavěná a {P}řestěhovaná", "Rebuilt and {R}elocated", "Umgebaut und {U}mgezogen"), n="06")}{pcards(["dunajska-luzna", "hlohovec", "klatovy", "kraluv-dvur"])}{more("realizacie.html", m("prerabka.why.more"))}  </section>

{faq_sec(F(6, 7), "07")}
{cta("prerabka")}'''


def page_revizie():
    scope = [T("Nosná konštrukcia a spoje", "Nosná konstrukce a spoje", "Load-bearing structure and joints", "Tragkonstruktion und Verbindungen"),
             T("Siete a ich uchytenie", "Sítě a jejich uchycení", "Nets and their fixings", "Netze und ihre Befestigung"),
             T("Penové obaly a vinyl", "Pěnové obaly a vinyl", "Foam padding and vinyl", "Schaumstoffpolster und Vinyl"),
             T("Šmykľavky a herné prvky", "Skluzavky a herní prvky", "Slides and play elements", "Rutschen und Spielelemente"),
             T("Dopadové plochy podľa EN 1177", "Dopadové plochy podle EN 1177", "Impact surfaces to EN 1177", "Fallschutzflächen nach EN 1177"),
             T("Medzery, v ktorých by sa dieťa mohlo zachytiť", "Mezery, ve kterých by se dítě mohlo zachytit",
               "Gaps in which a child could get trapped", "Spalten, in denen sich ein Kind verfangen könnte")]
    flow = [(T("Termín", "Termín", "Booking", "Termin"),
             T("Napíšte nám alebo zavolajte. Dohodneme termín kontroly.", "Napište nám nebo zavolejte. Domluvíme termín kontroly.",
               "Write or call us and we agree on a date for the inspection.", "Schreiben oder rufen Sie uns an, wir vereinbaren einen Prüftermin.")),
            (T("Kontrola na mieste", "Kontrola na místě", "On-site inspection", "Prüfung vor Ort"),
             T("Ihrisko posúdime podľa noriem EN 1176 a EN 1177.", "Hřiště posoudíme podle norem EN 1176 a EN 1177.",
               "We assess the playground to EN 1176 and EN 1177.", "Wir beurteilen den Spielplatz nach EN 1176 und EN 1177.")),
            (T("Oprava a diely", "Oprava a díly", "Repair and parts", "Reparatur und Teile"),
             T("Opravíme, čo treba, a vymeníme opotrebované diely. Diely máme na sklade.",
               "Opravíme, co je potřeba, a vyměníme opotřebované díly. Díly máme na skladě.",
               "We fix what is needed and replace worn parts. We keep parts in stock.",
               "Wir reparieren, was nötig ist, und tauschen abgenutzte Teile aus. Teile haben wir auf Lager."))]
    freq = (T("Ako často treba kontrolovať detské ihrisko?", "Jak často je třeba kontrolovat dětské hřiště?",
              "How often should a playground be inspected?", "Wie oft muss ein Spielplatz geprüft werden?"),
            T("Norma EN 1176-7 odporúča bežnú vizuálnu kontrolu prevádzkovateľom, prevádzkovú kontrolu raz za jeden až tri mesiace a hlavnú kontrolu raz ročne. Hlavnú ročnú kontrolu a servis robíme my.",
              "Norma EN 1176-7 doporučuje běžnou vizuální kontrolu provozovatelem, provozní kontrolu jednou za jeden až tři měsíce a hlavní kontrolu jednou ročně. Hlavní roční kontrolu a servis děláme my.",
              "EN 1176-7 recommends routine visual checks by the operator, an operational inspection every one to three months and a main inspection once a year. We carry out the annual main inspection and service.",
              "Die EN 1176-7 empfiehlt regelmäßige Sichtkontrollen durch den Betreiber, eine operative Inspektion alle ein bis drei Monate und eine jährliche Hauptinspektion. Die jährliche Hauptinspektion und den Service übernehmen wir."))
    return f'''  <section class="ph">
    <p class="eb rv" data-now>{fmt(m("revizie.eb"))}</p>
    <h1 class="h h1" data-split="now">{fmt(m("revizie.h1"))}</h1>
    <p class="lead rv" data-now data-d=".15">{fmt(m("revizie.lead"))}</p>
    <div class="acts rv" data-now data-d=".25">
      <a class="btn btn--red" href="kontakt.html?co=reviza">{fmt(m("revizie.button"))} {AR}</a>
      {tel()}
    </div>
    <div class="full" style="margin-top:clamp(48px,6vw,96px)">{fig("img/revizie-kontrola-siete.webp", m("revizie.alt"), "r21")}</div>
    <p class="cap rv">{fmt(m("revizie.cap"))}</p>
  </section>

  <section class="sec">
{sec_hd(T("Rozsah", "Rozsah", "Scope", "Umfang"), T("Čo {K}ontrolujeme", "Co {K}ontrolujeme", "What we {C}heck", "Was wir {P}rüfen"), n="01")}{rows(scope, short=True)}  </section>

  <section class="sec">
{sec_hd(T("Priebeh", "Průběh", "How it works", "Ablauf"), T("Od termínu po {O}pravu", "Od termínu po {O}pravu", "From booking to {R}epair", "Vom Termin zur {R}eparatur"), n="02")}{rows(flow)}  </section>

{faq_sec(F(5) + [freq], "03")}
{cta("reviza")}'''


def page_realizacie():
    flt = [("all", T("Všetko", "Vše", "All", "Alle")), ("nove", T("Nové ihriská", "Nová hřiště", "New playgrounds", "Neue Spielplätze")),
           ("prerabka", T("Prerábky a sťahovanie", "Přestavby a stěhování", "Rebuilds and relocations", "Umbauten und Umzüge")),
           ("obnova", T("Obnovy a doplnky", "Obnovy a doplňky", "Renovations and add-ons", "Renovierungen und Ergänzungen"))]
    fb = "\n".join(f'      <button type="button" data-f="{k}" aria-pressed="{"true" if k == "all" else "false"}">{esc(t)}</button>' for k, t in flt)
    excluded_photos = {
        "hlohovec": {"01.webp", "06.webp"},
        "uhersky-brod": {"01.webp", "04.webp"},
        "oravice": {"01.webp", "02.webp", "03.webp", "04.webp", "05.webp", "09.webp"},
        "pezinok": {"09.webp"},
    }
    cards, data = [], []
    for i, (slug, img, g) in enumerate(RZ):
        it = rz_item(i)
        fs = sorted(f for f in os.listdir(f"{V}/rz/{slug}") if f.endswith(".webp") and f not in excluded_photos.get(slug, ()))
        data.append({"s": slug, "t": plain(it["t"]), "p": it["p"], "y": it["y"], "d": it["d"], "f": [[f, *isize(f"rz/{slug}/{f}")] for f in fs]})
        big = (i // 2) % 2 == 0
        pos = "big" if (i % 2 == 0) == big else "small"
        cards.append(f'''      <li class="rz {pos}" data-g="{g}" id="{slug}">
        <button class="rz-card" type="button" data-i="{i}" aria-haspopup="dialog">
          {fig(img, it["alt"], "r43")}
          <span class="rz-meta"><span class="n">{i + 1:02d}</span><span class="rz-t">{fmt(it["t"])}</span><span class="rz-pl">{fmt(it["p"])}<span class="rz-y">{fmt(it["y"])}</span></span><span class="rz-d">{fmt(it["d"])}</span></span>
        </button>
      </li>''')
    C.after_main = f'''
<div class="md" id="md" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="md-t" data-photo="{esc(m("realizacie.modal.photo"))}">
  <div class="md-bar">
    <span class="n"></span>
    <span class="sp"></span>
    <button class="md-prev" type="button">{esc(m("realizacie.modal.prev"))}</button>
    <button class="md-next" type="button">{esc(m("realizacie.modal.next"))}</button>
    <button class="md-x" type="button">{esc(m("realizacie.modal.close"))}</button>
  </div>
  <div class="md-in">
    <div class="md-txt"><p class="eb"></p><h2 class="h" id="md-t"></h2><p class="p"></p></div>
    <div class="md-gal"></div>
  </div>
</div>
'''
    C.data_script = "var RZ = " + json.dumps(data, ensure_ascii=False) + ";"
    return f'''  <section class="ph">
    <p class="eb rv" data-now>{fmt(m("realizacie.eb"))}</p>
    <h1 class="h h1" data-split="now">{fmt(m("realizacie.h1"))}</h1>
    <p class="lead rv" data-now data-d=".15">{fmt(m("realizacie.lead"))}</p>
    <div class="flt rv" data-now data-d=".25" role="group" aria-label="{esc(T("Filter realizácií", "Filtr realizací", "Filter projects", "Projekte filtern"))}">
{fb}
    </div>
  </section>

  <section class="sec" aria-label="{esc(m("realizacie.listLabel"))}">
    <ol class="rz-list">
{chr(10).join(cards)}
    </ol>
  </section>

{cta()}'''


def page_onas():
    st = [m(f"o-nas.stats[{i}]") for i in range(3)]
    stats = "\n".join(
        f'      <li class="stat rv" data-d="{k * .08:.2f}"><b data-count="{s["value"]}" data-suf="{s["suffix"]}">{s["value"]}{s["suffix"]}</b><span>{fmt(s["label"])}</span></li>'
        for k, s in enumerate(st))
    diff = [(m(f"o-nas.diff.rows[{i}].t"), m(f"o-nas.diff.rows[{i}].p")) for i in range(4)]
    countries = T(["Slovensko", "Česko", "Francúzsko", "Taliansko", "Estónsko", "Rumunsko"],
                  ["Slovensko", "Česko", "Francie", "Itálie", "Estonsko", "Rumunsko"],
                  ["Slovakia", "Czechia", "France", "Italy", "Estonia", "Romania"],
                  ["Slowakei", "Tschechien", "Frankreich", "Italien", "Estland", "Rumänien"])
    words = "\n".join(f"      <li><span>{esc(c)}</span></li>" for c in countries)
    alts = [m(f"o-nas.samorin.alts[{i}]") for i in range(3)]
    return f'''  <section class="ph">
    <p class="eb rv" data-now>{fmt(m("o-nas.eb"))}</p>
    <h1 class="h h1" data-split="now">{fmt(m("o-nas.h1"))}</h1>
    <p class="lead rv" data-now data-d=".15">{fmt(m("o-nas.lead"))}</p>
    <ul class="stats" style="margin-top:clamp(48px,6vw,96px)" aria-label="{esc(m("o-nas.statsLabel"))}">
{stats}
    </ul>
  </section>

  <section class="sec">
    <div class="full">{fig("img/samorin-5667.webp", m("o-nas.alt"), "r21")}</div>
  </section>

  <section class="sec">
{sec_hd(m("o-nas.diff.eb"), m("o-nas.diff.h"))}{rows(diff)}  </section>

  <section class="sec">
{sec_hd(T("Kde pôsobíme", "Kde působíme", "Where we work", "Wo wir arbeiten"), T("Šesť {K}rajín", "Šest {Z}emí", "Six {C}ountries", "Sechs {L}änder"))}    <div class="intro"><p class="lead rv">{fmt(T(
        "Sídlo máme v Trnave. Ihriská dovezieme a postavíme na Slovensku aj v zahraničí.",
        "Sídlo máme v Trnavě. Hřiště dovezeme a postavíme na Slovensku i v zahraničí.",
        "We are based in Trnava, Slovakia, and deliver and install playgrounds at home and abroad.",
        "Unser Sitz ist in Trnava, Slowakei. Spielplätze liefern und montieren wir im In- und Ausland."))}</p></div>
    <ul class="words">
{words}
    </ul>
  </section>

  <section class="sec">
{sec_hd(m("o-nas.samorin.eb"), m("o-nas.samorin.h"))}    <div class="sam">
      {fig("img/samorin-5671.webp", alts[0], "r34")}
      {fig("img/samorin-5679.webp", alts[1], "r34")}
      {fig("img/samorin-5684.webp", alts[2], "r34")}
    </div>
{more("realizacie.html#samorin", m("o-nas.samorin.more"))}  </section>

{cta()}'''


def page_kontakt():
    f = lambda k: m("kontakt.form." + k)

    def chips(name, items):
        return "\n".join(f'          <label><input type="radio" name="{name}" value="{esc(v)}"><span>{fmt(t)}</span></label>' for v, t in items)
    svc = [(k, f(f"service.options.{k}")) for k in ["nove", "prerabka", "stahovanie", "reviza", "nafukovacie", "ine"]]
    typ = [(f(f"type.options[{i}]"),) * 2 for i in range(5)]
    kedy = [(f(f"when.options[{i}]"),) * 2 for i in range(4)]
    send = T(["rozmery priestoru a výšku stropu", "pôdorys alebo fotky priestoru", "pre aký vek detí je ihrisko", "typ prevádzky a termín"],
             ["rozměry prostoru a výšku stropu", "půdorys nebo fotky prostoru", "pro jaký věk dětí je hřiště", "typ provozu a termín"],
             ["room dimensions and ceiling height", "a floor plan or photos of the space", "the age of the children", "type of venue and timing"],
             ["Raummaße und Deckenhöhe", "Grundriss oder Fotos des Raums", "Alter der Kinder", "Art des Betriebs und Zeitrahmen"])
    kt = {"errContact": T("Doplňte meno a platný e-mail.", "Doplňte jméno a platný e-mail.", "Please enter your name and a valid email address.",
                          "Bitte geben Sie Ihren Namen und eine gültige E-Mail-Adresse an."),
          "errOther": f("service.otherError"), "errConsent": f("errors.consent"), "errType": f("plan.errType"), "errSize": f("plan.errSize"),
          "chosen": f("plan.fileChosen"), "none": f("mail.none"), "mService": f("mail.service"), "mType": f("mail.type"), "mWhen": f("mail.when"),
          "mPlan": f("mail.plan"), "planYes": f("mail.planYes"), "planNo": f("mail.planNo"), "mName": f("mail.name"), "mEmail": f("mail.email"),
          "mPhone": f("mail.phone"), "mCity": f("mail.city"), "subject": f("mail.subject"), "doneText": f("done.text"), "doneTextPlan": f("done.textPlan"),
          "to": f("done.to"), "copied": f("done.copied")}
    C.data_script = "var KT = " + json.dumps(kt, ensure_ascii=False) + ";"
    addr = esc(m("kontakt.address")).replace("\n", "<br>")
    comp = esc(m("kontakt.company")).replace("\n", "<br>")
    return f'''  <section class="ph">
    <p class="eb rv" data-now>{fmt(m("kontakt.eb"))}</p>
    <h1 class="h h1" data-split="now">{fmt(m("kontakt.h1"))}</h1>
    <p class="lead rv" data-now data-d=".15">{fmt(m("kontakt.lead"))}</p>

    <div class="ko">
      <div class="ko-info rv" data-now data-d=".25">
        <div class="ko-big">
          <a href="tel:{m("common.phoneHref")}">{m("common.phone")}</a>
          <a href="mailto:{m("common.email")}">{m("common.email")}</a>
        </div>
        <dl class="ko-dl">
          <div><dt>{esc(m("kontakt.addressTitle"))}</dt><dd>{addr}</dd></div>
          <div><dt>{esc(m("kontakt.companyTitle"))}</dt><dd>{comp}</dd></div>
        </dl>
        <div class="chk">
          <h2>{esc(T("Čo nám pošlite", "Co nám pošlete", "What to send us", "Was Sie uns schicken können"))}</h2>
          <ul>
{chr(10).join(f"            <li>{fmt(x)}</li>" for x in send)}
          </ul>
        </div>
      </div>

      <div class="f rv" data-now data-d=".35" id="f">
        <form novalidate aria-label="{esc(f("label"))}">
          <fieldset>
            <legend><span class="n">01</span> {fmt(f("service.legend"))}</legend>
            <div class="chips">
{chips("co", svc)}
            </div>
            <div class="sub" id="other" hidden>
              <label class="fld wide"><span>{fmt(f("service.otherLabel"))}</span><input name="co_ine"></label>
            </div>
          </fieldset>
          <fieldset>
            <legend><span class="n">02</span> {fmt(f("type.legend"))}</legend>
            <div class="chips">
{chips("typ", typ)}
            </div>
          </fieldset>
          <fieldset>
            <legend><span class="n">03</span> {fmt(f("when.legend"))}</legend>
            <div class="chips">
{chips("kedy", kedy)}
            </div>
          </fieldset>
          <fieldset>
            <legend><span class="n">04</span> {fmt(f("plan.legend"))}</legend>
            <div class="chips">
{chips("plan", [("ano", f("plan.yes")), ("nie", f("plan.no"))])}
            </div>
            <div class="sub" id="planFile" hidden>
              <label class="file"><span class="fld"><span>{fmt(f("plan.fileLabel"))}</span></span><input type="file" name="plan_file" accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf"><small>{fmt(f("plan.fileHint"))}</small></label>
              <p class="file-msg" aria-live="polite"></p>
            </div>
          </fieldset>
          <fieldset>
            <legend><span class="n">05</span> {fmt(f("contact.legend"))}</legend>
            <div class="fields">
              <label class="fld"><span>{fmt(f("contact.name"))}</span><input name="meno" autocomplete="name" required></label>
              <label class="fld"><span>{fmt(f("contact.email"))}</span><input name="email" type="email" autocomplete="email" required></label>
              <label class="fld"><span>{fmt(f("contact.phone"))}</span><input name="tel" type="tel" autocomplete="tel"></label>
              <label class="fld"><span>{fmt(f("contact.city"))}</span><input name="mesto" autocomplete="address-level2"></label>
              <label class="fld wide"><span>{fmt(f("contact.message"))}</span><textarea name="sprava" placeholder="{esc(f("contact.messagePlaceholder"))}"></textarea></label>
            </div>
          </fieldset>
          <label class="ok"><input type="checkbox" name="suhlas" required><span>{fmt(f("consent"))}</span></label>
          <button class="btn btn--red" type="submit">{esc(f("submit"))} {AR}</button>
          <p class="err" role="alert"></p>
        </form>
        <div class="done" tabindex="-1">
          <h2 class="h">{fmt(f("done.title"))}</h2>
          <p class="p">{fmt(f("done.text"))}</p>
          <div class="acts">
            <a class="btn btn--red" id="mailGo" href="#">{esc(f("done.open"))} {AR}</a>
            <button class="more" type="button" id="copy">{esc(f("done.copy"))}</button>
          </div>
        </div>
      </div>
    </div>
  </section>
'''


BUILDERS = {"index": page_index, "ihriska": page_ihriska, "prerabka": page_prerabka, "revizie": page_revizie,
            "realizacie": page_realizacie, "o-nas": page_onas, "kontakt": page_kontakt}
SCRIPTS = {"index": ["js/home.js"], "ihriska": ["js/ihriska.js"], "realizacie": ["js/realizacie.js"], "kontakt": ["js/kontakt.js"]}


# ======================= kostra stránky =======================

def header(page):
    nav = "\n".join(f'      <li><a href="{P(p)}"{" aria-current=\"page\"" if p == page else ""}>{fmt(m(f"common.nav.{p}"))}</a></li>' for p in NAV)
    mnav = "\n".join(f'    <li class="m-ln"><a href="{P(p)}"{" aria-current=\"page\"" if p == page else ""}>{fmt(m(f"common.nav.{p}"))}</a></li>' for p in NAV)
    langs = "".join(
        f'<a href="{(C.R + DIRS[L] + ("" if page == "index" else page + ".html")) or "./"}" hreflang="{HL[L]}" lang="{HL[L]}"'
        f' title="{esc(MSG[L]["common"]["langNames"][L])}"{" aria-current=\"true\"" if L == C.lang else ""}>{MSG[L]["common"]["langShort"][L]}</a>'
        for L in LANGS)
    lang = f'<div class="lang" role="group" aria-label="{esc(m("common.langLabel"))}">{langs}</div>'
    return f'''<a class="skip" href="#main">{esc(m("common.skip"))}</a>
<div class="ld" id="ld" aria-hidden="true"><div class="ld-bg"></div><div class="ld-logo"><i></i></div></div>

<header class="hd js-hide" id="hd">
  <a class="logo" href="./" aria-label="{esc(m("common.logoLabel"))}"><i></i></a>
  <nav class="nav" aria-label="{esc(m("common.navLabel"))}">
    <ul>
{nav}
    </ul>
  </nav>
  {tel()}
  {lang}
  <a class="btn" href="kontakt.html">{esc(m("common.cta"))}</a>
  <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="sheet" data-open="{esc(m("common.menu"))}" data-close="{esc(m("common.close"))}">{esc(m("common.menu"))}</button>
</header>

<div class="sheet" id="sheet" aria-hidden="true">
  <ul>
{mnav}
  </ul>
  <div class="meta">
    <a href="tel:{m("common.phoneHref")}">{m("common.phone")}</a>
    <a href="mailto:{m("common.email")}">{m("common.email")}</a>
    {lang}
  </div>
</div>
'''


def footer():
    menu = "\n".join(f'        <li><a href="{P(p)}">{fmt(m(f"common.nav.{p}"))}</a></li>' for p in NAV)
    comp = "\n".join(f"        <li>{fmt(x)}</li>" for x in m("footer.company"))
    return f'''<footer class="ft" id="ft">
  <div class="ft-top">
    <div>
      <a class="logo" href="./" aria-label="{esc(m("common.logoLabel"))}"><i></i></a>
      <p class="claim">{fmt(m("footer.claim"))}</p>
    </div>
    <div>
      <h2>{esc(m("footer.contactTitle"))}</h2>
      <ul>
        <li><a href="tel:{m("common.phoneHref")}">{m("common.phone")}</a></li>
        <li><a href="mailto:{m("common.email")}">{m("common.email")}</a></li>
        <li>{fmt(m("footer.address"))}</li>
      </ul>
    </div>
    <div>
      <h2>{esc(m("footer.menuTitle"))}</h2>
      <ul>
{menu}
      </ul>
    </div>
    <div>
      <h2>{esc(m("footer.companyTitle"))}</h2>
      <ul>
{comp}
      </ul>
    </div>
  </div>
  <p class="ft-big" aria-hidden="true"><span class="ft-word">Play<span class="sl">G</span>round</span></p>
  <div class="ft-bot">
    <span>{esc(m("footer.copyright"))}</span>
    <span>{esc(m("footer.place"))}</span>
  </div>
</footer>
'''


def jsonld(page, title, desc):
    org = SEO[C.lang]["organization"]
    oid = BASE + "#org"
    areas = T(["Slovensko", "Česko", "Francúzsko", "Taliansko", "Estónsko", "Rumunsko"],
              ["Slovensko", "Česko", "Francie", "Itálie", "Estonsko", "Rumunsko"],
              ["Slovakia", "Czechia", "France", "Italy", "Estonia", "Romania"],
              ["Slowakei", "Tschechien", "Frankreich", "Italien", "Estland", "Rumänien"])
    graph = [
        {"@type": ["Organization", "LocalBusiness"], "@id": oid, "name": org["name"], "url": BASE, "logo": BASE + "logo.svg",
         "image": BASE + "og.jpg", "email": org["email"], "telephone": org["telephone"],
         "description": MSG[C.lang]["seo"]["orgDescription"],
         "address": {"@type": "PostalAddress", "streetAddress": "Poštová 6562/20", "addressLocality": "Trnava", "postalCode": "917 01", "addressCountry": "SK"},
         "areaServed": areas, "vatID": "SK2023714429", "taxID": "2023714429", "identifier": "IČO 47051990"},
        {"@type": "WebSite", "@id": BASE + "#web", "url": BASE, "name": "PLAYGROUND", "publisher": {"@id": oid},
         "inLanguage": [HL[L] for L in LANGS]},
        {"@type": "WebPage", "@id": url(C.lang, page) + "#page", "url": url(C.lang, page), "name": title, "description": desc,
         "inLanguage": HL[C.lang], "isPartOf": {"@id": BASE + "#web"}, "about": {"@id": oid}},
    ]
    if page != "index":
        graph.append({"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": plain(m("common.nav.home")), "item": url(C.lang, "index")},
            {"@type": "ListItem", "position": 2, "name": plain(m(f"common.nav.{page}")), "item": url(C.lang, page)}]})
    svc = {"ihriska": 0, "prerabka": 1, "revizie": 2}
    if page in svc:
        s = MSG[C.lang]["seo"]["services"][svc[page]]
        graph.append({"@type": "Service", "name": s["name"], "description": s["description"], "provider": {"@id": oid},
                      "areaServed": areas, "url": url(C.lang, page)})
    if C.faq:
        graph.append({"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": plain(q), "acceptedAnswer": {"@type": "Answer", "text": plain(a)}} for q, a in C.faq]})
    return '<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False) + "</script>"


def build(page):
    C.page, C.faq, C.after_main, C.data_script = page, [], "", ""
    main = BUILDERS[page]()
    seo = SEO[C.lang]["pages"][page]
    title, desc = seo["title"], seo["description"]
    alt = "\n".join(f'<link rel="alternate" hreflang="{HL[L]}" href="{url(L, page)}">' for L in LANGS)
    R = C.R
    pre = f'<link rel="preload" href="{R}kav/k000.webp" as="image" fetchpriority="high">\n' if page == "index" else ""
    if page == "ihriska":
        pre = f'<link rel="preload" href="{R}360/r12.webp" as="image">\n'
    imap = ""
    if page == "prerabka":
        imap = '<script type="importmap">' + json.dumps({"imports": {"three": f"{R or './'}vendor/build/three.module.js", "three/addons/": f"{R or './'}vendor/addons/"}}) + "</script>\n"
    scripts = "".join(f'<script src="{R}{s}"></script>\n' for s in SCRIPTS.get(page, []))
    if page == "prerabka":
        scripts += f'<script type="module" src="{R}js/prerabka-3d.js"></script>\n'
    data = f"<script>{C.data_script}</script>\n" if C.data_script else ""
    doc = f'''<!doctype html>
<html lang="{HL[C.lang]}" data-root="{R}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{url(C.lang, page)}">
{alt}
<link rel="alternate" hreflang="x-default" href="{url("sk", page)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="PLAYGROUND">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url(C.lang, page)}">
<meta property="og:image" content="{BASE}og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="{LOC[C.lang]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#DEDDDB">
<link rel="icon" href="{R}favicon.svg" type="image/svg+xml">
<link rel="icon" href="{R}favicon.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="{R}apple-touch-icon.png">
<link rel="preload" href="{R}fonts/PlusJakartaSans.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{R}fonts/Slinkee.woff" as="font" type="font/woff" crossorigin>
{pre}<link rel="stylesheet" href="{R}site.css">
{imap}<script>try{{if(!sessionStorage.getItem("pg-ld")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("ld-on")}}catch(e){{}}</script>
{jsonld(page, title, desc)}
</head>
<body data-page="{"home" if page == "index" else page}">

{header(page)}
<main{" class=\"page\"" if page != "index" else ""} id="main">
{main.rstrip()}
</main>
{C.after_main}
{footer()}
<script src="{R}js/gsap.min.js"></script>
<script src="{R}js/ScrollTrigger.min.js"></script>
<script src="{R}js/SplitText.min.js"></script>
<script src="{R}site.js"></script>
{data}{scripts}</body>
</html>
'''
    out = f"{V}/{DIRS[C.lang]}{page}.html"
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w", encoding="utf-8").write(doc)


def sitemap():
    urls = []
    for page in PAGES:
        for L in LANGS:
            alts = "".join(f'\n    <xhtml:link rel="alternate" hreflang="{HL[K]}" href="{url(K, page)}"/>' for K in LANGS)
            alts += f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{url("sk", page)}"/>'
            urls.append(f"  <url>\n    <loc>{url(L, page)}</loc>{alts}\n  </url>")
    open(f"{V}/sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
                                        'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + "\n".join(urls) + "\n</urlset>\n")
    open(f"{V}/robots.txt", "w").write("User-agent: *\nAllow: /\nDisallow: /_build/\nDisallow: /index-stavba.html\n\n"
                                       f"Sitemap: {BASE}sitemap.xml\n")


if __name__ == "__main__":
    for L in LANGS:
        C.lang, C.R = L, ("" if L == "sk" else "../")
        for p in PAGES:
            build(p)
    sitemap()
    print("hotovo:", len(LANGS) * len(PAGES), "stránok, sitemap.xml, robots.txt")
