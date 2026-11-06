"""Spolocne pomocky pre sadu crayon (fit-*, hero-*). Kreslenie cez Crayon, bez cudzieho obrazkoveho modelu."""
import os, sys, time
sys.path.insert(0, '/Users/patriksarkozy/.claude/skills/claude-drawing/lib')
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from crayon import Crayon
from core import spline

OUT = '/Users/patriksarkozy/Desktop/AI/loso/v6/ill/crayon'
PAL = dict(red='#ff2712', blue='#2563e8', yellow='#ffd21f', turquoise='#12c2c2', violet='#8a4fd6',
           orange='#ff8a1c', pink='#ff7fae', black='#2a2826', brown='#8a5230', tan='#e2b27a',
           peach='#f6c7a1', grey='#8c8c8c', sky='#6cc1f2', green='#3aa655', white='#fbfaf5')


def U(*ms):
    return np.maximum.reduce([np.asarray(m, np.float32) for m in ms])


def arc(cx, cy, rx, ry, a0, a1, n=40):
    t = np.radians(np.linspace(a0, a1, n))
    return np.stack([cx + rx * np.cos(t), cy - ry * np.sin(t)], 1)


class Scene:
    """Platno v 2x rozliseni. Objekty sa kreslia zhora (predne) dozadu, vyplne obchadzaju uz nakreslene."""
    def __init__(self, W, H, seed):
        self.c = Crayon(W, H, seed=seed)
        self.c.C = dict(self.c.C); self.c.C.update(PAL)
        self.C = self.c.C
        self.c.paper()
        self.OBJ = np.zeros((H, W), np.float32)
        self.W, self.H = W, H; self.lw = 8
        self.rng = self.c.rng

    def obj(self, pts, col, outline='black', fill=True, width=12, angle=None, fw=22, density=0.8, press=0.92,
            closed=True, holes=None, mess=0.35, loops=False, solid=True, lw=None):
        c = self.c
        lw = lw or width
        m = c.mask(pts)
        keep = self.OBJ
        if outline:
            c.line(pts, self.C[outline] if isinstance(outline, str) else outline, width=lw, closed=closed,
                   avoid=c.grow(keep, 3) if keep.any() else None)
        if fill and col:
            a = self.rng.uniform(-60, 60) if angle is None else angle
            av = keep if holes is None else U(keep, holes)
            if loops:
                c.loops(m, self.C[col], r=fw, width=width, density=density, pressure=press, avoid=av if av.any() else None, halo=4)
            else:
                c.scribble(m, self.C[col], angle=a, width=fw, density=density, pressure=press, reach=None, mess=mess,
                           avoid=av if av.any() else None, halo=4)
        self.OBJ = U(self.OBJ, m)
        return m

    def seen(self, m):
        self.OBJ = U(self.OBJ, m)

    def L(self, pts, col='black', width=12, pressure=0.95, **kw):
        kw.setdefault('avoid', self.c.grow(self.OBJ, 3) if self.OBJ.any() else None)
        self.c.line(pts, self.C[col], width=width, pressure=pressure, **kw)

    def dab(self, x, y, r, col='black'):
        self.c.dab(x, y, r, self.C[col])

    # ---- dieta: x,y = stred hlavy; s = mierka (hlava polomer 40*s)
    def kid(self, x, y, s, shirt='red', pants='blue', hair='brown', pose='stand', skin='peach', arms=None, legs=None,
            body_len=1.0):
        """pose: 'up' (ruky hore), 'stand'. arms/legs = zoznamy bodov (ruka lava, ruka prava) v absolutnych suradniciach"""
        c = self.c
        r = 40 * s
        sx, sy = x, y + r + 6 * s                      # krk
        bw, bh = 34 * s, 74 * s * body_len
        body = [(sx - bw, sy), (sx + bw, sy), (sx + bw * 0.9, sy + bh), (sx - bw * 0.9, sy + bh)]
        parts = []
        # nohy
        if legs is None:
            legs = [[(sx - bw * 0.5, sy + bh), (sx - bw * 0.7, sy + bh + 50 * s), (sx - bw * 0.8, sy + bh + 90 * s)],
                    [(sx + bw * 0.5, sy + bh), (sx + bw * 0.7, sy + bh + 50 * s), (sx + bw * 0.8, sy + bh + 90 * s)]]
        if arms is None:
            if pose == 'up':
                arms = [[(sx - bw, sy + 12 * s), (sx - bw - 36 * s, sy - 30 * s), (sx - bw - 50 * s, sy - 80 * s)],
                        [(sx + bw, sy + 12 * s), (sx + bw + 36 * s, sy - 30 * s), (sx + bw + 50 * s, sy - 80 * s)]]
            else:
                arms = [[(sx - bw, sy + 12 * s), (sx - bw - 20 * s, sy + 44 * s), (sx - bw - 26 * s, sy + 78 * s)],
                        [(sx + bw, sy + 12 * s), (sx + bw + 20 * s, sy + 44 * s), (sx + bw + 26 * s, sy + 78 * s)]]
        # predne: ruky, hlava, telo; nohy (za telom)
        for a in arms:
            p = spline(a, 8)
            self.L(p, 'peach', width=15 * s + 4, pressure=1.0, avoid=None)
            self.L(p, 'black', width=3, pressure=0.0) if False else None
            self.c.line(p, self.C['black'], width=self.lw * 0.8, pressure=0.9)
            ex, ey = p[-1]
            self.c.dab(ex, ey, 9 * s + 3, self.C[skin])
        head = c.circle(x, y, r, lumpy=0.04)
        self.obj(head, skin, width=13, lw=self.lw, density=0.7, press=0.6, fw=18)
        # vlasy
        hp = list(arc(x, y, r * 1.06, r * 1.06, 15, 165, 16)) + [(x - r * 0.7, y - r * 0.45), (x, y - r * 0.62), (x + r * 0.7, y - r * 0.45)]
        hm = c.mask(c.poly(hp, amp=1.2))
        c.scribble(hm, self.C[hair], angle=70, width=14, density=0.9, pressure=0.95, reach=None, mess=0.3)
        for sgn in (-1, 1):
            c.dab(x + sgn * r * 0.36, y + r * 0.02, 5.5 * s + 2, self.C['black'])
            c.dab(x + sgn * r * 0.6, y + r * 0.38, 7 * s + 2, self.C['pink'])
        c.line(arc(x, y + r * 0.22, r * 0.42, r * 0.34, 205, 335, 14), self.C["red"], width=self.lw * 0.7)
        tb = c.mask(body)
        self.obj(body, shirt, width=14, lw=self.lw, fw=22, density=0.75)
        for lg in legs:
            p = spline(lg, 8)
            self.L(p, pants, width=24 * s + 4, pressure=1.0, avoid=None)
            c.line(p, self.C['black'], width=3 * s + 3, pressure=0.7) if False else None
            fx, fy = p[-1]
            sh = c.circle(fx + (8 * s if fx > sx else -8 * s), fy + 4 * s, 20 * s, 11 * s, lumpy=0.03)
            self.obj(sh, 'black', outline='black', width=10, lw=self.lw, fw=12)
        return head


