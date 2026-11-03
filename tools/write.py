# Generátor animácie písania: z obrysov písma a loga vytiahne stredovú čiaru (skeleton),
# z nej ťahy v poradí písania. Výstup: v5/brand/writing.js a v5/brand/logo-write.svg.
# Spustenie: ~/.cache/loso-write/bin/python tools/write.py
import json, math, re, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from skimage.morphology import skeletonize
from scipy.ndimage import distance_transform_edt
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.svgLib.path import parse_path
import uharfbuzz as hb

ROOT = Path(__file__).resolve().parent.parent / 'v5'
JAK = ROOT / 'brand/PlusJakartaSans-Bold.ttf'
SLK = ROOT / 'brand/Slinkee.ttf'
SET = 'AEGMN'  # Slinkee len za tieto písmená, nikdy s diakritikou

# ---------- rasterizácia obrysu (even-odd) ----------
class Flat(BasePen):
    def __init__(self, gs=None):
        super().__init__(gs); self.polys = []; self.cur = []
    def _moveTo(self, p): self.cur = [p]
    def _lineTo(self, p): self.cur.append(p)
    def _curveToOne(self, a, b, c):
        p0 = self.cur[-1]
        for i in range(1, 17):
            t = i / 16; u = 1 - t
            self.cur.append((u**3*p0[0] + 3*u*u*t*a[0] + 3*u*t*t*b[0] + t**3*c[0], u**3*p0[1] + 3*u*u*t*a[1] + 3*u*t*t*b[1] + t**3*c[1]))
    def _qCurveToOne(self, a, b):
        p0 = self.cur[-1]
        for i in range(1, 13):
            t = i / 12; u = 1 - t
            self.cur.append((u*u*p0[0] + 2*u*t*a[0] + t*t*b[0], u*u*p0[1] + 2*u*t*a[1] + t*t*b[1]))
    def _closePath(self):
        if len(self.cur) > 2: self.polys.append(self.cur)
        self.cur = []
    _endPath = _closePath

def raster(polys, scale, pad=6):
    xs = [p[0] for q in polys for p in q]; ys = [p[1] for q in polys for p in q]
    x0, y0 = min(xs), min(ys)
    W = int((max(xs) - x0) * scale) + 2 * pad; H = int((max(ys) - y0) * scale) + 2 * pad
    acc = np.zeros((H, W), bool)
    for q in polys:
        im = Image.new('1', (W, H), 0)
        ImageDraw.Draw(im).polygon([((x - x0) * scale + pad, (y - y0) * scale + pad) for x, y in q], fill=1)
        acc ^= np.array(im, bool)
    return acc, (x0, y0, scale, pad)

# ---------- skeleton -> ťahy ----------
N8 = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]

