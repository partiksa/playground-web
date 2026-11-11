"use client";
/* Bazén s loptičkami v pätičke (port v6/balls.js): loptičky napadajú, keď je pätička viditeľná,
   kurzor ich rozhadzuje, loptičku možno chytiť a hodiť. Slučka stojí, keď sa nič nehýbe alebo pätička nie je vidieť. */
import { useEffect, useRef } from "react";

// pätička je červená (#FF2712): loptičky v papierovej, bielej a tmavej (paleta v9, žiadne ďalšie farby)
const COLORS = ["#DEDDDB", "#DEDDDB", "#ffffff", "#ffffff", "#141310"];
type Ball = { x: number; y: number; vx: number; vy: number; r: number; c: string; born: number };

function sprite(color: string, r: number, dpr: number) {
  const s = Math.ceil(r * 2 * dpr) + 2, c = document.createElement("canvas");
  c.width = c.height = s;
  const x = c.getContext("2d")!, m = s / 2, R = r * dpr;
  x.fillStyle = color; x.beginPath(); x.arc(m, m, R, 0, Math.PI * 2); x.fill();
  const g = x.createRadialGradient(m - R * 0.35, m - R * 0.4, R * 0.1, m, m, R);
  g.addColorStop(0, "rgba(255,255,255,.55)"); g.addColorStop(0.45, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(0,0,0,.22)");
  x.fillStyle = g; x.beginPath(); x.arc(m, m, R, 0, Math.PI * 2); x.fill();
  return c;
}

export default function FooterBalls() {
  const box = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const area = box.current, cv = cvRef.current;
    if (!area || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const balls: Ball[] = [];
    const sprites = new Map<string, HTMLCanvasElement>();
    let w = 0, h = 0, dpr = 1, base = 14, started = false, running = false, visible = false, still = 0, last = 0, t0 = 0, raf = 0, rt = 0;
    let ptr: { x: number; y: number; vx: number; vy: number; t: number } | null = null;
    let held: Ball | null = null;

    const spr = (c: string, r: number) => { const k = c + r; if (!sprites.has(k)) sprites.set(k, sprite(c, r, dpr)); return sprites.get(k)!; };
    const resize = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(2, devicePixelRatio || 1); w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      base = Math.max(10, Math.min(18, w / 70));
      sprites.clear();
      for (const b of balls) { b.x = Math.min(Math.max(b.x, b.r), w - b.r); b.y = Math.min(b.y, h - b.r); }
      if (started) { draw(); wake(); }
    };
    const start = () => {
      started = true;
      const mobile = w < 640;
      const n = Math.round(Math.min(mobile ? 34 : 90, (w / base) * (mobile ? 1.1 : 1.5)));
      for (let i = 0; i < n; i++) {
        const r = Math.round(base * (0.8 + Math.random() * 0.45));
        balls.push({ x: r + Math.random() * (w - 2 * r), y: -r - Math.random() * h * 0.9 - i * 4, vx: (Math.random() - 0.5) * 120, vy: 0, r, c: COLORS[i % COLORS.length], born: i * 16 });
      }
      t0 = performance.now(); wake();
    };
    const wake = () => {
      still = 0;
      if (!running && visible) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    };
    const step = (dt: number, age: number) => {
      const G = 2200;
      for (const b of balls) {
        if (age < b.born || b === held) continue;
        b.vy += G * dt; b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.y > h - b.r) { b.y = h - b.r; b.vy *= -0.42; b.vx *= 0.94; if (Math.abs(b.vy) < 40) b.vy = 0; }
        if (b.x < b.r) { b.x = b.r; b.vx *= -0.5; } else if (b.x > w - b.r) { b.x = w - b.r; b.vx *= -0.5; }
      }
      for (let i = 0; i < balls.length; i++) {
        const a = balls[i]; if (age < a.born) continue;
        for (let j = i + 1; j < balls.length; j++) {
          const b = balls[j]; if (age < b.born) continue;
          const dx = b.x - a.x, dy = b.y - a.y, md = a.r + b.r, d2 = dx * dx + dy * dy;
          if (d2 >= md * md || d2 === 0) continue;
          const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, o = (md - d) / 2;
          const ka = a === held ? 0 : 1, kb = b === held ? 0 : 1;
          a.x -= nx * o * ka * (kb ? 1 : 2); a.y -= ny * o * ka * (kb ? 1 : 2); b.x += nx * o * kb * (ka ? 1 : 2); b.y += ny * o * kb * (ka ? 1 : 2);
          const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rv < 0) { const j2 = (-(1 + 0.3) * rv) / 2; if (ka) { a.vx -= j2 * nx; a.vy -= j2 * ny; } if (kb) { b.vx += j2 * nx; b.vy += j2 * ny; } }
        }
      }
      // kurzor (bez držanej loptičky) odhodí loptičky v smere pohybu
      if (ptr && !held) for (const b of balls) {
        const dx = b.x - ptr.x, dy = b.y - ptr.y, R = b.r + 30, d2 = dx * dx + dy * dy;
        if (d2 > R * R) continue;
        const d = Math.sqrt(d2) || 1;
        b.vx += (dx / d) * 200 + ptr.vx * 0.2; b.vy += (dy / d) * 200 + Math.min(0, ptr.vy * 0.2) - 140;
      }
      if (ptr) { ptr.vx *= 0.5; ptr.vy *= 0.5; }
    };
    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      for (const b of balls) { if (b.y < -b.r) continue; ctx.drawImage(spr(b.c, b.r), Math.round((b.x - b.r) * dpr) - 1, Math.round((b.y - b.r) * dpr) - 1); }
    };
    const frame = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000); last = now;
      const age = now - t0;
      if (ptr && !held && now - ptr.t > 120) ptr = null;
      const before = balls.map((b) => b.x + b.y);
      step(dt / 2, age); step(dt / 2, age);
      draw();
      const moved = !!held || balls.some((b, i) => age < b.born || Math.abs(b.x + b.y - before[i]) > 0.2);
      still = moved ? 0 : still + 1;
      if (still < 30 && visible) raf = requestAnimationFrame(frame); else running = false;
    };
    const pos = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const move = (e: PointerEvent) => {
      const { x, y } = pos(e), now = performance.now(), p = ptr, dt = p ? Math.max(8, now - p.t) / 1000 : 1;
      ptr = { x, y, vx: p ? (x - p.x) / dt : 0, vy: p ? (y - p.y) / dt : 0, t: now };
      if (held) { held.x = Math.min(Math.max(x, held.r), w - held.r); held.y = Math.min(Math.max(y, -h), h - held.r); held.vx = ptr.vx; held.vy = ptr.vy; }
      if (started) wake();
    };
    const down = (e: PointerEvent) => {
      if (!started) return;
      const { x, y } = pos(e);
      let best: Ball | null = null, bd = Infinity;
      for (const b of balls) { const d = Math.hypot(b.x - x, b.y - y); if (d < b.r + 8 && d < bd) { best = b; bd = d; } }
      if (!best) return;
      held = best; ptr = { x, y, vx: 0, vy: 0, t: performance.now() };
      area.classList.add("grab");
      try { cv.setPointerCapture(e.pointerId); } catch {}
      wake();
    };
    const up = () => {
      if (held) { held.vx = Math.max(-2500, Math.min(2500, held.vx)); held.vy = Math.max(-2500, Math.min(2500, held.vy)); }
      held = null; area.classList.remove("grab"); wake();
    };
    const leave = () => { if (!held) ptr = null; };
    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(resize, 150); };

    cv.addEventListener("pointermove", move, { passive: true });
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("pointerleave", leave);
    window.addEventListener("resize", onResize);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !started) { resize(); start(); } else if (visible) wake();
    }, { threshold: 0.2 });
    io.observe(area);

    return () => {
      io.disconnect(); cancelAnimationFrame(raf); clearTimeout(rt);
      cv.removeEventListener("pointermove", move); cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointerup", up); cv.removeEventListener("pointercancel", up); cv.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <div className="ft-balls" ref={box} aria-hidden="true"><canvas ref={cvRef} /></div>;
}
