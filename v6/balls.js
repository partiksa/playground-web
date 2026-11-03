// bazén s loptičkami: loptičky padnú na dno, kurzor ich rozhadzuje
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
// farby loptičiek z bazéna vo videu stavby, zladené s papierom a tušom
const COLORS = ['#F7F4EE', '#F7F4EE', '#FECF03', '#FECF03', '#9CC9E3', '#9CC9E3', '#FE9A4A', '#141310'];

function sprite(color, r, dpr) {
  // predkreslená loptička s jemným svetlom a tieňom, aby kreslenie stálo málo
  const s = Math.ceil(r * 2 * dpr) + 2, c = document.createElement('canvas'); c.width = c.height = s;
  const x = c.getContext('2d'), m = s / 2, R = r * dpr;
  x.fillStyle = color; x.beginPath(); x.arc(m, m, R, 0, Math.PI * 2); x.fill();
  const g = x.createRadialGradient(m - R * .35, m - R * .4, R * .1, m, m, R);
  g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.22)');
  x.fillStyle = g; x.beginPath(); x.arc(m, m, R, 0, Math.PI * 2); x.fill();
  return c;
}

export class BallPit {
  constructor(canvas, { area = canvas.parentElement, density = 1 } = {}) {
    this.cv = canvas; this.ctx = canvas.getContext('2d'); this.area = area; this.density = density;
    this.balls = []; this.running = false; this.started = false; this.ptr = null;
    this.resize = this.resize.bind(this); this.frame = this.frame.bind(this);
    addEventListener('resize', () => { clearTimeout(this.rt); this.rt = setTimeout(this.resize, 150); });
    area.addEventListener('pointermove', (e) => {
      const r = this.cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, now = performance.now();
      const p = this.ptr, dt = p ? Math.max(8, now - p.t) / 1000 : 1;
      this.ptr = { x, y, vx: p ? (x - p.x) / dt : 0, vy: p ? (y - p.y) / dt : 0, t: now };
      this.wake();
    }, { passive: true });
    area.addEventListener('pointerleave', () => { this.ptr = null; });
    new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (e.isIntersecting && !this.started) this.start(); else if (e.isIntersecting) this.wake();
    }, { threshold: 0.25 }).observe(area);
    this.resize();
  }
  resize() {
    const r = this.cv.getBoundingClientRect(); this.dpr = Math.min(2, devicePixelRatio || 1);
    this.w = r.width; this.h = r.height;
    this.cv.width = Math.round(this.w * this.dpr); this.cv.height = Math.round(this.h * this.dpr);
    this.base = Math.max(13, Math.min(24, this.w / 60));
    this.sprites = new Map();
    for (const b of this.balls) { b.x = Math.min(Math.max(b.x, b.r), this.w - b.r); b.y = Math.min(b.y, this.h - b.r); }
    if (this.started) { if (reduce) this.settle(); this.draw(); }
  }
  spr(color, r) {
    const k = color + r; if (!this.sprites.has(k)) this.sprites.set(k, sprite(color, r, this.dpr));
    return this.sprites.get(k);
  }
  start() {
    this.started = true;
    const n = Math.round(Math.min(140, (this.w / this.base) * 2.2) * this.density);
    for (let i = 0; i < n; i++) {
      const r = Math.round(this.base * (0.8 + Math.random() * 0.45));
      this.balls.push({ x: r + Math.random() * (this.w - 2 * r), y: -r - Math.random() * this.h * 0.9 - i * 6, vx: (Math.random() - .5) * 120, vy: 0, r, c: COLORS[i % COLORS.length], born: i * 14 });
    }
    if (reduce) { this.settle(); this.draw(); return; }
    this.t0 = performance.now(); this.wake();
  }
  settle() { for (let i = 0; i < 900; i++) this.step(1 / 60, Infinity); }
  wake() { this.still = 0; if (!this.running && this.visible !== false && !reduce) { this.running = true; this.last = performance.now(); requestAnimationFrame(this.frame); } }
  step(dt, age) {
    const G = 2200, B = this.balls, w = this.w, h = this.h;
    for (const b of B) {
      if (age < b.born) continue;
      b.vy += G * dt; b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.y > h - b.r) { b.y = h - b.r; b.vy *= -0.42; b.vx *= 0.94; if (Math.abs(b.vy) < 40) b.vy = 0; }
      if (b.x < b.r) { b.x = b.r; b.vx *= -0.5; } else if (b.x > w - b.r) { b.x = w - b.r; b.vx *= -0.5; }
    }
    // zrážky loptičiek: posun od seba a výmena rýchlosti po normále
    for (let i = 0; i < B.length; i++) {
      const a = B[i]; if (age < a.born) continue;
      for (let j = i + 1; j < B.length; j++) {
        const b = B[j]; if (age < b.born) continue;
        const dx = b.x - a.x, dy = b.y - a.y, md = a.r + b.r, d2 = dx * dx + dy * dy;
        if (d2 >= md * md || d2 === 0) continue;
        const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, o = (md - d) / 2;
        a.x -= nx * o; a.y -= ny * o; b.x += nx * o; b.y += ny * o;
        const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (rv < 0) { const j2 = -(1 + 0.3) * rv / 2; a.vx -= j2 * nx; a.vy -= j2 * ny; b.vx += j2 * nx; b.vy += j2 * ny; }
      }
    }
    // kurzor odhodí loptičky v smere pohybu
    const p = this.ptr;
    if (p) for (const b of B) {
      const dx = b.x - p.x, dy = b.y - p.y, R = b.r + 46, d2 = dx * dx + dy * dy;
      if (d2 > R * R) continue;
      const d = Math.sqrt(d2) || 1;
      b.vx += (dx / d) * 260 + p.vx * 0.25; b.vy += (dy / d) * 260 + Math.min(0, p.vy * 0.25) - 180;
    }
    if (p) { p.vx *= 0.5; p.vy *= 0.5; }
  }
  draw() {
    const x = this.ctx, d = this.dpr;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, this.cv.width, this.cv.height);
    for (const b of this.balls) { if (b.y < -b.r) continue; const s = this.spr(b.c, b.r); x.drawImage(s, Math.round((b.x - b.r) * d) - 1, Math.round((b.y - b.r) * d) - 1); }
  }
  frame(now) {
    const dt = Math.min(1 / 30, (now - this.last) / 1000); this.last = now;
    const age = now - this.t0;
    if (this.ptr && now - this.ptr.t > 120) this.ptr = null; // kurzor stojí, nepôsobí
    const before = this.balls.map((b) => b.x + b.y);
    this.step(dt / 2, age); this.step(dt / 2, age);
    this.draw();
    // keď sa nič nehýbe pol sekundy, slučka zastane (zobudí ju kurzor alebo zobrazenie)
    const moved = this.balls.some((b, i) => age < b.born || Math.abs(b.x + b.y - before[i]) > 0.2);
    this.still = moved ? 0 : (this.still || 0) + 1;
    if (this.still < 30 && this.visible !== false) requestAnimationFrame(this.frame); else this.running = false;
  }
}