def trace(mask, spur):
    sk = skeletonize(mask)
    pts = set(zip(*np.nonzero(sk)))
    nb = lambda p: [(p[0] + dy, p[1] + dx) for dy, dx in N8 if (p[0] + dy, p[1] + dx) in pts]
    for _ in range(3):  # odstrániť krátke výbežky
        deg = {p: len(nb(p)) for p in pts}
        ends = [p for p in pts if deg[p] == 1]
        removed = False
        for e in ends:
            path = [e]; prev = None; cur = e
            while True:
                n = [q for q in nb(cur) if q != prev and q not in path]
                if len(n) != 1 or len(nb(n[0])) > 2: break
                prev, cur = cur, n[0]; path.append(cur)
                if len(path) > spur: break
            if len(path) <= spur and len(path) < len(pts) * 0.5:
                nxt = [q for q in nb(path[-1]) if q not in path]
                if nxt and any(len(nb(q)) > 2 for q in nxt):
                    pts -= set(path); removed = True
        if not removed: break
    deg = {p: len(nb(p)) for p in pts}
    nodes = {p for p in pts if deg[p] != 2}
    used = set(); edges = []
    for n in nodes:
        for q in nb(n):
            if frozenset((n, q)) in used: continue
            path = [n, q]; used.add(frozenset((n, q)))
            while path[-1] not in nodes:
                nx = [r for r in nb(path[-1]) if frozenset((path[-1], r)) not in used and r != path[-2]]
                if not nx: break
                nx.sort(key=lambda r: (r not in nodes, abs(r[0] - path[-1][0]) + abs(r[1] - path[-1][1])))
                used.add(frozenset((path[-1], nx[0]))); path.append(nx[0])
            edges.append(path)
    seen = {p for e in edges for p in e}
    rest = pts - seen
    while rest:  # uzavreté slučky bez uzlov (napr. O)
        s = min(rest, key=lambda p: (p[0], p[1])); path = [s]; rest.discard(s)
        while True:
            nx = [r for r in nb(path[-1]) if r in rest]
            if not nx: break
            nx.sort(key=lambda r: abs(r[0] - path[-1][0]) + abs(r[1] - path[-1][1]))
            path.append(nx[0]); rest.discard(nx[0])
        path.append(s); edges.append(path)
    edges = [e for e in edges if len(e) > 2]
    # spojiť hrany do ťahov: na uzle pokračovať najrovnejšou hranou
    def dirv(e, at_end):
        a, b = (e[-1], e[max(0, len(e) - 6)]) if at_end else (e[0], e[min(len(e) - 1, 5)])
        v = (b[1] - a[1], b[0] - a[0]); l = math.hypot(*v) or 1
        return (v[0] / l, v[1] / l)
    strokes = []; left = list(range(len(edges)))
    while left:
        cnt = {}
        for i in left:
            for p in (edges[i][0], edges[i][-1]): cnt[p] = cnt.get(p, 0) + 1
        def score(i):
            e = edges[i]; s = [p for p in (e[0], e[-1]) if cnt[p] == 1]
            return (0 if s else 1, min(p[0] for p in (s or [e[0]])))
        i = min(left, key=score); left.remove(i); e = edges[i]
        if cnt[e[0]] != 1 and cnt[e[-1]] == 1: e = e[::-1]
        elif cnt[e[0]] == 1 and cnt[e[-1]] == 1 and e[-1][0] < e[0][0]: e = e[::-1]
        path = list(e)
        while True:
            end = path[-1]; vin = dirv(path, True)
            best = None
            for j in left:
                f = edges[j]
                for g in (f, f[::-1]):
                    if g[0] == end or max(abs(g[0][0] - end[0]), abs(g[0][1] - end[1])) <= 2:
                        vo = dirv(g, False); ang = -(vin[0] * vo[0] + vin[1] * vo[1])  # vin smeruje dozadu
                        if best is None or ang < best[0]: best = (ang, j, g)
            if not best or best[0] > 0.45: break
            left.remove(best[1]); path += best[2][1:]
        strokes.append(path)
    return strokes

def smooth(pts, win=3):
    if len(pts) < 5: return pts
    closed = pts[0] == pts[-1]
    out = []
    for i in range(len(pts)):
        if not closed and (i < win or i >= len(pts) - win): out.append(pts[i]); continue
        xs = [pts[(i + k) % len(pts)][0] for k in range(-win, win + 1)]
        ys = [pts[(i + k) % len(pts)][1] for k in range(-win, win + 1)]
        out.append((sum(xs) / len(xs), sum(ys) / len(ys)))
    return out

def rdp(pts, eps):
    if len(pts) < 3: return pts
    a, b = np.array(pts[0]), np.array(pts[-1]); d = b - a; L = np.hypot(*d)
    arr = np.array(pts)
    r = arr - a
    dist = np.abs(d[0] * r[:, 1] - d[1] * r[:, 0]) / L if L else np.hypot(r[:, 0], r[:, 1])
    i = int(np.argmax(dist))
    if dist[i] > eps: return rdp(pts[:i + 1], eps)[:-1] + rdp(pts[i:], eps)
    return [pts[0], pts[-1]]

def to_path(pts, nd=1):
    f = lambda v: f'{v:.{nd}f}'.rstrip('0').rstrip('.')
    if len(pts) == 2: return f'M{f(pts[0][0])} {f(pts[0][1])}L{f(pts[1][0])} {f(pts[1][1])}'
    d = f'M{f(pts[0][0])} {f(pts[0][1])}'
    for i in range(len(pts) - 1):  # Catmull-Rom -> kubické krivky
        p0 = pts[i - 1] if i > 0 else pts[i]; p1 = pts[i]; p2 = pts[i + 1]; p3 = pts[i + 2] if i + 2 < len(pts) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f'C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}'
    return d

def plen(pts): return sum(math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) for i in range(len(pts) - 1))

def extend(pts, e):
    def ext(a, b):
        dx, dy = a[0] - b[0], a[1] - b[1]; l = math.hypot(dx, dy) or 1
        return (a[0] + dx / l * e, a[1] + dy / l * e)
    k = min(3, len(pts) - 1)
    return [ext(pts[0], pts[k])] + pts + [ext(pts[-1], pts[-1 - k])]

