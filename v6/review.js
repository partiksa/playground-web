// Režim poznámok (?review): klik na prvok otvorí okno na poznámku, uloží sa cez tools/review_server.py do poznamky.json.
// Kláves R prepína medzi poznámkami a bežným klikaním.
const css = `
.rv-hl { position: fixed; z-index: 99990; pointer-events: none; border: 2px solid #FF2712; background: rgba(255,39,18,.08); transition: all .06s; }
.rv-tag { position: fixed; z-index: 99991; pointer-events: none; background: #FF2712; color: #fff; font: 600 11px/1.4 ui-monospace, Menlo, monospace; padding: 2px 6px; max-width: 60vw; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.rv-pin { position: absolute; z-index: 99992; width: 26px; height: 26px; margin: -13px 0 0 -13px; border-radius: 50%; background: #141310; color: #fff; font: 700 12px/26px system-ui, sans-serif; text-align: center; cursor: pointer; box-shadow: 0 0 0 2px #FF2712; }
.rv-box { position: fixed; z-index: 99995; width: min(360px, calc(100vw - 24px)); background: #F7F4EE; color: #141310; border: 1px solid #141310; box-shadow: 0 18px 50px -12px rgba(0,0,0,.45); padding: 14px; font: 14px/1.45 system-ui, sans-serif; }
.rv-box p { margin: 0 0 8px; font: 600 11px/1.4 ui-monospace, Menlo, monospace; color: #6B6659; word-break: break-all; }
.rv-box textarea { width: 100%; min-height: 96px; border: 1px solid #141310; padding: 8px; font: inherit; background: #fff; resize: vertical; box-sizing: border-box; }
.rv-box .row { display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px; }
.rv-box button, .rv-bar button { font: 600 12px/1 system-ui, sans-serif; padding: 9px 12px; border: 1px solid #141310; background: #141310; color: #fff; cursor: pointer; }
.rv-box button.ghost, .rv-bar button.ghost { background: transparent; color: #141310; }
.rv-bar { position: fixed; z-index: 99996; right: 12px; bottom: 12px; display: flex; gap: 6px; align-items: center; background: #F7F4EE; border: 1px solid #141310; padding: 6px; font: 600 12px/1 system-ui, sans-serif; }
.rv-bar .st { padding: 0 6px; }
.rv-bar .st.off { color: #6B6659; }
.rv-list { position: fixed; z-index: 99996; right: 12px; bottom: 58px; width: min(380px, calc(100vw - 24px)); max-height: 60vh; overflow: auto; background: #F7F4EE; border: 1px solid #141310; padding: 10px; font: 13px/1.4 system-ui, sans-serif; display: none; }
.rv-list.open { display: block; }
.rv-list li { list-style: none; padding: 8px 0; border-bottom: 1px solid rgba(20,19,16,.2); }
.rv-list ol { margin: 0; padding: 0; }
.rv-list small { color: #6B6659; display: block; font-family: ui-monospace, Menlo, monospace; word-break: break-all; }
.rv-list .del { float: right; background: none; border: 0; color: #FF2712; cursor: pointer; font-weight: 700; }
body.rv-on, body.rv-on * { cursor: crosshair !important; }
`;
// odkazy medzi stránkami si nechajú ?review (a ?grid, ak je zapnutá)
document.querySelectorAll('a[href$=".html"], a[href*=".html?"]').forEach((a) => {
  const u = new URL(a.getAttribute('href'), location.href); if (u.origin !== location.origin) return;
  u.searchParams.set('review', ''); if (document.documentElement.classList.contains('show-grid')) u.searchParams.set('grid', '');
  a.setAttribute('href', u.pathname.split('/').pop() + u.search.replace(/=(&|$)/g, '$1'));
});
const st = document.createElement('style'); st.textContent = css; document.head.append(st);
const page = location.pathname.split('/').pop() || 'index.html';
const ui = (cls, tag = 'div') => { const e = document.createElement(tag); e.className = cls; e.dataset.rv = '1'; return e; };
const hl = ui('rv-hl'), tag = ui('rv-tag'), bar = ui('rv-bar'), list = ui('rv-list');
document.body.append(hl, tag, bar, list);
let on = true, box = null, notes = [];

