from common import *

def building(pen, x0, x1, ytop, ybot, wall, roof, side='left', ww=70):
    pen.rect(x0 + ww, ytop, x1, ybot, 'grey', w=9, ang=15, dens=0.35, pres=0.3, lw=3.2)     # zadna stena (vnutro), svetla
    wx0, wx1 = (x0, x0 + ww) if side == 'left' else (x1 - ww, x1)
    pen.rect(wx0, ytop, wx1, ybot, wall, w=8, ang=80, lw=3.8)
    pen.rect(wx0 + 14, ytop + 40, wx1 - 14, ytop + 85, 'sky', w=6, ang=-30, lw=3)
    pen.rect(x0 - 12, ytop - 26, x1 + 12, ytop, roof, w=8, ang=0, lw=3.8)
    pen.line([(x0 + ww, ybot - 8), (x1, ybot - 8)], 'out', 2.5)

def draw(seed=5):
    W, H = 1600, 420
    c = new(W * 2, H * 2, seed); pen = Pen(c)
    # slnko a oblaky
    pen.circ(1545, 48, 26, col='yellow', loops=True, w=7, lw=3)
    for k in range(10):
        a = np.radians(k * 36 + 10)
        pen.line([(1545 + 36 * np.cos(a), 48 - 36 * np.sin(a)), (1545 + 52 * np.cos(a), 48 - 52 * np.sin(a))], 'orange', 4)
    for (cx, cy, w) in [(700, 70, 70), (900, 40, 55), (1000, 95, 45)]:
        pen.line(list(arc(cx, cy, w, 18, 15, 165, 20)) + [(cx - w * 0.95, cy + 8), (cx + w * 0.9, cy + 8)], 'sky', 3.5)
    # cesta
    S = pen.S
    rd = c.rect(8 * S, 360 * S, 1592 * S, 398 * S, skew=1.0, amp=0.9 * S)
    c.scribble(c.mask(rd), P['grey'], angle=0, width=9 * S, density=0.6, pressure=0.6, reach=240, mess=0.02, bow=0.0, angle_jitter=2)
    c.line(rd, P['out'], width=3.2 * S, closed=True)
    for x in range(40, 1580, 120):
        pen.line([(x, 380), (x + 50, 380)], 'yellow', 4)
    # ---------------- vlavo: stary priestor
    building(pen, 36, 340, 150, 360, 'tan', 'grey', 'left')
    pen.rect(150, 300, 215, 360, 'tan', w=8, ang=30, lw=3.2)       # stara krabica vo vnutri
    pen.line([(150, 318), (215, 318)], 'out', 2.5)
    # kopa dielov pred budovou
    pen.bar(338, 350, 478, 322, 11, 'turq'); pen.bar(350, 336, 505, 346, 10, 'violet')
    pen.bar(372, 308, 470, 345, 10, 'red')
    pen.rect(380, 268, 440, 322, 'blue', w=8, ang=60, skew=1.5)
    pen.rect(440, 300, 480, 340, 'red', w=7, ang=10)             # kocka
    pen.line([(440, 300), (452, 290), (492, 290), (480, 300)]); pen.line([(480, 300), (492, 290), (492, 330), (480, 340)])
    pen.rect(326, 322, 378, 358, 'yellow', w=7, ang=-30)
    pen.rect(486, 302, 524, 358, 'violet', w=7, ang=70, skew=1.5)  # panel opretý
    for (x, y, r, col) in [(402, 352, 9, 'red'), (424, 354, 8, 'yellow'), (466, 354, 9, 'blue'), (518, 352, 7, 'yellow')]:
        pen.ball(x, y, r, col, lw=2.8)
    # ---------------- vpravo: novy priestor
    building(pen, 1130, 1580, 112, 360, 'sky', 'blue', 'right', ww=60)
    # konstrukcia z trubiek
    for x, col in [(1215, 'red'), (1400, 'red')]:
        pen.bar(x, 160, x, 360, 11, col, lw=3)
    for x, col in [(1305, 'blue')]:
        pen.bar(x, 160, x, 360, 11, col, lw=3)
    pen.bar(1205, 158, 1410, 158, 11, 'violet', lw=3)
    pen.bar(1205, 226, 1410, 226, 13, 'yellow', lw=3)           # podesta
    pen.bar(1215, 292, 1400, 292, 9, 'turq', lw=3)
    # siet vlavo
    xl = lambda y: 1170 - 20 * (y - 232) / 128
    pen.poly([(1215, 232), (1215, 360), (1150, 360), (1170, 232)], None, lw=3.2)
    for k in range(1, 5):
        y = 232 + k * 25.6
        pen.line([(xl(y), y), (1215, y)], 'turq', 2.4)
    for k in range(1, 3):
        pen.line([(1170 + 45 * k / 3, 232), (1150 + 65 * k / 3, 360)], 'turq', 2.4)
    # smykla
    pen.poly([(1400, 214), (1400, 244), (1470, 298), (1535, 342), (1535, 360), (1555, 360), (1555, 330), (1480, 262), (1400, 214)], 'violet', w=8, ang=40, lw=3.4)
    # guloovy bazen
    pen.rect(1235, 322, 1385, 360, 'turq', w=8, ang=0, lw=3.4)
    for (x, y, col) in [(1255, 316, 'red'), (1283, 312, 'yellow'), (1312, 318, 'blue'), (1340, 312, 'red'), (1368, 317, 'yellow')]:
        pen.ball(x, y, 11, col, lw=2.8)
    return c

if __name__ == '__main__':
    save(draw(), 'move-bg', (1600, 420), pad=7)