def skel_strokes(polys, scale, orient=True, ext=0):
    """obrys (súradnice v jednotkách) -> ťahy v rovnakých jednotkách + polomer ťahu"""
    m, (x0, y0, s, pad) = raster(polys, scale)
    rad = distance_transform_edt(m).max() / s
    strokes = []
    for st in trace(m, spur=int(rad * s * 1.6)):
        pts = [((p[1] - pad) / s + x0, (p[0] - pad) / s + y0) for p in st]
        pts = rdp(smooth(pts), 0.5 / s * 1.6)
        if plen(pts) < rad * 0.8: continue
        closed = math.hypot(pts[0][0] - pts[-1][0], pts[0][1] - pts[-1][1]) < rad
        if ext and not closed: pts = extend(pts, rad * ext)
        if orient and not closed:
            a, b = pts[0], pts[-1]
            if (a[1] - b[1]) > rad * 1.5 or (abs(a[1] - b[1]) <= rad * 1.5 and a[0] > b[0]): pts = pts[::-1]
        strokes.append(pts)
    strokes.sort(key=lambda p: (min(q[0] for q in p) // (rad * 3), min(q[1] for q in p)))
    return strokes, rad

# ---------- písmo ----------
jf, sf = TTFont(JAK), TTFont(SLK)
jgs, sgs = jf.getGlyphSet(), sf.getGlyphSet()
jcmap, scmap = jf.getBestCmap(), sf.getBestCmap()
CAP = jf['OS/2'].sCapHeight  # výška verzálky Jakarta
S_SCALE = CAP / 640 * 1.04    # Slinkee je unicase, výška ~640
hbface = hb.Face(JAK.read_bytes()); hbfont = hb.Font(hbface)

def glyph_polys(gs, name, tf):
    fp = Flat(gs); gs[name].draw(TransformPen(fp, tf)); return fp.polys

def svg_d(gs, name, tf):
    sp = SVGPathPen(gs); gs[name].draw(TransformPen(sp, tf)); return sp.getCommands()

STEM = None
def stem():
    global STEM
    if STEM is None:
        m, (_, _, s, _) = raster(glyph_polys(jgs, jcmap[ord('I')], (1, 0, 0, -1, 0, 0)), 0.5)
        STEM = distance_transform_edt(m).max() / s * 2
    return STEM

SIDE = None
def side():
    g = jf['hmtx']; a = []
    for ch in 'HNOEM':
        n = jcmap[ord(ch)]; adv, lsb = g[n]; xmax = jf['glyf'][n].xMax
        a.append((lsb + adv - xmax) / 2)
    return sum(a) / len(a) * 2

ink_cache = {}
def slinkee_glyph(ch):
    if ch in ink_cache: return ink_cache[ch]
    name = scmap[ord(ch)]
    polys = glyph_polys(sgs, name, (S_SCALE, 0, 0, -S_SCALE, 0, 0))
    strokes, rad = skel_strokes(polys, 0.45)
    xs = [p[0] for q in polys for p in q]
    ink_cache[ch] = (strokes, min(xs), max(xs)); return ink_cache[ch]

def best_run(pts):
    """najdlhší klesajúci úsek ťahu (y rastie nadol): šmykľavka"""
    best = (0, 0, 0); i = 0
    while i < len(pts) - 1:
        j = i
        while j < len(pts) - 1 and pts[j + 1][1] >= pts[j][1] - 2: j += 1
        drop = pts[j][1] - pts[i][1]
        if drop > best[0]: best = (drop, i, j)
        i = j + 1
    return best

def heading(lines, swaps):
    LH = CAP * 1.4; TOP = CAP * 0.3
    glyphs = []; width = 0
    for li, text in enumerate(lines):
        base = TOP + CAP + li * LH
        buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties(); hb.shape(hbfont, buf, {'kern': True})
        x = 0.0; gap = side() * 0.42
        for ci, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
            ch = text[info.cluster]
            if (li, info.cluster) in swaps and ch in SET:
                strokes, x0, x1 = slinkee_glyph(ch)
                # medzera podľa atramentu: ľavý okraj tesne za predchádzajúcim, ako pri bežných písmenách
                dx = x + gap - x0
                pl = [[(p[0] + dx, p[1] + base) for p in st] for st in strokes]
                runs = [best_run(st) for st in pl]
                k = max(range(len(pl)), key=lambda i: runs[i][0])
                slide = runs[k][0] > CAP * 0.3
                if slide: pl.append(pl.pop(k)); r = runs[k]
                glyphs.append({'t': 's', 'ch': ch, 's': [to_path(st) for st in pl], 'l': [round(plen(st), 1) for st in pl],
                               'slide': [r[1], r[2]] if slide else -1, 'pts': [[round(v, 1) for v in p] for p in pl[-1]] if slide else []})
                x = x1 + dx + gap
                continue
            name = jf.getGlyphName(info.codepoint)
            tf = (1, 0, 0, -1, x + pos.x_offset, base)
            if ch != ' ':
                polys = glyph_polys(jgs, name, tf)
                strokes, rad = skel_strokes(polys, 0.3, ext=1.2)
                glyphs.append({'t': 'j', 'ch': ch, 'd': svg_d(jgs, name, tf), 's': [to_path(st) for st in strokes],
                               'l': [round(plen(st), 1) for st in strokes], 'w': round(rad * 2.7 + 8, 1)})
            x += pos.x_advance
        width = max(width, x)
    h = TOP + CAP + (len(lines) - 1) * LH + CAP * 0.12
    return {'w': round(width, 1), 'h': round(h, 1), 'cap': CAP, 'stem': round(stem(), 1), 'g': glyphs}

def auto_swaps(lines, n=1):
    out = []
    for pref in ('A', 'E', 'N', 'M', 'G'):
        for li, t in enumerate(lines):
            for ci, ch in enumerate(t):
                if ch == pref and (li, ci) not in out and len(out) < n: out.append((li, ci))
    return out

SPEC = json.loads((Path(__file__).parent / 'headings.json').read_text())
data = {}
for k, v in (SPEC.items() if '--headings' in sys.argv else []):  # nadpisy sa už nepíšu, len logo
    sw = [tuple(x) for x in v['swap']] if 'swap' in v else auto_swaps(v['lines'], v.get('n', 1))
    data[k] = heading(v['lines'], sw)
    print(k, len(data[k]['g']), 'glyphs', file=sys.stderr)

# ---------- logo ----------
src = (ROOT / 'assets/PLAYGROUND.svg').read_text()
lpaths = re.findall(r'<path[^>]*\sd="([^"]+)"', src)
lpolys = []
for d in lpaths:
    fp = Flat(); parse_path(d, fp); lpolys += fp.polys
lstrokes, lrad = skel_strokes(lpolys, 10, orient=False, ext=0.8)
# poradie: P (najväčší ťah) prvé, potom písmená zľava doprava, podčiarknutie úplne na konci
# podčiarknutie je rozdelené kľučkami y a g na viac kúskov: spojiť do jedného ťahu zľava doprava
def is_under(p):
    ys = [q[1] for q in p]
    closed = math.hypot(p[0][0] - p[-1][0], p[0][1] - p[-1][1]) < 2
    return min(ys) >= 104 and max(ys) - min(ys) < 18 and not closed
under = sorted([p if p[0][0] < p[-1][0] else p[::-1] for p in lstrokes if is_under(p)], key=lambda p: p[0][0])
line = [q for p in under for q in p]
lstrokes = [p for p in lstrokes if not is_under(p)]
big = max(lstrokes, key=plen)
lstrokes.sort(key=lambda p: (p is not big, min(q[0] for q in p)))
lstrokes.append(line)
logo = {'w': 312.5, 'h': 134.1, 'd': lpaths, 's': [to_path(s, 2) for s in lstrokes], 'l': [round(plen(s), 2) for s in lstrokes], 'mw': round(lrad * 2.6 + 0.8, 2)}
data['_logo'] = logo
(ROOT / 'brand/writing.js').write_text('// vygenerované nástrojom tools/write.py, neupravovať ručne\nexport default ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')

# logo-write.svg: slučka pre načítavanie (logo sa píše čiarou, potom zmizne)
T = 2.0; tot = sum(logo['l']); acc = 0; rules = []; masks = []
for i, (d, L) in enumerate(zip(logo['s'], logo['l'])):
    a, b = acc / tot * 0.62, (acc + L) / tot * 0.62; acc += L
    rules.append(f'@keyframes k{i}{{0%,{a*100:.1f}%{{stroke-dashoffset:{L}}}{b*100:.1f}%,100%{{stroke-dashoffset:0}}}}.s{i}{{stroke-dasharray:{L+1} {3*L+20};animation:k{i} {T+0.8}s linear infinite}}')
    masks.append(f'<path class="s{i}" d="{d}"/>')
css = 'path{fill:none;stroke:#fff;stroke-width:%s;stroke-linecap:round;stroke-linejoin:round}g{animation:o %ss infinite}@keyframes o{0%%,80%%{opacity:1}96%%,100%%{opacity:0}}' % (logo['mw'], T + 0.8) + ''.join(rules)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 312.5 134.1"><style>{css}</style><mask id="m" maskUnits="userSpaceOnUse">{"".join(masks)}</mask><g><path style="fill:#FF2712;stroke:none" mask="url(#m)" d="{" ".join(lpaths)}"/></g></svg>'
(ROOT / 'brand/logo-write.svg').write_text(svg)
print('ok', len(lstrokes), 'logo strokes', file=sys.stderr)
