import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const B = document.body.dataset.hero === 'b'; // hero B: názov kroku namiesto čísla, popis na čiare k dielu
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

scene.add(new THREE.HemisphereLight(0xffffff, 0xffe6c8, 0.9));
const sun = new THREE.DirectionalLight(0xfff4e6, 2.2);
sun.position.set(5, 11, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 });
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.02;
sun.shadow.radius = 5;
scene.add(sun);
const fill = new THREE.DirectionalLight(0xffe9d2, 0.9);
fill.position.set(-8, 5, -6);
scene.add(fill);

// mäkký tieň pod podlahou, aby model nevisel na pozadí
const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.16 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = -0.101; ground.receiveShadow = true;
scene.add(ground);

// ---------- PBR textúry (ambientCG, CC0) ----------
const loader = new THREE.TextureLoader();
const base = {};
function map(name, kind, rx, ry) {
  const k = name + kind;
  if (!base[k]) {
    base[k] = loader.load(`assets/textures/${name}/${kind}.jpg`);
    if (kind === 'color') base[k].colorSpace = THREE.SRGBColorSpace;
  }
  const t = base[k].clone(); t.needsUpdate = true;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 4;
  return t;
}
function pbr(name, c, rx, ry, o = {}) {
  return new THREE.MeshStandardMaterial({
    color: c, roughness: 1, metalness: 0, envMapIntensity: 0.7, normalScale: new THREE.Vector2(0.8, 0.8), ...o,
    map: map(name, 'color', rx, ry), normalMap: map(name, 'normal', rx, ry), roughnessMap: map(name, 'rough', rx, ry),
  });
}

// ---------- pomocníci ----------
const RED = 0xB0291F, ORANGE = 0xF08A1C, YELLOW = 0xF2C21B;
const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0, ...o });
function shade(m) { m.castShadow = true; m.receiveShadow = true; return m; }
// o.tex = [názov textúry, násobok roughness]
function box(w, h, d, c, x, y, z, o = {}) {
  const r = Math.max(1, Math.max(w, h, d) / 1.6), { tex = ['rubber', 0.7], ...rest } = o;
  const m = shade(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), pbr(tex[0], c, r, r, { ...rest, roughness: tex[1] })));
  m.position.set(x, y, z); return m;
}
// obalený stĺp: segmenty vinylu so zváranými pásmi
function tube(r, len, axis, c, x, y, z) {
  const n = Math.max(1, Math.round(len / 0.22)), pts = [new THREE.Vector2(0, -len / 2)];
  for (let j = 0; j < n; j++) for (let k = 0; k < 6; k++) {
    const f = k / 6;
    pts.push(new THREE.Vector2(r * (0.9 + 0.1 * Math.pow(Math.sin(Math.PI * f), 0.6)), -len / 2 + (j + f) * len / n));
  }
  pts.push(new THREE.Vector2(r * 0.9, len / 2), new THREE.Vector2(0, len / 2));
  const m = shade(new THREE.Mesh(new THREE.LatheGeometry(pts, 18), pbr('vinyl', c, 6, Math.max(1, len * 5), { roughness: 0.6, normalScale: new THREE.Vector2(0.15, 0.15) })));
  if (axis === 'x') m.rotation.z = Math.PI / 2;
  if (axis === 'z') m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z); return m;
}
// kovová svorka na stĺpe
function clamp3(x, y, z) {
  const m = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.07, 18), pbr('metal', 0xB8BDC6, 2, 1, { metalness: 0.9, roughness: 0.6 })));
  m.position.set(x, y, z); return m;
}
const netLine = new THREE.LineBasicMaterial({ color: 0x111111 });
const netShade = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false });
function net(w, h, x, y, z, ry = 0, rx = 0, gap = 0.05) {
  const v = [];
  for (let a = -w / 2; a <= w / 2 + 1e-6; a += gap) v.push(a, -h / 2, 0, a, h / 2, 0);
  for (let b = -h / 2; b <= h / 2 + 1e-6; b += gap) v.push(-w / 2, b, 0, w / 2, b, 0);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  const grp = new THREE.Group();
  grp.add(new THREE.LineSegments(g, netLine), new THREE.Mesh(new THREE.PlaneGeometry(w, h), netShade));
  grp.position.set(x, y, z); grp.rotation.set(rx, ry, 0);
  return grp;
}

