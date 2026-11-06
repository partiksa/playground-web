"""Voskovkove podciarknutia (ul-*) a bodky (dot-*) v farbach ilustracii."""
from common import *
import numpy as np
COLS = ['yellow', 'red', 'turquoise', 'blue', 'violet', 'orange', 'pink']

def underline(col, seed):
    W, H = 1800, 140
    sc = Scene(W, H, seed=seed); c = sc.c
    rng = np.random.default_rng(seed)
    xs = np.linspace(70, W - 70, 8)
    base = [(x, 70 + rng.uniform(-9, 9) - (x / W) * 14) for x in xs]
    for k, dy in enumerate((-11, 11)):
        path = [(x, y + dy + rng.uniform(-3, 3)) for x, y in base]
        c.line(spline(path, 10), sc.C[col], width=34, pressure=0.97)
    return finish(sc, f'ul-{col}', (900, 70), grow_px=4, fit=0.99)

def dot(col, seed):
    S = 300
    sc = Scene(S, S, seed=seed); c = sc.c
    m = c.mask(c.circle(S / 2, S / 2, 100, 92, lumpy=0.06))
    c.scribble(m, sc.C[col], angle=45 + (seed % 5) * 20, width=22, density=0.95, pressure=0.95, reach=None, mess=0.4)
    return finish(sc, f'dot-{col}', (96, 96), grow_px=6, fit=0.99)

if __name__ == '__main__':
    for i, col in enumerate(COLS):
        print(underline(col, 500 + i)); print(dot(col, 600 + i))
