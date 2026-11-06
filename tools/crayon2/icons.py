from common import *
import sys
LW = 20

def new(seed):
    sc = Scene(1200, 1200, seed=seed); sc.lw = LW
    return sc

def sheet(name):
    im = Image.open(f'{OUT}/{name}.webp').convert('RGBA')
    bg = Image.new('RGBA', (780, 600), (255, 255, 255, 255))
    bg.alpha_composite(im, (0, 0))
    bg.alpha_composite(im.resize((120, 120), Image.LANCZOS), (640, 240))
    bg.convert('RGB').save(f'/tmp/sheet_{name}.png')

def fit1():
    sc = new(301); c = sc.c
    sc.kid(590, 330, 1.4, shirt='yellow', pants='turquoise', hair='brown', pose='up',
           arms=[[(535, 415), (470, 320), (440, 220)], [(645, 415), (710, 320), (740, 220)]],
           legs=[[(565, 505), (660, 545), (760, 610)], [(615, 510), (710, 555), (805, 620)]], body_len=0.9)
    sc.obj(band([(400, 560), (560, 575), (740, 720), (930, 950), (1030, 1050)], 160, 160), 'red', width=34, lw=LW, angle=55, fw=40)
    for x in (210, 410):
        sc.obj(c.rect(x - 40, 600, x + 40, 1050, 2), 'blue', width=22, lw=LW, angle=90, fw=34)
    sc.obj(c.rect(150, 540, 470, 620, 2), 'orange', width=26, lw=LW, angle=0, fw=34)
    for x in (190, 430):
        sc.L([(x, 540), (x, 420)], 'black', width=LW)
    sc.obj([(130, 440), (310, 250), (490, 440)], 'violet', width=30, lw=LW, fw=40)
    c.line(spline([(60, 1090), (600, 1100), (1140, 1090)], 8), sc.C['grey'], width=LW, pressure=0.8)
    return sc

def fit2():
    sc = new(302); c = sc.c
    # cake
    sc.dab(250, 690, 28, 'red')
    sc.obj([(160, 780), (200, 700), (260, 740), (320, 690), (380, 740), (440, 710), (480, 780)], 'pink', width=30, lw=LW, fw=36)
    sc.obj(c.rect(160, 780, 480, 950, 2), 'yellow', width=30, lw=LW, angle=10, fw=36)
    c.line([(170, 862), (470, 862)], sc.C['brown'], width=LW * 0.8, avoid=c.grow(sc.OBJ * 0, 1))
    # cup: pary
    for x, dx in [(690, -20), (760, 20), (830, -10)]:
        c.line(spline([(x, 520), (x + dx, 460), (x - dx, 400), (x + dx, 340)], 8), sc.C['grey'], width=LW * 0.8)
    h = arc(900, 700, 90, 80, -85, 85, 30)
    c.line(h, sc.C['black'], width=62, pressure=1.0)
    c.line(h, sc.C['turquoise'], width=26, pressure=1.0)
    sc.obj(c.circle(755, 600, 210, 50), 'brown', lw=LW, fw=30, width=24)
    sc.obj([(545, 600), (965, 600), (900, 860), (610, 860)], 'turquoise', width=32, lw=LW, fw=40)
    sc.obj(c.circle(755, 880, 330, 70), 'blue', width=32, lw=LW, fw=40)
    # mala sklzavka vzadu
    sc.obj(band([(340, 440), (440, 450), (540, 560)], 110, 110), 'red', width=30, lw=LW, fw=34, angle=50)
    for x in (250, 340):
        sc.obj(c.rect(x - 28, 420, x + 28, 600, 2), 'blue', width=20, lw=LW, angle=90, fw=30)
    sc.obj(c.rect(190, 380, 400, 440, 2), 'orange', width=22, lw=LW, angle=0, fw=30)
    sc.obj([(180, 380), (300, 270), (420, 380)], 'violet', width=26, lw=LW, fw=34)
    return sc

