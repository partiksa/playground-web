from common import *
sc = Scene(1600, 1200, seed=101); c = sc.c
t0 = time.time()
# podlaha
FL = 1010
# --- predne: rodic s taskou (vpravo)
px, py, s = 1290, 330, 1.7
bag = [(1130, 700), (1250, 690), (1262, 840), (1118, 850)]
sc.obj(bag, 'yellow', width=16, lw=12)
c.line(spline([(1160, 700), (1170, 640), (1210, 640), (1222, 692)], 8), sc.C['black'], width=10)
c.dab(1190, 770, 22, sc.C['red'])
sc.kid(px, py, s, shirt='violet', pants='blue', hair='brown', body_len=1.9,
       arms=[[(px - 58, 405), (px - 100, 520), (px - 140, 690)], [(px + 58, 405), (px + 90, 470), (px + 140, 520)]],
       legs=[[(px - 30, 640), (px - 36, 800), (px - 40, 960)], [(px + 30, 640), (px + 36, 800), (px + 40, 960)]])
# --- male dieta pred ihriskom (stoji pri loptickach)
sc.kid(1010, 700, 0.9, shirt='orange', pants='turquoise', hair='yellow', pose='up',
       legs=[[(990, 825), (985, 900), (982, 960)], [(1030, 825), (1035, 900), (1038, 960)]])
# --- loptickovy bazen vlavo vpredu
pit = [(110, 840), (640, 840), (680, 1010), (70, 1010)]
cols = ['red', 'yellow', 'blue', 'turquoise', 'violet', 'orange']
k = 0
for row, (y0, xs) in enumerate([(815, range(150, 640, 62)), (880, range(120, 650, 62)), (945, range(100, 660, 62))]):
    for x in xs:
        sc.obj(c.circle(x + (row % 2) * 24, y0, 33, 33, lumpy=0.03), cols[(k * 5 + row) % 6], width=12, lw=8, fw=14, density=0.85); k += 1
sc.obj(pit, 'sky', width=16, lw=13, fw=24, density=0.6, press=0.6)
# --- sklzavka (cervena)
sl = band([(700, 560), (820, 600), (930, 760), (1020, 930), (1070, 1000)], 120, 120)
sc.obj(sl, 'red', width=22, lw=12, angle=60, fw=26)
c.line(spline([(700, 530), (840, 570), (950, 730), (1050, 900)], 10), sc.C['black'], width=9)
# --- veza: platforma, stlpy, strecha, rebrik
for x in (360, 640):
    sc.obj(c.rect(x - 22, 600, x + 22, 1010, 2), 'blue', width=12, lw=11, angle=90, fw=18)
sc.obj(c.rect(300, 560, 720, 620, 2), 'turquoise', width=16, lw=12, angle=0, fw=20)
for x in (330, 420, 510, 600, 690):
    c.line([(x, 560), (x, 440)], sc.C['black'], width=8)
c.line([(330, 440), (690, 440)], sc.C['black'], width=8)
for x in (390, 460, 530, 600):
    c.line([(x, 450), (x, 555)], sc.C['violet'], width=12, pressure=1.0)
# rebrik
c.line([(230, 560), (170, 1000)], sc.C['black'], width=9); c.line([(300, 620), (250, 1000)], sc.C['black'], width=9)
for k in range(5):
    y = 650 + k * 70
    c.line([(285 - k * 11, y), (205 - k * 5 + 0, y + 6)], sc.C['yellow'], width=13)
roof = [(300, 440), (510, 290), (730, 440)]
sc.obj(roof, 'yellow', width=18, lw=12)
c.dab(510, 270, 14, sc.C['red'])
# dieta na veze
sc.kid(480, 480, 0.75, shirt='pink', pants='blue', hair='black', pose='stand', legs=[[(470, 580), (470, 570), (470, 565)], [(495, 580), (495, 570), (495, 565)]], arms=[[(448, 530), (420, 520), (395, 490)], [(512, 530), (535, 500), (555, 470)]], body_len=0.5)
# podlaha
c.line(spline([(40, FL + 30), (500, FL + 40), (1000, FL + 25), (1560, FL + 40)], 10), sc.C['grey'], width=10, pressure=0.7)
png = finish(sc, 'fit-1', (800, 600)); print(png, time.time() - t0)
