from common import *
sc = Scene(1800, 1800, seed=201); c = sc.c; t0 = time.time()
sl_path = [(560, 720), (800, 740), (1100, 980), (1400, 1350), (1560, 1520)]
# dieta sediace na sklzavke, ruky hore
sc.kid(850, 424, 1.8, shirt='yellow', pants='turquoise', hair='brown', pose='up',
       arms=[[(790, 520), (700, 400), (650, 250)], [(910, 520), (1000, 400), (1050, 250)]],
       legs=[[(820, 645), (930, 700), (1060, 790)], [(880, 650), (990, 700), (1110, 800)]])
# sklzavka
sl = band(sl_path, 210, 210)
sc.obj(sl, 'red', width=26, lw=9, angle=55, fw=30)
c.line(spline([(560, 600), (810, 620), (1130, 880), (1430, 1260)], 10), sc.C['black'], width=8, avoid=c.grow(sc.OBJ, 3))
# veza
for x in (300, 600):
    sc.obj(c.rect(x - 40, 740, x + 40, 1560, 2), 'blue', width=14, lw=9, angle=90, fw=22)
sc.obj(c.rect(230, 700, 640, 780, 2), 'orange', width=18, lw=9, angle=0, fw=24)
roof = [(210, 560), (430, 340), (660, 560)]
for x in (270, 590):
    sc.L([(x, 700), (x, 560)], 'black', width=9)
sc.obj(roof, 'violet', width=20, lw=9)
sc.dab(430, 320, 16, 'red')
# rebrik
c.line([(150, 780), (70, 1520)], sc.C['black'], width=9, avoid=c.grow(sc.OBJ, 3))
c.line([(250, 880), (170, 1520)], sc.C['black'], width=9, avoid=c.grow(sc.OBJ, 3))
for k in range(6):
    y = 900 + k * 100
    c.line([(232 - k * 14, y), (130 - k * 14, y + 6)], sc.C['yellow'], width=16)
# zeme
c.line(spline([(30, 1580), (600, 1590), (1200, 1575), (1760, 1590)], 10), sc.C['grey'], width=10, pressure=0.7)
print(finish(sc, 'hero-1', (900, 900)), time.time() - t0)