def fit3():
    sc = new(303); c = sc.c
    # vnutro izby (loptickky + sklzavka)
    cols = ['red', 'yellow', 'violet', 'turquoise', 'orange']
    for i, x in enumerate(range(395, 830, 80)):
        sc.obj(c.circle(x, 900, 40, 40, lumpy=0.03), cols[i % 5], width=16, lw=LW * 0.8, fw=22)
    sc.obj(band([(470, 770), (600, 790), (730, 870)], 70, 70), 'red', width=24, lw=LW * 0.8, fw=28, angle=40)
    sc.obj(c.rect(380, 745, 480, 780, 2), 'orange', width=18, lw=LW * 0.8, angle=0, fw=22)
    sc.obj(c.rect(330, 700, 870, 960, 2), 'sky', width=30, lw=LW, fw=40, density=0.6, press=0.6)
    for cx in (350, 600, 850):
        for (y0, y1) in [(290, 420), (480, 610)]:
            sc.obj(c.rect(cx - 70, y0, cx + 70, y1, 2), 'yellow', width=26, lw=LW, fw=34)
    sc.obj(c.rect(230, 230, 970, 1010, 2), 'blue', width=36, lw=LW, fw=44, angle=70, density=0.78)
    sc.obj([(190, 250), (600, 80), (1010, 250)], 'red', width=34, lw=LW, fw=44)
    return sc

def fit4():
    sc = new(304); c = sc.c
    sc.kid(640, 600, 1.25, shirt='orange', pants='violet', hair='black', pose='up', body_len=1.6,
           arms=[[(588, 700), (530, 600), (500, 480)], [(692, 700), (750, 600), (780, 480)]],
           legs=[[(615, 845), (610, 920), (605, 985)], [(665, 845), (670, 920), (675, 985)]])
    # kocky
    sc.obj(c.rect(110, 800, 330, 1010, 3), 'red', width=34, lw=LW, fw=40)
    sc.obj(c.rect(330, 800, 540, 1010, 3), 'blue', width=34, lw=LW, fw=40)
    sc.obj(c.rect(190, 590, 400, 800, 3), 'yellow', width=34, lw=LW, fw=40)
    sc.obj([(160, 590), (295, 450), (430, 590)], 'turquoise', width=30, lw=LW, fw=40)
    sc.dab(220, 905, 24, 'yellow'); sc.dab(435, 905, 24, 'orange')
    # sklzavka
    sc.obj(band([(870, 770), (960, 790), (1060, 920), (1120, 1010)], 110, 110), 'red', width=30, lw=LW, fw=36, angle=55)
    for x in (780, 880):
        sc.obj(c.rect(x - 30, 780, x + 30, 1010, 2), 'blue', width=20, lw=LW, angle=90, fw=30)
    sc.obj(c.rect(750, 740, 920, 800, 2), 'orange', width=24, lw=LW, angle=0, fw=30)
    c.line(spline([(60, 1060), (600, 1070), (1140, 1060)], 8), sc.C['grey'], width=LW, pressure=0.8)
    return sc

def fit5():
    sc = new(305); c = sc.c
    # sklzavka
    sc.obj(band([(780, 330), (520, 360), (330, 470), (420, 590), (700, 650), (870, 780)], 120, 120), 'turquoise', width=30, lw=LW, fw=36, angle=30)
    for t in [(560, 372), (350, 450), (470, 612)]:
        pass
    # voda
    xs = np.linspace(60, 1140, 40)
    top = [(x, 850 + 28 * np.sin(x / 80)) for x in xs]
    water = top + [(1140, 1060), (60, 1060)]
    sc.obj(water, 'blue', width=34, lw=LW, fw=40, angle=5, density=0.8)
    for y0, off in [(930, 0), (1000, 40)]:
        pts = [(x, y0 + 20 * np.sin((x + off) / 55)) for x in np.linspace(120, 1080, 40)]
        c.line(pts, sc.C['sky'], width=LW * 0.9)
    # veza
    for x in (860, 1000):
        sc.obj(c.rect(x - 30, 380, x + 30, 880, 2), 'red', width=20, lw=LW, angle=90, fw=30)
    sc.obj(c.rect(760, 330, 1080, 395, 2), 'yellow', width=26, lw=LW, angle=0, fw=34)
    # slnko
    sc.obj(c.circle(230, 220, 105), 'yellow', width=24, lw=LW, loops=True, fw=28)
    for k in range(10):
        a = np.radians(k * 36 + 10)
        sc.L([(230 + 140 * np.cos(a), 220 - 140 * np.sin(a)), (230 + 195 * np.cos(a), 220 - 195 * np.sin(a))], 'orange', width=LW * 1.3, avoid=None)
    return sc

if __name__ == '__main__':
    names = sys.argv[1:] or ['1', '2', '3', '4', '5']
    for n in names:
        t0 = time.time()
        sc = globals()['fit' + n]()
        finish(sc, f'fit-{n}', (600, 600), grow_px=22, fit=0.9)
        sheet(f'fit-{n}')
        print(n, time.time() - t0)
