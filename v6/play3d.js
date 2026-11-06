// 3D ihrisko z Blendera (models/ihrisko.glb) viazané na scroll.
// režim "explode": ihrisko sa rozloží na 5 častí s popismi a znova zloží (Ihriská na mieru); konštrukcia so sieťami stojí
// režim "rebuild": staré ihrisko sa rozoberie, dostane nové farby a prvky a zloží sa (Prerábka)
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const reduce = false; // prefers-reduced-motion sa zámerne ignoruje
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const seg = (p, a, b) => ease(clamp((p - a) / (b - a)));

// skupiny podľa názvov objektov v Blenderi; posun pri rozložení v metroch (Y hore, Z k divákovi)
const GROUPS = [
  { id: 'zaklad', label: 'Konštrukcia a siete', parts: ['spodok', 'podlozka', 'rury_modra', 'rury_tyrkys', 'rury_stlp', 'rury_svetla', 'rury_fialova', 'pasky', 'snury', 'mriezka', 'mriezka_o'], off: [0, 0, 0] },
  { id: 'plos', label: 'Plošiny a schody', parts: ['podlaha_hore', 'podlaha_bleda', 'stupne_b', 'stupne_f', 'blok', 'blok_h', 'blok_n', 'fialovy_tram'], off: [0, 1.8, 0] },
  { id: 'smyk', label: 'Šmykľavka', parts: ['smyk'], off: [3.4, 0.4, 1.6] },
  { id: 'bazen', label: 'Guľôčkový bazén', parts: ['bazen_vypln'], off: [0.6, 0, 3.8], balls: true },
  { id: 'prvky', label: 'Herné prvky', parts: ['kruh', 'panel'], off: [1.4, 3.2, -1.6], isNew: true },
];

// farby z Blendera (lineárne RGB); "old" = vyblednuté staré ihrisko pre prerábku
const NEW = { modra: [0.01, 0.2, 0.72], tyrkys: [0.01, 0.46, 0.58], stlp: [0.01, 0.17, 0.62], svetla: [0.1, 0.42, 0.62], fialova: [0.08, 0.01, 0.36], podlaha: [0.01, 0.07, 0.46], bleda: [0.05, 0.3, 0.55], smyk: [0, 0.09, 0.55], kruh: [0.42, 0.68, 0.86], pasok: [0.03, 0.04, 0.05], snura: [0.3, 0.31, 0.33], cierna: [0.01, 0.01, 0.02] };
const OLD = { modra: [0.42, 0.3, 0.05], tyrkys: [0.3, 0.06, 0.04], stlp: [0.4, 0.28, 0.05], svetla: [0.1, 0.22, 0.06], fialova: [0.25, 0.05, 0.04], podlaha: [0.18, 0.13, 0.08], bleda: [0.2, 0.17, 0.1], smyk: [0.08, 0.2, 0.05], pasok: [0.08, 0.07, 0.06], snura: [0.12, 0.11, 0.1], cierna: [0.05, 0.05, 0.05] };
const BALLS_NEW = [[0.01, 0.2, 0.72], [0.01, 0.46, 0.58], [0.85, 0.85, 0.85], [0.08, 0.01, 0.36], [1, 0.02, 0.006]];
const BALLS_OLD = [[0.35, 0.3, 0.2], [0.3, 0.12, 0.08], [0.25, 0.25, 0.2]];

