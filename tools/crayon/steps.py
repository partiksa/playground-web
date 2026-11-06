import sys
from common import *

def canvas(seed):
    c = new(1800, 1800, seed); return c, Pen(c, 4.2)

def step1():
    c, pen = canvas(11)
    pen.poly([(230, 620), (670, 620), (725, 668), (175, 668)], 'tan', w=10, ang=5)
    pen.rect(175, 668, 725, 698, 'brown', w=8, ang=0)
    for x in (205, 695):
        pen.rect(x - 11, 698, x + 11, 810, 'brown', w=7, ang=90)
    pen.poly([(360, 628), (540, 628), (566, 660), (334, 660)], 'white', w=8, lw=3)
    pen.line([(352, 652), (375, 636), (430, 636), (448, 652)], 'red', 3.5)
    pen.line([(455, 636), (520, 656)], 'blue', 3.5); pen.circ(490, 643, 8, col='yellow', w=4, lw=2)
    pen.person(120, 815, 340, 'blue', 'navy', hair='brown', facing=1, arms=[(300, 640)])
    pen.person(780, 815, 340, 'red', 'violet', hair='orange', facing=-1, arms=[(600, 640)])
    pen.circ(250, 180, 125, 75, col=None, lw=4.5)
    pen.line([(190, 240), (150, 330), (250, 255)], 'out', 4.5)
    for i, col in enumerate(['red', 'yellow', 'turq']):
        pen.circ(185 + i * 65, 180, 18, col=col, w=6, loops=True, lw=3)
    pen.circ(690, 230, 70, 42, lw=4)
    pen.rect(658, 212, 722, 248, None, lw=3); pen.line([(658, 212), (690, 192), (722, 212)], 'blue', 3.5)
    return c

def step2():
    c, pen = canvas(12)
    pen.poly([(260, 250), (640, 250), (640, 560), (260, 560)], 'grey', w=12, dens=0.3, pres=0.3, lw=4.5)
    pen.poly([(90, 810), (260, 560), (640, 560), (810, 810)], 'tan', w=14, ang=0, dens=0.4, pres=0.4, lw=4.5)
    for a, b in [((90, 90), (260, 250)), ((810, 90), (640, 250))]:
        pen.line([a, b], 'out', 4.5)
    pen.line([(90, 90), (260, 250)], 'out', 4.5)
    pen.rect(330, 320, 430, 450, 'sky', w=7, ang=-30)
    pen.line([(380, 320), (380, 450)], 'out', 3); pen.line([(330, 385), (430, 385)], 'out', 3)
    pen.rect(500, 330, 590, 560, None, lw=3.5)
    # zvinovaci meter
    pen.rect(150, 735, 300, 800, 'red', w=10, ang=40, lw=4.5, skew=2)
    pen.circ(225, 768, 22, col='yellow', w=6, loops=True, lw=3)
    pen.poly([(300, 760), (740, 745), (742, 772), (300, 787)], 'yellow', w=9, ang=-2, lw=3.8, dens=0.9)
    for x in range(330, 740, 45):
        pen.line([(x, 762 - (x - 300) * 0.034), (x, 778 - (x - 300) * 0.034)], 'out', 2.2)
    # sipky ku stropu
    for x, col in [(150, 'blue'), (750, 'violet')]:
        pen.line([(x, 700), (x, 140)], col, 5)
        pen.line([(x - 30, 190), (x, 130), (x + 30, 190)], col, 5)
        pen.line([(x - 30, 650), (x, 710), (x + 30, 650)], col, 5)
    return c

def step3():
    c, pen = canvas(13)
    pen.rect(130, 150, 770, 640, 'white', w=3, dens=0.05, pres=0.1, lw=6.5, lcol='navy', skew=2)
    pen.rect(155, 175, 745, 615, None, lw=3)
    pen.rect(380, 640, 520, 690, 'navy', w=8, ang=90, skew=1)
    pen.rect(290, 690, 610, 725, 'blue', w=8, ang=0)
    # plan ihriska zhora
    pen.rect(210, 230, 450, 380, None, lw=3.8)
    for i in range(1, 6): pen.line([(210 + i * 40, 230), (210 + i * 40, 380)], 'turq', 2.2)
    for j in range(1, 4): pen.line([(210, 230 + j * 37), (450, 230 + j * 37)], 'turq', 2.2)
    pen.circ(540, 300, 70, 55, col='red', loops=True, w=7, lw=3.8)
    pen.poly([(240, 440), (420, 440), (430, 520), (230, 520)], 'yellow', w=9, ang=30, lw=3.8)
    # 3D kocka
    pen.poly([(560, 460), (650, 460), (650, 540), (560, 540)], 'violet', w=8, ang=70, lw=3.8)
    pen.poly([(560, 460), (590, 430), (680, 430), (650, 460)], 'sky', w=8, ang=10, lw=3.8)
    pen.poly([(650, 460), (680, 430), (680, 510), (650, 540)], 'blue', w=8, ang=80, lw=3.8)
    # ceruzka
    pen.poly([(610, 830), (660, 860), (850, 640), (800, 600)], 'yellow', w=10, ang=-45, lw=4.5, dens=0.9)
    pen.poly([(610, 830), (660, 860), (640, 790)], 'peach', w=7, lw=4.5)
    pen.poly([(610, 830), (622, 850), (632, 812)], 'out', w=3, lw=2.5)
    pen.poly([(800, 600), (850, 640), (868, 610), (822, 575)], 'pink', w=8, lw=4.5)
    return c