// 12 krokov, každý má zoznam prvkov s vlastným wrapperom (animácia)
const steps = Array.from({ length: 12 }, () => []);
function add(step, obj) {
  const g = new THREE.Group(), mats = [];
  g.add(obj); g.visible = false; scene.add(g);
  g.traverse((o) => { // vlastné materiály, aby sa každý diel vedel plynulo zobraziť
    if (o.material) { o.material = o.material.clone(); const m = o.material; mats.push({ m, op: m.opacity, tr: m.transparent, dw: m.depthWrite }); }
  });
  steps[step].push({ g, mats, done: false });
}

// ---------- 1 Podlaha ----------
add(0, box(4.4, 0.1, 4.4, 0xE8731A, 0.2, -0.05, 0, { tex: ['rubber', 0.45] }));
add(0, box(3.2, 0.1, 4.4, 0xF2C21B, 4.0, -0.05, 0, { tex: ['rubber', 0.45] }));
add(0, box(4.4, 0.1, 1.0, 0x5B3A8C, 0.2, -0.05, 2.7, { tex: ['rubber', 0.45] }));

// ---------- 2 Mäkké podlahy ----------
add(1, box(3, 0.04, 2.5, 0xC23B22, 0, 0.02, 0, { tex: ['vinyl', 0.8] }));
add(1, box(1.2, 0.08, 1.0, 0xF5C518, 0.8, 0.04, 0.7, { tex: ['vinyl', 0.8] }));

// ---------- 3 Stĺpy ----------
for (const x of [-1.5, 0, 1.5]) for (const z of [-1.25, 1.25]) {
  const c = (x === 0 && z > 0) ? ORANGE : RED;
  add(2, tube(0.065, 2.46, 'y', c, x, 1.23, z));
}
add(2, tube(0.065, 1.2, 'y', RED, 0.8, 0.6, 0.25));
add(2, tube(0.065, 1.2, 'y', RED, 0.8, 0.6, -1.25));

// ---------- 4 Rámy ----------
for (const y of [0.1, 1.2, 2.4]) {
  for (const z of [-1.25, 1.25]) for (let b = 0; b < 2; b++) {
    const c = (y === 1.2 && b === 1) ? ORANGE : YELLOW;
    add(3, tube(0.07, 1.5, 'x', c, -0.75 + b * 1.5, y, z));
  }
  for (const x of [-1.5, 0, 1.5]) add(3, tube(0.07, 2.5, 'z', x === 0 ? ORANGE : YELLOW, x, y, 0));
}

for (const x of [-1.5, 0, 1.5]) for (const z of [-1.25, 1.25]) {
  const g = new THREE.Group();
  for (const y of [0.1, 1.2, 2.4]) g.add(clamp3(x, y, z));
  add(3, g);
}

// ---------- 5 Guľôčkový bazén ----------
{
  add(4, box(1.2, 0.02, 1.5, 0x222222, -0.9, 0.05, -0.5, { tex: ['rubber', 0.9] }));
  const n = 380, balls = new THREE.InstancedMesh(new THREE.SphereGeometry(0.058, 14, 10), mat(0xffffff, { roughness: 0.25 }), n);
  const cols = [0xE58BA0, 0xF5C518, 0xD9D9D9, 0xE58BA0].map(c => new THREE.Color(c));
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < n; i++) {
    m4.setPosition(-1.45 + Math.random() * 1.1, 0.09 + Math.random() * 0.26, -1.2 + Math.random() * 1.4);
    balls.setMatrixAt(i, m4); balls.setColorAt(i, cols[i % 4]);
  }
  balls.castShadow = true; balls.receiveShadow = true;
  add(4, balls);
  for (const [len, ax, x, z] of [[1.2, 'x', -0.9, 0.25], [1.2, 'x', -0.9, -1.25], [1.5, 'z', -0.3, -0.5]])
    add(4, tube(0.05, len, ax, ORANGE, x, 0.45, z));
}

