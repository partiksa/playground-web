"""Spolocne pomocky pre serie voskovkovych ilustracii Playground (Crayon z claude-drawing)."""
import os, sys
sys.path.insert(0, '/Users/patriksarkozy/.claude/skills/claude-drawing/lib')
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from crayon import Crayon, hexc
from core import spline, blur

OUTDIR = '/Users/patriksarkozy/Desktop/AI/loso/v6/ill/crayon'
PREVIEW = '/tmp/crayon_prev'
os.makedirs(OUTDIR, exist_ok=True); os.makedirs(PREVIEW, exist_ok=True)

P = {k: hexc(v) for k, v in dict(
    red='#FF2712', blue='#2a63c9', sky='#5fb1ea', yellow='#fcd22e', turq='#1fb5b0', violet='#7550b0',
    orange='#f5821f', pink='#f27aa8', out='#2a2826', brown='#8a5230', tan='#d29a5c', grey='#8c8c8c',
    peach='#f6c7a1', green='#2f9e48', white='#fbfaf5', navy='#253b8a').items()}
BRIGHT = ['red', 'blue', 'yellow', 'turq', 'violet']


def arc(cx, cy, rx, ry, a0, a1, n=40):
    t = np.radians(np.linspace(a0, a1, n))
    return np.stack([cx + rx * np.cos(t), cy - ry * np.sin(t)], 1)


def new(W, H, seed):
    c = Crayon(W, H, seed=seed)
    c.paper()
    return c


class Pen:
    """kresli v navrhovych suradniciach; S = nasobok vykreslenia (jemnejsie voskovky po zmenseni)"""
    def __init__(self, c, lw=3.5, S=2):
        self.c, self.lw, self.S = c, lw, S

    def _p(self, pts):
        return np.asarray(pts, np.float32) * self.S

    def shape(self, pts, col, ang=30, w=8, line=True, dens=0.8, pres=0.9, mess=0.2, lw=None, lcol='out', loops=False):
        """pts su uz v pixeloch vykreslenia (vyrobene cez self.rect/poly/circ)"""
        c, S = self.c, self.S
        m = c.mask(pts)
        if col is not None:
            if loops:
                c.loops(m, P[col], r=max(8, w * S * 0.6), width=w * S, density=dens, pressure=pres)
            else:
                c.scribble(m, P[col], angle=ang, width=w * S, density=dens, pressure=pres, reach=None, mess=mess)
        if line:
            c.line(pts, P[lcol], width=(lw or self.lw) * S, closed=True)
        return m

    def rect(self, x0, y0, x1, y1, col, skew=1.2, **kw):
        return self.shape(self.c.rect(x0 * self.S, y0 * self.S, x1 * self.S, y1 * self.S, skew=skew * self.S, amp=0.9 * self.S), col, **kw)

    def poly(self, pts, col, **kw):
        return self.shape(self.c.poly(self._p(pts), amp=0.9 * self.S), col, **kw)

    def circ(self, cx, cy, rx, ry=None, col=None, **kw):
        S = self.S
        return self.shape(self.c.circle(cx * S, cy * S, rx * S, (ry or rx) * S, amp=0.9 * S), col, **kw)

    def line(self, pts, col='out', w=None, spl=False, **kw):
        p = self._p(pts)
        if spl: p = spline(p, 10)
        self.c.line(p, P[col], width=(w or self.lw) * self.S, **kw)

    def bar(self, x0, y0, x1, y1, th, col, lw=None, **kw):
        a = np.array([x0, y0], float); b = np.array([x1, y1], float)
        d = b - a; L = np.hypot(*d); d /= L; n = np.array([-d[1], d[0]]) * th / 2
        ang = np.degrees(np.arctan2(d[1], d[0]))
        return self.poly([a + n, b + n, b - n, a - n], col, ang=ang, w=max(5, min(8, th * 0.5)), lw=lw, dens=0.85, mess=0.15, **kw)

    def dot(self, x, y, r, col):
        self.c.dab(x * self.S, y * self.S, r * self.S, P[col])

    def ball(self, x, y, r, col, lw=None):
        m = self.circ(x, y, r, col=col, loops=True, w=max(5, r * 0.45), lw=lw)
        self.line(arc(x - r * 0.1, y - r * 0.1, r * 0.6, r * 0.6, 110, 190, 10), 'white', 2.2, pressure=0.7)
        return m

    def person(self, x, y, h, shirt, pants, hair='brown', facing=0, arms=None):
        """jednoduchy clovek: y = chodidla, h = vyska; arms = zoznam bodov rúk"""
        s = h / 120.0
        hr = 13 * s
        head_y = y - h + hr
        bt = head_y + hr + 2 * s
        hip = y - 46 * s
        for dx in (-5, 5):
            self.rect(x + dx * s - 4 * s, hip, x + dx * s + 4 * s, y - 3 * s, pants, w=6, skew=0.6)
            self.circ(x + dx * s + facing * 4 * s, y - 1.5 * s, 7 * s, 3.5 * s, col='out', w=5, lw=2.5)
        self.poly([(x - 12 * s, bt), (x + 12 * s, bt), (x + 14 * s, hip + 4 * s), (x - 14 * s, hip + 4 * s)], shirt, w=8, ang=60)
        if arms:
            for (ax, ay) in arms:
                sd = 1 if ax > x else -1
                self.line([(x + sd * 12 * s, bt + 5 * s), ((x + ax) / 2, (bt + ay) / 2 + 5 * s), (ax, ay)], 'out', 3.2, spl=True)
                self.dot(ax, ay, 4 * s, 'peach')
        else:
            for sd in (-1, 1):
                self.line([(x + sd * 13 * s, bt + 4 * s), (x + sd * 16 * s, hip - 2 * s)], 'out', 3.2)
        self.circ(x, head_y, hr, hr * 1.05, col='peach', w=7, dens=0.6, pres=0.6)
        hp = list(arc(x, head_y, hr * 1.05, hr * 1.05, 0, 180, 16)) + [(x - hr, head_y - 2 * s)]
        self.poly(hp, hair, line=False, w=6, ang=70)
        for sd in (-1, 1):
            self.dot(x + sd * hr * 0.4 + facing * 2 * s, head_y + 1, 1.6, 'out')
        self.line(arc(x + facing * 2 * s, head_y + hr * 0.25, hr * 0.4, hr * 0.3, 205, 335, 10), 'red', 2.2)


