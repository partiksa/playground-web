from common import *
sc = Scene(1800, 1800, seed=203); c = sc.c; t0 = time.time()
# dieta lezie po sieti
sc.kid(900, 700, 2.1, shirt='orange', pants='violet', hair='black', pose='up',
       arms=[[(830, 830), (770, 700), (750, 520)], [(970, 830), (1020, 720), (1060, 560)]],
       legs=[[(860, 955), (830, 1060), (800, 1150)], [(940, 955), (1000, 1000), (1070, 1020)]])
# stlpy
for x in (330, 1470):
    sc.obj(c.rect(x - 40, 320, x + 40, 1560, 2), 'red', width=18, lw=9, angle=90, fw=26)
# priecky
for y in (320, 760, 1200, 1530):
    sc.obj(c.rect(300, y - 34, 1500, y + 34, 2), 'yellow', width=16, lw=9, angle=0, fw=24)
for x in (330, 1470):
    sc.obj(c.circle(x, 300, 56, 56), 'blue', width=14, lw=9, fw=18)
# siet
net = sc.C['turquoise']; av = lambda: c.grow(sc.OBJ, 5)
XL, XR = 372, 1428
def clip(p0, p1):
    (x0, y0), (x1, y1) = p0, p1
    ts = [0, 1]
    for X in (XL, XR):
        if x1 != x0:
            t = (X - x0) / (x1 - x0)
            if 0 < t < 1: ts.append(t)
    ts.sort(); out = []
    for ta, tb in zip(ts[:-1], ts[1:]):
        tm = (ta + tb) / 2; xm = x0 + (x1 - x0) * tm
        if XL <= xm <= XR:
            out.append([(x0 + (x1 - x0) * ta, y0 + (y1 - y0) * ta), (x0 + (x1 - x0) * tb, y0 + (y1 - y0) * tb)])
    return out
for i in range(-4, 8):
    x0 = 300 + i * 200
    for seg in clip((x0, 360), (x0 + 800, 1560)) + clip((x0 + 800, 360), (x0, 1560)):
        c.line(seg, net, width=12, avoid=av(), pressure=0.9)
# podstavy
for x in (330, 1470):
    sc.obj(c.rect(x - 110, 1540, x + 110, 1610, 2), 'violet', width=14, lw=9, angle=0, fw=22)
print(finish(sc, 'hero-3', (900, 900)), time.time() - t0)
