import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// koreň webu (jazykové verzie sú v podpriečinkoch)
const ROOT = document.documentElement.dataset.root || '';

const reduce = false; /* Obmedziť pohyb sa ignoruje: animácie bežia vždy (rozhodnutie Patrika 2026-11-11) */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const seg = (p, a, b) => ease(clamp((p - a) / (b - a)));

// skupiny podľa názvov objektov v Blenderi; posun pri rozložení v metroch (Y hore, Z k divákovi)
const GROUPS = [
  { id: 'zaklad', parts: ['spodok', 'podlozka', 'rury_modra', 'rury_tyrkys', 'rury_stlp', 'rury_svetla', 'rury_fialova', 'pasky', 'snury', 'mriezka', 'mriezka_o'], off: [0, 0, 0] },
  { id: 'plos', parts: ['podlaha_hore', 'podlaha_bleda', 'stupne_b', 'stupne_f', 'blok', 'blok_h', 'blok_n', 'fialovy_tram'], off: [0, 1.8, 0] },
  { id: 'smyk', parts: ['smyk'], off: [3.4, 0.4, 1.6] },
  { id: 'bazen', parts: ['bazen_vypln'], off: [0.6, 0, 3.8], balls: true },
  { id: 'prvky', parts: ['kruh', 'panel'], off: [1.4, 3.2, -1.6], isNew: true },
];

// Výsledné farby podľa renderu vesmírneho ihriska (v5/frames/render/f_004.webp): modrá, tyrkysová, fialová.
const NEW = { modra: '#2457c9', tyrkys: '#27a9a2', stlp: '#1d8c89', svetla: '#62c6bd', fialova: '#6a3cc0', podlaha: '#2a4fb0', bleda: '#cfd6ea', smyk: '#2f62d6', kruh: '#8754db', pasok: '#2b2d3a', snura: '#5b6070', cierna: '#22242c' };
// staré ihrisko je poškodené: pena odpadnutá (diel leží na zemi alebo visí), po prerábke je všetko na mieste a lesklejšie
const BROKEN = { blok_h: { drop: 1, rot: [1.25, 0, 0.35] }, fialovy_tram: { drop: 0.35, rot: [0, 0, 0.45] }, stupne_f: { drop: 0.6, rot: [0.5, 0.3, 0] } };
const OLD = { modra: [0.42, 0.3, 0.05], tyrkys: [0.3, 0.06, 0.04], stlp: [0.4, 0.28, 0.05], svetla: [0.1, 0.22, 0.06], fialova: [0.25, 0.05, 0.04], podlaha: [0.18, 0.13, 0.08], bleda: [0.2, 0.17, 0.1], smyk: [0.08, 0.2, 0.05], pasok: [0.08, 0.07, 0.06], snura: [0.12, 0.11, 0.1], cierna: [0.05, 0.05, 0.05] };
const BALLS_NEW = ['#2457c9', '#27a9a2', '#f2efe6', '#6a3cc0', '#ffffff'];
const BALLS_OLD = [[0.35, 0.3, 0.2], [0.3, 0.12, 0.08], [0.25, 0.25, 0.2]];
// lesk: nový stav má nižšiu drsnosť (MeshStandardMaterial)