def step4():
    c, pen = canvas(14)
    pen.rect(150, 110, 750, 430, 'tan', w=10, ang=10, dens=0.35, pres=0.4, lw=4.5)   # nastenka
    for x in range(200, 720, 100):
        for y in (160, 380):
            pen.circ(x, y, 5, col=None, lw=2.5)
    # kluc a kladivo na nastenke
    pen.bar(240, 210, 240, 350, 20, 'grey'); pen.circ(240, 200, 30, 26, col='grey', w=5, lw=4)
    pen.rect(222, 360, 258, 395, None, lw=3)
    pen.bar(460, 330, 460, 210, 16, 'brown'); pen.rect(405, 170, 520, 215, 'red', w=8, ang=0, lw=4)
    pen.circ(640, 300, 40, col='grey', w=5, lw=4); pen.circ(640, 300, 15, lw=3)
    pen.bar(640, 340, 640, 400, 18, 'grey')
    # stol
    pen.rect(90, 610, 810, 650, 'brown', w=9, ang=0, lw=4.5)
    for x in (130, 770):
        pen.rect(x - 14, 650, x + 14, 820, 'brown', w=8, ang=90)
    # ocelove trubky + penove obaly na stole
    pen.bar(130, 590, 420, 590, 26, 'grey', lw=4)
    pen.bar(160, 560, 420, 540, 24, 'grey', lw=4)
    for (x0, x1, col) in [(450, 560, 'red'), (565, 650, 'blue'), (655, 750, 'yellow')]:
        pen.rect(x0, 560, x1, 610, col, w=8, ang=0, lw=4)
    pen.rect(500, 500, 580, 560, 'turq', w=8, ang=70, lw=4)
    pen.rect(330, 700, 440, 760, 'violet', w=8, ang=30, lw=4)   # penova kocka pod stolom
    pen.ball(560, 770, 30, 'red', lw=4); pen.ball(630, 790, 24, 'yellow', lw=4)
    return c

def step5():
    c, pen = canvas(15)
    pen.line([(70, 820), (830, 820)], 'out', 4.5)
    for x in (250, 560):
        pen.bar(x, 280, x, 820, 24, 'red', lw=4)
    pen.bar(240, 270, 570, 270, 24, 'violet', lw=4)
    pen.bar(240, 440, 570, 440, 28, 'yellow', lw=4)
    pen.bar(250, 650, 560, 650, 18, 'blue', lw=4)
    xl = lambda y: 185 - 35 * (y - 450) / 370
    pen.poly([(250, 452), (250, 820), (150, 820), (185, 452)], None, lw=3.5)
    for k in range(1, 6):
        y = 452 + k * 61.5
        pen.line([(xl(y), y), (250, y)], 'turq', 3)
    for k in range(1, 4):
        pen.line([(185 + 65 * k / 4, 452), (150 + 100 * k / 4, 820)], 'turq', 3)
    pen.poly([(560, 420), (560, 470), (690, 640), (800, 790), (800, 820), (845, 820), (845, 770), (710, 590), (560, 420)], 'violet', w=10, ang=40, lw=4.5)
    pen.rect(300, 730, 520, 820, 'turq', w=9, ang=0, lw=4.5)
    for (x, y, col) in [(330, 722, 'red'), (375, 712, 'yellow'), (420, 720, 'blue'), (465, 710, 'red'), (500, 722, 'yellow')]:
        pen.ball(x, y, 20, col, lw=3.5)
    pen.person(400, 432, 190, 'blue', 'navy', hair='brown', facing=1, arms=[(470, 360)])
    pen.person(640, 650, 150, 'red', 'violet', hair='orange', facing=-1, arms=[(590, 590)])
    pen.poly([(400, 268), (470, 268), (435, 205)], 'red', w=7, lw=3.5)
    return c

if __name__ == '__main__':
    which = sys.argv[1:] or ['1', '2', '3', '4', '5']
    for k in which:
        save({'1': step1, '2': step2, '3': step3, '4': step4, '5': step5}[k](), f'step-{k}', (900, 900), pad=8)