def save(c, name, size, quality=88, pad=8, tail=None):
    """vyrobi RGBA webp: alfa = maska vsetkych tahov rozsirena o pad px a zmakcena; zmensi na size"""
    img = c.composite().convert('RGB')
    ink = ((c.wax > 0.04)).astype(np.uint8)
    ink = ndi.binary_closing(ink, structure=np.ones((3, 3)), iterations=3)
    ink = ndi.binary_fill_holes(ink)
    ink = ndi.binary_opening(ink, structure=np.ones((3, 3)), iterations=1) | (c.wax > 0.2)
    ink = ndi.binary_fill_holes(ink)
    # zahod malickosti (drobne bodky mimo kresby)
    lab, n = ndi.label(ink)
    if n:
        sizes = ndi.sum(ink, lab, range(1, n + 1))
        keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= 30])
        ink = keep
    dist = ndi.distance_transform_edt(~ink)
    a = np.clip((pad + 2 - dist) / 4.0, 0, 1)      # mekky okraj okolo pad
    a = blur(a.astype(np.float32), 1.2)
    rgba = np.dstack([np.asarray(img), (a * 255 + 0.5).astype(np.uint8)])
    im = Image.fromarray(rgba.astype(np.uint8), 'RGBA')
    if im.size != tuple(size):
        im = im.resize(size, Image.LANCZOS)
    path = f'{OUTDIR}/{name}.webp'
    im.save(path, quality=quality, method=6)
    # nahlad na bielom/sivom pozadi
    bg = Image.new('RGBA', im.size, (200, 215, 230, 255)); bg.alpha_composite(im)
    bg.convert('RGB').save(f'{PREVIEW}/{name}.png')
    return path
