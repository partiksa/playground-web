# Generátor písaného nápisu „Napíšte nám" písmom Slinkee (jednotná hrúbka čiary).
# Zo Slinkee obrysov vytiahne stredové čiary, diakritiku dokreslí ako krátke ťahy.
# Výstup: v5/brand/cta-write.js. Spustenie: ~/.cache/loso-write/bin/python tools/cta_write.py
import json, math, sys
from pathlib import Path

src = (Path(__file__).parent / 'write.py').read_text()
exec(src[:src.index('SPEC = ')])  # len pomocné funkcie a písma, nič nezapisuje

TEXT = 'NAPÍŠTE NÁM'
BASE = {'Í': ('I', 'acute'), 'Š': ('S', 'caron'), 'Á': ('A', 'acute')}
hm = sf['hmtx']

# hrúbka ťahu Slinkee v jednotkách písma
m, (_, _, s, _) = raster(glyph_polys(sgs, scmap[ord('I')], (1, 0, 0, -1, 0, 0)), 0.5)
SW = distance_transform_edt(m).max() / s * 2

strokes = []  # [body, písmeno, viditeľný ťah (diakritika)]
outl = []
x = 0.0; top = 1e9; bot = -1e9; right = 0
for ch in TEXT:
    if ch == ' ':
        x += hm[scmap[ord(' ')]][0] * 0.9; continue
    base, mark = BASE.get(ch, (ch, None))
    name = scmap[ord(base)]
    polys = glyph_polys(sgs, name, (1, 0, 0, -1, x, 0))
    st, rad = skel_strokes(polys, 0.45, ext=0.6)
    outl.append(svg_d(sgs, name, (1, 0, 0, -1, x, 0)))
    xs = [p[0] for q in polys for p in q]; ys = [p[1] for q in polys for p in q]
    top = min(top, min(ys)); bot = max(bot, max(ys)); right = max(right, max(xs))
    for p in st: strokes.append((p, ch, 0))
    if mark:
        cx = (min(xs) + max(xs)) / 2; y0 = min(ys) - SW * 1.6
        if mark == 'acute':
            pts = [(cx - SW * 0.9, y0), (cx + SW * 1.3, y0 - SW * 2.0)]
        else:  # mäkčeň
            pts = [(cx - SW * 1.6, y0 - SW * 1.8), (cx, y0 - SW * 0.2), (cx + SW * 1.6, y0 - SW * 1.8)]
        strokes.append((pts, ch, 1))
        top = min(top, min(p[1] for p in pts))
    x += hm[name][0]

pad = SW
x0, y0 = -pad, top - pad
W = right + pad - x0; H = bot + pad - y0
def mv(pts): return [(p[0] - x0, p[1] - y0) for p in pts]
out = {'w': round(W, 1), 'h': round(H, 1), 'sw': round(SW, 1), 'base': round(-y0, 1),
       'x0': round(-x0, 1), 'y0': round(-y0, 1), 'd': ' '.join(outl),
       's': [to_path(mv(p)) for p, _, _ in strokes], 'l': [round(plen(p), 1) for p, _, _ in strokes], 'v': [v for _, _, v in strokes]}
last = mv(strokes[[i for i, (_, c, v) in enumerate(strokes) if not v and c == 'M'][-1]][0])
end = max(last, key=lambda p: (p[1], p[0]))  # pravý spodný koniec písmena M
out['end'] = [round(end[0], 1), round(end[1], 1)]
dst = Path(__file__).resolve().parent.parent / 'v5/brand/cta-write.js'
dst.write_text('// vygenerované nástrojom tools/cta_write.py, neupravovať ručne\nexport default ' + json.dumps(out, separators=(',', ':')) + ';\n')
print('ok', len(strokes), 'ťahov', out['w'], out['h'], 'sw', out['sw'], 'end', out['end'], file=sys.stderr)
