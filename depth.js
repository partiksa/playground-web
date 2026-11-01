// fotka s depth mapou: pri scrolle kamera ide dovnútra (bližšie veci rastú rýchlejšie), potom sekcia odíde
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const VS = `#version 300 es
in vec2 p; out vec2 uv;
void main() { uv = p * 0.5 + 0.5; uv.y = 1.0 - uv.y; gl_Position = vec4(p, 0.0, 1.0); }`;
const FS = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D img, dep;
uniform vec2 res, size, mouse;
uniform float t;
void main() {
  // cover: obrázok vyplní plochu
  float ra = res.x / res.y, ia = size.x / size.y;
  vec2 s = ra > ia ? vec2(1.0, ia / ra) : vec2(ra / ia, 1.0);
  vec2 c = vec2(0.5), q = (uv - c) * s;
  // základný zoom skryje okraje pri posune
  float base = 1.06 + 0.05 * t;
  vec2 st = c + q / base;
  for (int i = 0; i < 3; i++) {
    float d = texture(dep, st).r;
    st = c + q / (base + t * 0.22 * d) + mouse * (d - 0.5) * 0.018;
  }
  o = texture(img, clamp(st, 0.001, 0.999));
}`;

function sh(gl, type, src) {
  const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}
function loadImg(src) {
  return new Promise((ok, bad) => { const i = new Image(); i.decoding = 'async'; i.onload = () => ok(i); i.onerror = bad; i.src = src; });
}

export class DepthImage {
  constructor(host, img, depth) {
    this.host = host; this.t = 0; this.m = [0, 0]; this.mt = [0, 0]; this.ready = false;
    this.cv = document.createElement('canvas'); this.cv.setAttribute('aria-hidden', 'true');
    const gl = this.gl = this.cv.getContext('webgl2', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl, gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr); gl.useProgram(pr); this.pr = pr;
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = Object.fromEntries(['img', 'dep', 'res', 'size', 'mouse', 't'].map((n) => [n, gl.getUniformLocation(pr, n)]));
    Promise.all([loadImg(img), loadImg(depth)]).then(([a, b]) => {
      this.tex(0, a); this.tex(1, b);
      gl.uniform1i(this.u.img, 0); gl.uniform1i(this.u.dep, 1);
      gl.uniform2f(this.u.size, a.naturalWidth, a.naturalHeight);
      const im = host.querySelector(':scope > img'); host.insertBefore(this.cv, im ? im.nextSibling : host.firstChild);
      this.ready = true; this.resize(); this.draw();
    }).catch(() => {});
  }
  tex(unit, im) {
    const gl = this.gl, t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  resize() {
    if (!this.ready) return;
    const r = Math.min(devicePixelRatio, 2), w = this.host.clientWidth, h = this.host.clientHeight;
    this.cv.width = Math.round(w * r); this.cv.height = Math.round(h * r);
    this.gl.viewport(0, 0, this.cv.width, this.cv.height);
    this.gl.uniform2f(this.u.res, w, h);
    this.draw();
  }
  // t: 0 až 1, ako hlboko kamera vošla do fotky
  set(t, mx = 0, my = 0) { this.tt = t; this.mt = [mx, my]; }
  draw() {
    if (!this.ready) return;
    const gl = this.gl;
    gl.uniform1f(this.u.t, this.t); gl.uniform2f(this.u.mouse, this.m[0], this.m[1]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  // plynulé dobiehanie, vráti true, ak sa ešte hýbe
  step(dt) {
    const k = 1 - Math.exp(-dt * 6), tt = this.tt ?? this.t;
    const d = Math.abs(tt - this.t) + Math.abs(this.mt[0] - this.m[0]) + Math.abs(this.mt[1] - this.m[1]);
    if (d < 1e-4) return false;
    this.t += (tt - this.t) * k;
    this.m[0] += (this.mt[0] - this.m[0]) * k; this.m[1] += (this.mt[1] - this.m[1]) * k;
    this.draw(); return true;
  }
}

// sekcie .depth na stránke: progress podľa toho, ako dlho je fotka pripnutá
const secs = reduce ? [] : [...document.querySelectorAll('section.depth[data-img]')].map((sec) => {
  const pin = sec.querySelector('.pin'), d = new DepthImage(pin, sec.dataset.img, sec.dataset.depth);
  return { sec, pin, d };
});
if (secs.length) {
  let mx = 0, my = 0, prev = performance.now();
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; }, { passive: true });
  addEventListener('resize', () => secs.forEach((s) => s.d.resize()));
  const loop = (now) => {
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    for (const s of secs) {
      const r = s.sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const span = Math.max(1, s.sec.offsetHeight - innerHeight);
      const t = Math.min(1, Math.max(0, -r.top / span));
      s.d.set(t, mx, my);
      s.d.step(dt);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
