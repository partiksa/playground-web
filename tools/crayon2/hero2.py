from common import *
sc = Scene(1800, 1800, seed=202); c = sc.c; t0 = time.time()
rr = np.random.default_rng(7)
cols = ['red', 'yellow', 'blue', 'turquoise', 'violet', 'orange', 'pink']
# pozicie lopticiek v kupole
balls = []
R = 62
for row, y in enumerate(range(1180, 760, -100)):
    half = 700 * np.sqrt(max(0.0, 1 - ((1180 - y) / 440) ** 2)) - 40
    xs = np.arange(900 - half, 900 + half + 1, 2 * R * 1.0)
    for x in xs:
        balls.append((x + (row % 2) * 40 + rr.normal(0, 6), y + rr.normal(0, 8)))
bi = list(range(len(balls)))
front = [b for b in balls if b[1] >= 1030 or (b[1] >= 900 and 600 < b[0] < 1200)]
back = [b for b in balls if b not in front]
k = 0
def drawb(b):
    global k
    sc.obj(c.circle(b[0], b[1], R, R, lumpy=0.03), cols[k % 7], width=14, lw=9, fw=16, density=0.85); k += 1
for b in sorted(front, key=lambda t: -t[1]): drawb(b)
# dieta
sc.kid(900, 560, 2.0, shirt='violet', pants='blue', hair='yellow', pose='up',
       arms=[[(830, 690), (710, 560), (650, 400)], [(970, 690), (1090, 560), (1150, 400)]],
       legs=[], body_len=1.5)
for b in sorted(back, key=lambda t: -t[1]): drawb(b)
# lietajuce loptickky
for (x, y, col) in [(330, 560, 'red'), (1500, 480, 'turquoise'), (1380, 260, 'yellow'), (460, 280, 'violet')]:
    sc.obj(c.circle(x, y, R, R, lumpy=0.03), col, width=14, lw=9, fw=16, density=0.85)
# predna stena bazenu
wall = [(180, 1190), (1620, 1190), (1560, 1560), (240, 1560)]
sc.obj(wall, 'blue', width=24, lw=10, angle=8, fw=30, density=0.7, press=0.85)
sc.obj(c.rect(170, 1150, 1630, 1220, 2), 'red', width=18, lw=9, angle=0, fw=26)
print(finish(sc, 'hero-2', (900, 900)), time.time() - t0)