// ---------- 6 Poschodie ----------
add(5, box(3, 0.06, 1.0, 0xC23B22, 0, 1.17, 0.75, { tex: ['carpet', 1] }));
add(5, box(0.7, 0.06, 1.5, 0xC23B22, 1.15, 1.17, -0.5, { tex: ['carpet', 1] }));
for (const [x, z] of [[0.55, 0.7], [1.05, 0.7]]) {
  const p = shade(new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.7, 4), pbr('vinyl', 0xF5C518, 1, 1, { roughness: 0.7 })));
  p.rotation.y = Math.PI / 4; p.position.set(x, 1.55, z); add(5, p);
}
add(5, box(0.8, 0.28, 0.3, 0xC23B22, 0.0, 1.34, 0.8, { tex: ['vinyl', 0.8] }));
add(5, tube(0.1, 0.9, 'x', 0xF5C518, -0.1, 1.3, 0.35));
add(5, tube(0.1, 0.9, 'x', 0xF5C518, -1.0, 1.3, 0.35));
add(5, tube(0.09, 0.9, 'y', 0xF5C518, -0.55, 1.65, 1.05));

// ---------- 7 Šmykľavka ----------
{
  const N = 24, up = new THREE.Vector3(0, 1, 0), pts = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N, s = u * u * (3 - 2 * u);
    pts.push(new THREE.Vector3(1.0 - 1.3 * u, 0.3 + 0.9 * (1 - s), -0.75));
  }
  const prof = [[-0.25, 0.14], [-0.25, 0], [0.25, 0], [0.25, 0.14]];
  const pos = [], idx = [];
  pts.forEach((p, i) => {
    const t = pts[Math.min(i + 1, N)].clone().sub(pts[Math.max(i - 1, 0)]).normalize();
    const side = new THREE.Vector3().crossVectors(t, up).normalize();
    prof.forEach(([a, b]) => { const q = p.clone().addScaledVector(side, a).addScaledVector(up, b); pos.push(q.x, q.y, q.z); });
    if (i < N) for (let k = 0; k < 3; k++) { const a = i * 4 + k, b = a + 4; idx.push(a, b, a + 1, a + 1, b, b + 1); }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  add(6, shade(new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: 0x3F77C9, roughness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.15, side: THREE.DoubleSide }))));
}

// ---------- 8 Prístup ----------
{
  const th = Math.atan(0.6 / 1.2), len = Math.hypot(0.6, 1.2);
  const lad = new THREE.Group();
  const inner = new THREE.Group(); inner.rotation.y = Math.PI / 2;
  inner.add(net(0.8, len, 0, 0, 0, 0, 0, 0.12));
  lad.add(inner);
  for (let r = -len / 2 + 0.15; r < len / 2; r += 0.3) lad.add(tube(0.03, 0.8, 'z', ORANGE, 0, r, 0));
  for (const z of [-0.4, 0.4]) lad.add(tube(0.05, len, 'y', YELLOW, 0, 0, z));
  lad.position.set(1.8, 0.6, 0.7); lad.rotation.z = th;
  add(7, lad);
  const tun = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.9, 20, 1), new THREE.MeshStandardMaterial({ color: ORANGE, roughness: 0.5, side: THREE.DoubleSide })));
  tun.rotation.z = Math.PI / 2; tun.position.set(-0.85, 1.54, 0.8);
  add(7, tun);
}