def finish(sc, name, size, grow_px=16, quality=88, seed_alpha=None, fit=0):
    """alfa z nakresleneho, zmakcena, so zatvorenymi dierami; ziadny obdlznik papiera"""
    c = sc.c
    wax = np.maximum(c.wax, 0)
    m = wax > 0.10
    k = 44
    mc = ndi.binary_closing(np.pad(m, k), structure=ndi.generate_binary_structure(2, 1), iterations=1) if False else None
    big = ndi.binary_dilation(np.pad(m, k), iterations=k // 2)
    big = ndi.binary_dilation(big, iterations=k // 2)
    big = ndi.binary_erosion(big, iterations=k // 2)
    big = ndi.binary_erosion(big, iterations=k // 2)
    mm = big[k:-k, k:-k] | m
    mm = ndi.binary_fill_holes(mm)
    # male vnutorne diery (medzery medzi tahmi) zalejeme, ale velke vonkajsie priestory nechame
    grow = grow_px
    d = ndi.distance_transform_edt(~mm)
    a = np.clip(1 - (d - grow * 0.4) / (grow * 0.6 + 4), 0, 1)
    a = ndi.gaussian_filter(a.astype(np.float32), grow * 0.35)
    a = np.clip(a * 1.05, 0, 1)
    rgb = np.asarray(c.composite().convert('RGB'), np.float32) / 255
    rgba = np.dstack([rgb, a])
    im = Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), 'RGBA')
    if fit:
        bb = im.getchannel('A').point(lambda v: 255 if v > 90 else 0).getbbox()
        im = im.crop(bb)
        sc_ = min((size[0] * fit) / im.width, (size[1] * fit) / im.height)
        im = im.resize((round(im.width * sc_), round(im.height * sc_)), Image.LANCZOS)
        canvas = Image.new('RGBA', size, (0, 0, 0, 0))
        canvas.paste(im, ((size[0] - im.width) // 2, (size[1] - im.height) // 2))
        im = canvas
    else:
        im = im.resize(size, Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    png = f'/tmp/crayon2_{name}.png'
    im.save(png)
    im.save(f'{OUT}/{name}.webp', quality=quality, method=6)
    # nahlad na bielom/sivom pozadi
    bg = Image.new('RGBA', im.size, (120, 150, 200, 255))
    bg.alpha_composite(im)
    bg.convert('RGB').save(png)
    return png


def band(path, w0, w1=None):
    """polygon: pas okolo krivky, sirka w0 -> w1"""
    p = spline(path, 12) if len(path) > 2 else np.linspace(path[0], path[-1], 30)
    p = np.asarray(p, np.float32)
    d = np.gradient(p, axis=0)
    n = np.stack([-d[:, 1], d[:, 0]], 1)
    n /= np.linalg.norm(n, axis=1, keepdims=True) + 1e-6
    w1 = w0 if w1 is None else w1
    w = np.linspace(w0, w1, len(p))[:, None] / 2
    return list(map(tuple, p + n * w)) + list(map(tuple, (p - n * w)[::-1]))