class Play3D {
  constructor(root) {
    this.root = root;
    this.view = root.querySelector('.p3d-view');
    this.steps = [...root.querySelectorAll('.p3d-steps li')];
    this.p = 0; this.yaw = 0; this.yawV = 0; this.dirty = true; this.vis = false;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.view.prepend(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.cam = new THREE.PerspectiveCamera(28, 1, 0.1, 200);
    this.center = new THREE.Vector3(3.15, 1.4, -1.9);
    this.scene.add(new THREE.HemisphereLight(0xfffaf2, 0xb9b2a6, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(9, 14, 10); sun.target.position.copy(this.center); sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40 }); sun.shadow.bias = -0.0004;
    this.scene.add(sun, sun.target);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.14 }));
    ground.rotation.x = -Math.PI / 2; ground.position.set(this.center.x, -0.01, this.center.z); ground.receiveShadow = true;
    this.scene.add(ground);
  }

  async load() {
    const [gltf, balls] = await Promise.all([new GLTFLoader().loadAsync(ROOT + 'models/ihrisko.glb'), fetch(ROOT + 'models/gulicky.json').then((r) => r.json())]);
    const byName = {}; gltf.scene.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } byName[o.name] = o; });
    this.groups = GROUPS.map((g) => {
      const node = new THREE.Group(); this.scene.add(node);
      g.parts.forEach((n) => { const o = byName[n]; if (o) { o.updateWorldMatrix(true, false); const m = o.matrixWorld.clone(); node.add(o); o.matrix.copy(m); o.matrix.decompose(o.position, o.quaternion, o.scale); } });
      const center = new THREE.Box3().setFromObject(node).getCenter(new THREE.Vector3());
      return { ...g, node, mats: [], off: new THREE.Vector3(...g.off), center };
    });
    // poškodené diely: pôvodná poloha a poloha „odpadnutej“ peny
    this.broken = [];
    Object.entries(BROKEN).forEach(([n, b]) => {
      const o = byName[n]; if (!o) return;
      const box = new THREE.Box3().setFromObject(o);
      const p0 = o.position.clone(), q0 = o.quaternion.clone();
      const p1 = p0.clone(); p1.y -= Math.max(0, box.min.y) * b.drop;
      const q1 = q0.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(...b.rot)));
      this.broken.push({ o, p0, p1, q0, q1 });
    });
    // materiály: farba podľa názvu, staré a nové farby pre prerábku
    this.groups.forEach((g) => g.node.traverse((o) => {
      if (!o.isMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m, i) => {
        const key = m.name.split('.')[0];
        const mm = m.clone(); mm.roughness = 0.9; mm.metalness = 0;
        if (key === 'mriezka' || key === 'mriezka_o') { mm.transparent = true; mm.alphaTest = 0.35; mm.side = THREE.DoubleSide; }
        if (NEW[key]) mm.color.set(NEW[key]);
        mm.userData = { nw: NEW[key] && new THREE.Color(NEW[key]), old: OLD[key] && new THREE.Color().setRGB(...OLD[key]) };
        if (Array.isArray(o.material)) o.material[i] = mm; else o.material = mm;
        g.mats.push(mm);
      });
    }));
    // loptičky ako jedna inštancovaná sieť
    const bg = this.groups.find((g) => g.balls);
    const n = balls.p.length / 3;
    const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(balls.r, 1), new THREE.MeshStandardMaterial({ roughness: 0.35 }), n);
    const mtx = new THREE.Matrix4();
    this.ballCols = { nw: [], old: [] };
    for (let i = 0; i < n; i++) {
      mtx.makeTranslation(balls.p[i * 3], balls.p[i * 3 + 1], balls.p[i * 3 + 2]); im.setMatrixAt(i, mtx);
      const h = (i * 2654435761) >>> 0;
      this.ballCols.nw.push(new THREE.Color(BALLS_NEW[h % BALLS_NEW.length]));
      this.ballCols.old.push(new THREE.Color().setRGB(...BALLS_OLD[(h >>> 3) % BALLS_OLD.length]));
      im.setColorAt(i, this.ballCols.nw[i]);
    }
    im.castShadow = false; im.receiveShadow = true; bg.node.add(im); this.balls = im;
    this.root.classList.add('ready');
    this.resize(); this.dirty = true;
  }

  bind() {
    new ResizeObserver(() => this.resize()).observe(this.view);
    new IntersectionObserver((e) => { this.vis = e[0].isIntersecting; if (this.vis) this.dirty = true; }, { rootMargin: '200px' }).observe(this.root);
    // ťahanie otáča ihrisko, po pustení dobehne
    let drag = false, lx = 0;
    const cv = this.renderer.domElement;
    cv.addEventListener('pointerdown', (e) => { drag = true; lx = e.clientX; cv.setPointerCapture(e.pointerId); this.view.classList.add('drag'); });
    cv.addEventListener('pointermove', (e) => { if (!drag) return; const d = (e.clientX - lx) * 0.006; lx = e.clientX; this.yaw += d; this.yawV = d; this.dirty = true; });
    const up = () => { drag = false; this.view.classList.remove('drag'); };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    const stage = this.root.firstElementChild;
    const loop = () => {
      requestAnimationFrame(loop);
      if (!this.vis) return;
      const r = this.root.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      const p = reduce ? 1 : clamp((stickyTop - r.top) / Math.max(1, r.height - stage.offsetHeight));
      if (Math.abs(p - this.p) > 1e-4) { this.p = p; this.dirty = true; }
      if (!drag && Math.abs(this.yawV) > 1e-4) { this.yaw += this.yawV; this.yawV *= 0.92; this.dirty = true; }
      if (this.dirty) { this.update(); this.renderer.render(this.scene, this.cam); this.dirty = false; }
    };
    requestAnimationFrame(loop);
  }

  resize() {
    const w = this.view.clientWidth, h = this.view.clientHeight; if (!w || !h) return;
    this.renderer.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); this.dirty = true;
  }

  update() {
    const p = this.p;
    const out = seg(p, 0.16, 0.4) * (1 - seg(p, 0.6, 0.84));
    const recolor = seg(p, 0.4, 0.6);
    const show = seg(p, 0.6, 0.84);
    this.groups.forEach((g, i) => {
      const k = clamp(out * 1.3 - i * 0.03);
      g.node.position.copy(g.off).multiplyScalar(ease(k) * 1.15);
      g.node.position.y += Math.sin(k * Math.PI) * 0.6;
      if (g.isNew) {
        g.node.visible = show > 0;
        g.node.scale.setScalar(show);
        g.node.position.addScaledVector(g.center, 1 - show);
      }
      g.mats.forEach((m) => {
        if (m.userData.old && m.userData.nw) m.color.copy(m.userData.old).lerp(m.userData.nw, recolor);
        m.roughness = 0.92 - recolor * 0.62; m.metalness = recolor * 0.08;
      });
    });
    // odpadnutá pena sa vráti na miesto počas výmeny obalov
    const fix = seg(p, 0.3, 0.6);
    this.broken.forEach((b) => { b.o.position.lerpVectors(b.p1, b.p0, fix); b.o.quaternion.slerpQuaternions(b.q1, b.q0, fix); });
    if (this._rc !== recolor) {
      this._rc = recolor;
      const color = new THREE.Color();
      for (let i = 0; i < this.ballCols.nw.length; i++) {
        this.balls.setColorAt(i, color.copy(this.ballCols.old[i]).lerp(this.ballCols.nw[i], recolor));
      }
      this.balls.instanceColor.needsUpdate = true;
    }
    const a = -0.55 + p * 0.9 + this.yaw;
    const el = 0.36 - out * 0.06;
    const fit = Math.max(1, 1.07 / this.cam.aspect);
    const distance = (15.5 + out * 7.5) * fit;
    this.cam.position.set(this.center.x + Math.sin(a) * Math.cos(el) * distance, this.center.y + Math.sin(el) * distance, this.center.z + Math.cos(a) * Math.cos(el) * distance);
    this.cam.lookAt(this.center.x + out * 0.65, this.center.y + out * 0.55, this.center.z + out * 0.55);
    // kroky vľavo
    if (this.steps.length) {
      const at = this.steps.map((s) => +s.dataset.at);
      let cur = 0; at.forEach((x, i) => { if (p >= x) cur = i; });
      this.steps.forEach((s, i) => { s.classList.toggle('on', i === cur); s.classList.toggle('done', i < cur); });
    }
  }
}

const section = document.querySelector('.p3d');
const loader = new IntersectionObserver(async ([entry]) => {
  if (!entry.isIntersecting) return;
  loader.disconnect();
  let scene;
  try {
    scene = new Play3D(section);
    await scene.load();
    scene.bind();
  } catch (error) {
    scene?.renderer.dispose();
    console.warn('3D štúdia sa nenačítala.', error);
  }
}, { rootMargin: '650px' });
loader.observe(section);