// jednoznačný selektor prvku (id, inak cesta s :nth-of-type)
const sel = (el) => {
  const parts = [];
  for (let e = el; e && e.nodeType === 1 && e !== document.body; e = e.parentElement) {
    if (e.id) { parts.unshift('#' + CSS.escape(e.id)); break; }
    let s = e.tagName.toLowerCase();
    const cls = [...e.classList].filter((c) => !/^(in|go|tx|rv|tl|tli|wd|wi|k|open|drag|ready)$/.test(c)).slice(0, 2);
    if (cls.length) s += '.' + cls.map(CSS.escape).join('.');
    const sib = e.parentElement ? [...e.parentElement.children].filter((x) => x.tagName === e.tagName) : [];
    if (sib.length > 1) s += `:nth-of-type(${sib.indexOf(e) + 1})`;
    parts.unshift(s);
  }
  return parts.join(' > ');
};
const label = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''}`;
const isUI = (el) => el.closest('[data-rv]');

const draw = () => {
  document.querySelectorAll('.rv-pin').forEach((p) => p.remove());
  const mine = notes.filter((n) => n.page === page);
  mine.forEach((n, i) => {
    let el = null; try { el = document.querySelector(n.selector); } catch {}
    const p = ui('rv-pin'); p.textContent = i + 1; p.title = n.note;
    if (el) { const r = el.getBoundingClientRect(); p.style.left = `${r.left + scrollX + 14}px`; p.style.top = `${r.top + scrollY + 14}px`; }
    else { p.style.left = `${(n.rect?.x || 20) + 14}px`; p.style.top = `${(n.rect?.y || 20) + (n.scroll || 0) + 14}px`; p.style.opacity = '.5'; }
    p.addEventListener('click', (e) => { e.stopPropagation(); list.classList.add('open'); });
    document.body.append(p);
  });
  list.innerHTML = `<strong>Poznámky na ${page}: ${mine.length}</strong><ol>${mine.map((n, i) => `<li><button class="del" data-id="${n.id}" data-rv="1" title="Zmazať">×</button><b>${i + 1}.</b> ${n.note.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c])}<small>${n.selector}</small></li>`).join('')}</ol>`;
  bar.innerHTML = `<span class="st ${on ? '' : 'off'}">${on ? 'Poznámky: zapnuté (R)' : 'Poznámky: vypnuté (R)'}</span><button class="ghost" data-act="list" data-rv="1">Zoznam (${mine.length})</button><button data-act="toggle" data-rv="1">${on ? 'Vypnúť' : 'Zapnúť'}</button>`;
  document.body.classList.toggle('rv-on', on);
};
const load = () => fetch('/api/notes').then((r) => r.json()).then((d) => { notes = d; draw(); }).catch(() => { bar.innerHTML = '<span class="st">Server poznámok nebeží: python3 tools/review_server.py</span>'; });

const close = () => { box?.remove(); box = null; };
const open = (el, x, y) => {
  close();
  const r = el.getBoundingClientRect(), txt = (el.innerText || el.getAttribute('alt') || el.getAttribute('aria-label') || '').trim().slice(0, 140);
  box = ui('rv-box');
  box.innerHTML = `<p>${label(el)}${txt ? ' · „' + txt.replace(/[<>&]/g, '') + '“' : ''}</p><textarea data-rv="1" placeholder="Čo na tomto prvku nesedí?"></textarea><div class="row"><button class="ghost" data-act="cancel" data-rv="1">Zrušiť</button><button data-act="save" data-rv="1">Uložiť (Cmd+Enter)</button></div>`;
  box.style.left = `${Math.min(x + 12, innerWidth - 384)}px`; box.style.top = `${Math.min(y + 12, innerHeight - 220)}px`;
  document.body.append(box);
  const ta = box.querySelector('textarea'); ta.focus();
  const save = () => {
    const note = ta.value.trim(); if (!note) return ta.focus();
    const payload = { page, selector: sel(el), tag: label(el), text: txt, note, viewport: `${innerWidth}x${innerHeight}`, scroll: Math.round(scrollY), rect: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) } };
    fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then((res) => res.json()).then((n) => { notes.push(n); close(); draw(); }).catch(() => alert('Uloženie zlyhalo. Beží tools/review_server.py?'));
  };
  box.addEventListener('click', (e) => { const a = e.target.dataset.act; if (a === 'save') save(); if (a === 'cancel') close(); });
  ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save(); if (e.key === 'Escape') close(); });
};

addEventListener('mousemove', (e) => {
  if (!on || box) { hl.style.display = tag.style.display = 'none'; return; }
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!el || isUI(el) || el === document.body || el === document.documentElement) { hl.style.display = tag.style.display = 'none'; return; }
  const r = el.getBoundingClientRect();
  Object.assign(hl.style, { display: 'block', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
  Object.assign(tag.style, { display: 'block', left: `${r.left}px`, top: `${Math.max(0, r.top - 20)}px` });
  tag.textContent = label(el);
}, { passive: true });

// v režime poznámok klik neotvorí odkaz ani tlačidlo
addEventListener('click', (e) => {
  const t = e.target;
  if (t.dataset?.act === 'toggle') { on = !on; close(); draw(); return; }
  if (t.dataset?.act === 'list') { list.classList.toggle('open'); return; }
  if (t.classList?.contains('del')) { fetch(`/api/notes?id=${t.dataset.id}`, { method: 'DELETE' }).then(load); return; }
  if (!on || isUI(t)) return;
  e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
  open(t, e.clientX, e.clientY);
}, true);
['pointerdown', 'mousedown'].forEach((ev) => addEventListener(ev, (e) => { if (on && !isUI(e.target)) { e.stopPropagation(); } }, true));
addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'r' && !e.target.closest('input, textarea') && !e.metaKey && !e.ctrlKey) { on = !on; close(); draw(); } });
addEventListener('resize', () => draw());
load();
