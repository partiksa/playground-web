from common import *

def draw(seed=3):
    W, H = 520, 300
    c = new(W * 2, H * 2, seed); pen = Pen(c)
    # naklad
    pen.bar(34, 96, 318, 96, 18, 'turq')
    pen.bar(44, 74, 250, 70, 14, 'violet')
    pen.rect(196, 100, 322, 170, 'red', w=9, ang=70)
    pen.rect(36, 112, 126, 176, 'yellow', w=8, ang=-40)
    pen.line([(36, 112), (54, 98), (144, 98), (126, 112)])
    pen.line([(126, 112), (144, 98), (144, 160), (126, 176)])
    pen.rect(140, 126, 200, 178, 'blue', w=8, ang=20)
    for x, y, r, col in [(260, 52, 17, 'yellow'), (300, 62, 15, 'blue'), (110, 60, 16, 'red'), (170, 78, 12, 'violet')]:
        pen.ball(x, y, r, col)
    # korba
    pen.rect(14, 164, 340, 204, 'grey', w=8, ang=0, skew=0.8, dens=0.7, pres=0.7)
    for x in (80, 150, 220, 290):
        pen.line([(x, 166), (x, 202)], 'out', 2.5)
    # kabina
    pen.poly([(344, 112), (408, 112), (460, 160), (492, 168), (498, 204), (344, 204)], 'red', w=9, ang=75, lw=4)
    pen.poly([(358, 126), (402, 126), (436, 158), (358, 158)], 'sky', w=6, ang=-35, lw=3, mess=0.1)
    pen.circ(490, 184, 6, 5, col='yellow', w=4, lw=2.5)
    pen.rect(14, 202, 498, 220, 'navy', w=6, ang=0, lw=3, skew=0.6)
    for x in (92, 172, 420):
        pen.circ(x, 264, 33, 32, col='out', w=8, lw=3.5, mess=0.1)
        pen.circ(x, 264, 13, 13, col='yellow', w=5, lw=3, loops=True)
    return c

if __name__ == '__main__':
    save(draw(), 'move-truck', (520, 300), pad=7)