export class Play3D {
  constructor(root) {
    this.root = root;
    this.mode = root.dataset.mode || 'explode';
    this.view = root.querySelector('.p3d-view');
    this.steps = [...root.querySelectorAll('.p3d-steps li')];
    this.p = 0; this.yaw = 0; this.yawV = 0; this.dirty = true; this.vis = false;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
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
    sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40 }); sun.shadow.bias = -0.0004;
    this.scene.add(sun, sun.target);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.14 }));
    ground.rotation.x = -Math.PI / 2; ground.position.set(this.center.x, -0.01, this.center.z); ground.receiveShadow = true;
    this.scene.add(ground);
    this.labels = new Map();
    this.load();
    this.bind();
  }

  async load() {
    const [gltf, balls] = await Promise.all([new GLTFLoader().loadAsync('models/ihrisko.glb'), fetch('models/gulicky.json').then((r) => r.json())]);
    const byName = {}; gltf.scene.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } byName[o.name] = o; });
    this.groups = GROUPS.map((g) => {
      const node = new THREE.Group(); this.scene.add(node);
      g.parts.forEach((n) => { const o = byName[n]; if (o) { o.updateWorldMatrix(true, false); const m = o.matrixWorld.clone(); node.add(o); o.matrix.copy(m); o.matrix.decompose(o.position, o.quaternion, o.scale); } });
      return { ...g, node, mats: [], off: new THREE.Vector3(...g.off), box: new THREE.Box3().setFromObject(node) };
    });
    // materiály: farba podľa názvu, staré a nové farby pre prerábku
    this.groups.forEach((g) => g.node.traverse((o) => {
      if (!o.isMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m, i) => {
        const key = m.name.split('.')[0];
        const mm = m.clone(); mm.roughness = 0.62; mm.metalness = 0;
        if (key === 'mriezka' || key === 'mriezka_o') { mm.transparent = true; mm.alphaTest = 0.35; mm.side = THREE.DoubleSide; }
        if (NEW[key]) mm.color.setRGB(...NEW[key]);
        mm.userData = { nw: NEW[key] && new THREE.Color().setRGB(...NEW[key]), old: OLD[key] && new THREE.Color().setRGB(...OLD[key]) };
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
      this.ballCols.nw.push(new THREE.Color().setRGB(...BALLS_NEW[h % BALLS_NEW.length]));
      this.ballCols.old.push(new THREE.Color().setRGB(...BALLS_OLD[(h >>> 3) % BALLS_OLD.length]));
      im.setColorAt(i, this.ballCols.nw[i]);
    }
    im.castShadow = false; im.receiveShadow = true; bg.node.add(im); this.balls = im;
    bg.box = new THREE.Box3().setFromObject(bg.node);
    // popisy pri častiach
    this.groups.forEach((g) => {
      if (!g.label) return;
      const el = document.createElement('span'); el.className = 'p3d-tag lab'; el.textContent = g.label; this.view.append(el); this.labels.set(g.id, el);
    });
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
    const loop = () => {
      const track = this.root, r = track.getBoundingClientRect();
      const p = reduce ? (this.mode === 'explode' ? 0.6 : 1) : clamp(-r.top / Math.max(1, r.height - innerHeight));
      if (Math.abs(p - this.p) > 1e-4) { this.p = p; this.dirty = true; }
      if (!drag && Math.abs(this.yawV) > 1e-4) { this.yaw += this.yawV; this.yawV *= 0.92; this.dirty = true; }
      if (this.vis && this.dirty && this.groups) { this.update(); this.renderer.render(this.scene, this.cam); this.dirty = false; }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  resize() {
    const w = this.view.clientWidth, h = this.view.clientHeight; if (!w || !h) return;
    this.renderer.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); this.dirty = true;
  }

  update() {
    const p = this.p, ex = this.mode === 'explode';
    // rozloženie: explode 0.12 až 0.45 von, 0.82 až 1 späť; rebuild 0.18 až 0.42 von, 0.62 až 0.86 späť
    const out = ex ? seg(p, 0.12, 0.45) * (1 - seg(p, 0.8, 0.98)) : seg(p, 0.16, 0.4) * (1 - seg(p, 0.6, 0.84));
    const recolor = ex ? 1 : seg(p, 0.4, 0.6);
    const show = ex ? 1 : seg(p, 0.6, 0.86);
    this.groups.forEach((g, i) => {
      const k = clamp(out * 1.3 - i * 0.03);
      g.node.position.copy(g.off).multiplyScalar(ease(k) * (ex ? 1 : 1.15));
      if (!ex) g.node.position.y += Math.sin(k * Math.PI) * 0.6; // pri demontáži diely vyskočia nahor
      if (g.isNew) { const s = ex ? 1 : Math.max(0.0001, show); g.node.scale.setScalar(s); g.node.visible = s > 0.001; }
      if (!ex) g.mats.forEach((m) => { if (m.userData.old && m.userData.nw) m.color.copy(m.userData.old).lerp(m.userData.nw, recolor); });
    });
    if (!ex && this.balls && this._rc !== recolor) {
      this._rc = recolor; const c = new THREE.Color();
      for (let i = 0; i < this.ballCols.nw.length; i++) this.balls.setColorAt(i, c.copy(this.ballCols.old[i]).lerp(this.ballCols.nw[i], recolor));
      this.balls.instanceColor.needsUpdate = true;
    }
    // kamera: pomaly obieha so scrollom, ťahanie pridá otočenie
    const a = -0.55 + p * 0.9 + this.yaw, el = 0.36 - out * 0.06, R = (ex ? 15.5 : 14.5) + out * (ex ? 12 : 8);
    const w = this.view.clientWidth / Math.max(1, this.view.clientHeight), rr = R * (w < 1 ? 1.12 : 1);
    this.cam.position.set(this.center.x + Math.sin(a) * Math.cos(el) * rr, this.center.y + Math.sin(el) * rr, this.center.z + Math.cos(a) * Math.cos(el) * rr);
    this.cam.lookAt(this.center.x, this.center.y + out * 0.4, this.center.z);
    this.cam.updateMatrixWorld();
    // popisy: len v režime explode, pri rozložení
    const vw = this.view.clientWidth, vh = this.view.clientHeight, v = new THREE.Vector3();
    this.groups.forEach((g) => {
      const el2 = this.labels.get(g.id); if (!el2) return;
      const on = ex && out > 0.85;
      g.box.getCenter(v).add(g.node.position).project(this.cam);
      el2.style.transform = `translate(${((v.x + 1) / 2) * vw}px, ${((1 - v.y) / 2) * vh}px) translate(-50%, -50%)`;
      el2.classList.toggle('on', on);
    });
    // kroky vľavo
    if (this.steps.length) {
      const at = this.steps.map((s) => +s.dataset.at);
      let cur = 0; at.forEach((x, i) => { if (p >= x) cur = i; });
      this.steps.forEach((s, i) => { s.classList.toggle('on', i === cur); s.classList.toggle('done', i < cur); });
    }
  }
}

document.querySelectorAll('.p3d').forEach((el) => new Play3D(el));