// ---------- 9 Okrúhle okná a veža ----------
{
  const sh = new THREE.Shape();
  sh.moveTo(-1.1, 0); sh.lineTo(1.1, 0); sh.lineTo(1.1, 2.4); sh.lineTo(-1.1, 2.4); sh.closePath();
  const holes = [[-0.55, 1.7, 0.3], [0.4, 1.5, 0.22], [-0.3, 0.95, 0.3], [0.5, 0.65, 0.24]];
  for (const [x, y, r] of holes) { const h = new THREE.Path(); h.absarc(x, y, r, 0, Math.PI * 2, true); sh.holes.push(h); }
  const wall = shade(new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: false, curveSegments: 24 }), mat(0xffffff, { roughness: 0.8 })));
  wall.rotation.y = Math.PI / 2; wall.position.set(2.4, 0, -0.2);
  add(8, wall);
  for (const [x, y, r] of holes) {
    const ring = shade(new THREE.Mesh(new THREE.TorusGeometry(r, 0.018, 8, 36), mat(0x111111, { metalness: 0.8, roughness: 0.25 })));
    ring.rotation.y = Math.PI / 2; ring.position.set(2.4 - 0.002, y, -0.2 - x); add(8, ring);
  }
  const tx = 3.4, tz = -0.9, h = 0.6;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(8, tube(0.06, 2.2, 'y', RED, tx + sx * h, 1.1, tz + sz * h));
  [0.2, 1.0, 1.6, 2.2].forEach((y, i) => {
    for (const s of [-1, 1]) {
      add(8, tube(0.05, 1.2, 'x', i % 2 ? ORANGE : YELLOW, tx, y, tz + s * h));
      add(8, tube(0.05, 1.2, 'z', i % 2 ? ORANGE : YELLOW, tx + s * h, y, tz));
    }
  });
  add(8, box(1.1, 0.03, 1.1, 0xF08A1C, tx, 0.2, tz, { tex: ['rubber', 0.4] }));
  add(8, box(1.1, 0.03, 1.1, 0x151515, tx, 1.0, tz, { tex: ['rubber', 0.9] }));
  add(8, box(1.1, 0.03, 1.1, 0x151515, tx, 1.6, tz, { tex: ['rubber', 0.9] }));
}

// ---------- 10 Siete ----------
for (const z of [-1.25, 1.25]) for (const b of [0, 1]) for (const l of [0, 1])
  add(9, net(1.5, 1.2, -0.75 + b * 1.5, 0.6 + l * 1.2, z));
for (const l of [0, 1]) add(9, net(2.5, 1.2, -1.5, 0.6 + l * 1.2, 0, Math.PI / 2));
add(9, net(2.5, 1.2, 1.5, 1.8, 0, Math.PI / 2));
add(9, net(1.25, 1.2, 1.5, 0.6, -0.625, Math.PI / 2));
for (const s of [-1, 1]) {
  add(9, net(1.2, 2.2, 3.4, 1.1, -0.9 + s * 0.6));
  add(9, net(1.2, 2.2, 3.4 + s * 0.6, 1.1, -0.9, Math.PI / 2));
}

// ---------- 11 Strop ----------
for (const b of [0, 1]) add(10, net(1.5, 2.5, -0.75 + b * 1.5, 2.4, 0, 0, -Math.PI / 2));
add(10, box(1.2, 0.05, 1.0, 0xF5C518, 0.75, 2.46, 0.3, { tex: ['vinyl', 0.8] }));
add(10, box(0.3, 0.06, 2.3, ORANGE, -1.2, 2.34, 0, { tex: ['vinyl', 0.8] }));
add(10, box(0.3, 0.06, 2.3, ORANGE, 1.2, 2.34, 0, { tex: ['vinyl', 0.8] }));
{
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 5.4), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
  ceil.rotation.x = Math.PI / 2; ceil.position.set(1.8, 3.0, 0.3); ceil.receiveShadow = true;
  add(10, ceil);
  for (const [x, z] of [[0.3, 0.2], [3.4, -0.5]]) {
    const lamp = new THREE.Mesh(new THREE.CircleGeometry(0.45, 32), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    lamp.rotation.x = Math.PI / 2; lamp.position.set(x, 2.99, z); add(10, lamp);
  }
}

// ---------- 12 Dekor ----------
{
  const cv = document.createElement('canvas'); cv.width = 300; cv.height = 400;
  const g = cv.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, 400); bg.addColorStop(0, '#8EC9EE'); bg.addColorStop(1, '#6DB3E6');
  g.fillStyle = bg; g.fillRect(0, 0, 300, 400);
  g.fillStyle = '#8FCB6B';
  for (const [x, y, r] of [[60, 60, 24], [220, 90, 18], [90, 170, 20], [240, 230, 22], [70, 300, 26], [200, 340, 18]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  g.fillStyle = '#F4A3C0';
  for (const [x, y] of [[150, 40], [40, 220], [250, 160]]) { g.beginPath(); g.arc(x, y, 11, 0, 7); g.fill(); }
  g.fillStyle = '#4DAA3C';
  g.beginPath(); g.ellipse(150, 200, 34, 70, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(150, 360, 70, 26, 0, 0, 7); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(138, 340, 8, 0, 7); g.arc(168, 340, 8, 0, 7); g.fill();
  g.fillStyle = '#222'; g.beginPath(); g.arc(138, 340, 4, 0, 7); g.arc(168, 340, 4, 0, 7); g.fill();
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const ban = shade(new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.6), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, side: THREE.DoubleSide })));
  ban.position.set(-0.75, 1.62, 1.29);
  add(11, ban);
  [0.4, 0.8, 1.2, 1.6].forEach((x, i) => add(11, tube(0.08, 1.3, 'y', i % 2 ? ORANGE : 0xF5C518, x, 0.65, 2.0)));
  for (const x of [-0.3, -0.9]) { const d = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 24), pbr('rubber', 0x1a1a1a, 1, 1, { roughness: 0.8 }))); d.position.set(x, 0.03, 2.1); add(11, d); }
}

// ---------- kamera: plynulá stavba bez zastavení, model nad veľkým nadpisom ----------
const home = new THREE.Vector3(1.0, 1.0, 0.2);
let W = 0, H = 0;
function resize() {
  W = canvas.clientWidth; H = canvas.clientHeight;
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
}
addEventListener('resize', resize); resize();

const clamp = (v) => Math.min(1, Math.max(0, v));
const easeIO = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function place(s) {
  const asp = W / H;
  const rad = 12.6 * (asp < 1 ? 1 + (1 / asp - 1) * 0.55 : 1) - s * 0.8;
  const th = -0.95 + s * 1.15;
  camera.position.set(home.x + Math.sin(th) * rad, 4.4 - s * 0.6, home.z + Math.cos(th) * rad);
  camera.lookAt(home.x, home.y + 0.35, home.z); // model celý v ploche nad nadpisom
  camera.updateProjectionMatrix();
}

// diely: každý krok sa prekrýva s ďalším, takže stavba ide plynule bez zastavení
let boot = reduce ? 1 : 0;
function update(s) {
  steps.forEach((items, i) => {
    const p = clamp(Math.max((s - i * 0.068) / 0.2, i === 0 ? boot : 0));
    const n = items.length;
    items.forEach((it, k) => {
      const t = clamp((p - (k / n) * 0.45) / 0.55);
      it.g.visible = t > 0;
      if (t >= 1) {
        if (!it.done) { it.done = true; it.g.position.y = 0; for (const x of it.mats) { x.m.transparent = x.tr; x.m.opacity = x.op; x.m.depthWrite = x.dw; x.m.needsUpdate = true; } }
      } else if (t > 0) {
        const e = easeIO(t);
        if (it.done) { it.done = false; for (const x of it.mats) { x.m.transparent = true; x.m.depthWrite = false; x.m.needsUpdate = true; } }
        it.g.position.y = (1 - e) * 0.6; // diel jemne dosadne zhora
        for (const x of it.mats) x.m.opacity = x.op * e;
      }
    });
  });
}

const track = document.getElementById('track');
const targetS = () => reduce ? 1 : clamp(scrollY / Math.max(1, track.offsetHeight - innerHeight));
let cur = targetS(), prev = performance.now(), started = reduce;
export function start() { started = true; }
function frame(now) {
  const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
  const t = targetS();
  cur += (t - cur) * (1 - Math.exp(-dt * 4));
  if (Math.abs(t - cur) < 0.0002) cur = t;
  if (started) boot = Math.min(1, boot + dt / 1.6);
  update(cur);
  place(reduce ? 0.6 : cur);
  if (scrollY < track.offsetHeight) renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
